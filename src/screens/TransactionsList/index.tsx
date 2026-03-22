import { useLayoutEffect } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "styled-components/native";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
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
    useNavigation<NativeStackNavigationProp<AppStackParamList, "TransactionsList">>();
  const theme = useTheme();
  const { user } = useAuth();
  const { transactions, summary } = useTransactions();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Transações",
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

  const handleDelete = (transactionId: string) => {
    if (!user) {
      return;
    }

    Alert.alert("Excluir transação", "Deseja remover esta transação?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await removeTransaction(user.uid, transactionId);
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
                <S.SummaryLabel>Saídas</S.SummaryLabel>
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
              title="Nova transação"
              onPress={() => navigation.navigate("TransactionForm")}
            />

            <S.SectionTitle>Histórico</S.SectionTitle>
          </S.HeaderContent>
        }
        ItemSeparatorComponent={() => <S.ItemSeparator />}
        ListEmptyComponent={
          <S.EmptyState>
            Nenhuma transação cadastrada para este usuário.
          </S.EmptyState>
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
              {item.category} • {item.transactionDate}
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
