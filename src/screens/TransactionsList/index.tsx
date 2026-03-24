import { useCallback, useLayoutEffect } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "styled-components/native";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import {
  useInfiniteTransactions,
  useTransactions,
} from "@/hooks/useTransactions";
import { removeTransaction } from "@/services/transactions";
import { AppStackParamList } from "@/routes/types";
import * as S from "./styles";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function TransactionsList() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AppStackParamList, "TransactionsList">
    >();
  const theme = useTheme();
  const { user } = useAuth();
  const { summary } = useTransactions();
  const {
    transactions,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    refresh,
    loadMore,
  } = useInfiniteTransactions();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Transacoes",
      headerTitleStyle: {
        color: theme.colors.primary,
        fontSize: theme.fontSize.large,
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("TransactionForm")}>
          <S.HeaderButtonText>Adicionar</S.HeaderButtonText>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme.colors.primary, theme.fontSize.large]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const handleDelete = (transactionId: string) => {
    if (!user) {
      return;
    }

    Alert.alert("Excluir transacao", "Deseja remover esta transacao?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await removeTransaction(user.uid, transactionId);
          void refresh();
        },
      },
    ]);
  };

  return (
    <S.Container>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={S.listContent}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (!isLoading && hasMore) {
            void loadMore();
          }
        }}
        refreshing={isRefreshing}
        onRefresh={() => void refresh()}
        ListHeaderComponent={
          <S.HeaderContent>
            <S.SummaryRow>
              <S.SummaryCard>
                <S.SummaryLabel>Entradas</S.SummaryLabel>
                <S.SummaryValue $variant="income">
                  {formatCurrency(summary.income)}
                </S.SummaryValue>
              </S.SummaryCard>

              <S.SummaryCard>
                <S.SummaryLabel>Saidas</S.SummaryLabel>
                <S.SummaryValue $variant="expense">
                  {formatCurrency(summary.expense)}
                </S.SummaryValue>
              </S.SummaryCard>
            </S.SummaryRow>

            <S.BalanceCard>
              <S.SummaryLabel>Saldo</S.SummaryLabel>
              <S.BalanceValue $positive={summary.balance >= 0}>
                {formatCurrency(summary.balance)}
              </S.BalanceValue>
            </S.BalanceCard>

            <Button
              title="Nova transacao"
              onPress={() => navigation.navigate("TransactionForm")}
            />

            <S.SectionTitle>Historico</S.SectionTitle>
          </S.HeaderContent>
        }
        ItemSeparatorComponent={() => <S.ItemSeparator />}
        ListEmptyComponent={
          <S.EmptyState>
            {isLoading
              ? "Carregando transacoes..."
              : "Nenhuma transacao cadastrada para este usuario."}
          </S.EmptyState>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <S.ListFooterText>Carregando mais transacoes...</S.ListFooterText>
          ) : !hasMore && transactions.length ? (
            <S.ListFooterText>
              Todas as transacoes foram carregadas.
            </S.ListFooterText>
          ) : null
        }
        renderItem={({ item }) => (
          <S.TransactionCard>
            <S.TransactionRow>
              <S.TransactionTitle>{item.title}</S.TransactionTitle>
              <S.TransactionAmount $type={item.type}>
                {item.type === "expense" ? "-" : "+"}
                {formatCurrency(item.amount)}
              </S.TransactionAmount>
            </S.TransactionRow>

            <S.TransactionMeta>
              {item.category} | {item.transactionDate}
            </S.TransactionMeta>

            <S.ActionsRow>
              <S.ActionButton
                onPress={() =>
                  navigation.navigate("TransactionForm", {
                    transaction: item,
                  })
                }
              >
                <S.ActionButtonText>Editar</S.ActionButtonText>
              </S.ActionButton>
              <S.ActionButton onPress={() => handleDelete(item.id)}>
                <S.ActionButtonText $danger>Excluir</S.ActionButtonText>
              </S.ActionButton>
            </S.ActionsRow>
          </S.TransactionCard>
        )}
      />
    </S.Container>
  );
}
