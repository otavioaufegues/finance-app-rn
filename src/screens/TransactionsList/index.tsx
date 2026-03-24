import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "styled-components/native";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useInfiniteTransactions, useTransactions, type TransactionsSummary } from "@/hooks/useTransactions";
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
  const { transactions: allTransactions, summary } = useTransactions();
  const [selectedType, setSelectedType] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          allTransactions
            .map((transaction) => transaction.category.trim())
            .filter(Boolean),
        ),
      ).sort((firstCategory, secondCategory) =>
        firstCategory.localeCompare(secondCategory, "pt-BR"),
      ),
    [allTransactions],
  );

  const hasActiveFilters =
    selectedType !== "all" || selectedCategory !== "all";

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchesType =
          selectedType === "all" || transaction.type === selectedType;
        const matchesCategory =
          selectedCategory === "all" || transaction.category.trim() === selectedCategory;

        return matchesType && matchesCategory;
      }),
    [selectedCategory, selectedType, transactions],
  );

  const filteredSummary = useMemo<TransactionsSummary>(() => {
    if (!hasActiveFilters) {
      return summary;
    }

    const totals = filteredTransactions.reduce(
      (accumulator, transaction) => {
        if (transaction.type === "income") {
          accumulator.income += transaction.amount;
        } else {
          accumulator.expense += transaction.amount;
        }

        return accumulator;
      },
      { income: 0, expense: 0 },
    );

    return {
      income: totals.income,
      expense: totals.expense,
      balance: totals.income - totals.expense,
    };
  }, [filteredTransactions, hasActiveFilters, summary]);

  useEffect(() => {
    if (
      !hasActiveFilters ||
      isLoading ||
      isLoadingMore ||
      !hasMore ||
      filteredTransactions.length > 0
    ) {
      return;
    }

    void loadMore();
  }, [
    filteredTransactions.length,
    hasActiveFilters,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
  ]);

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedCategory("all");
  };

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
        },
      },
    ]);
  };

  return (
    <S.Container>
      <FlatList
        data={filteredTransactions}
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
                  {formatCurrency(filteredSummary.income)}
                </S.SummaryValue>
              </S.SummaryCard>

              <S.SummaryCard>
                <S.SummaryLabel>Saidas</S.SummaryLabel>
                <S.SummaryValue $variant="expense">
                  {formatCurrency(filteredSummary.expense)}
                </S.SummaryValue>
              </S.SummaryCard>
            </S.SummaryRow>

            <S.BalanceCard>
              <S.SummaryLabel>Saldo</S.SummaryLabel>
              <S.BalanceValue $positive={filteredSummary.balance >= 0}>
                {formatCurrency(filteredSummary.balance)}
              </S.BalanceValue>
            </S.BalanceCard>

            <Button
              title="Nova transacao"
              onPress={() => navigation.navigate("TransactionForm")}
            />

            <S.FiltersCard>
              <S.FiltersHeader>
                <S.SectionTitle>Filtros</S.SectionTitle>
                {hasActiveFilters ? (
                  <S.ClearFiltersButton onPress={clearFilters}>
                    <S.ClearFiltersText>Limpar</S.ClearFiltersText>
                  </S.ClearFiltersButton>
                ) : null}
              </S.FiltersHeader>

              <S.FilterLabel>Tipo</S.FilterLabel>
              <S.ChipsScroll
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={S.chipsContent}
              >
                <S.FilterChip
                  $selected={selectedType === "all"}
                  onPress={() => setSelectedType("all")}
                >
                  <S.FilterChipText $selected={selectedType === "all"}>
                    Todos
                  </S.FilterChipText>
                </S.FilterChip>
                <S.FilterChip
                  $selected={selectedType === "income"}
                  onPress={() => setSelectedType("income")}
                >
                  <S.FilterChipText $selected={selectedType === "income"}>
                    Entradas
                  </S.FilterChipText>
                </S.FilterChip>
                <S.FilterChip
                  $selected={selectedType === "expense"}
                  onPress={() => setSelectedType("expense")}
                >
                  <S.FilterChipText $selected={selectedType === "expense"}>
                    Saidas
                  </S.FilterChipText>
                </S.FilterChip>
              </S.ChipsScroll>

              <S.FilterLabel>Categoria</S.FilterLabel>
              <S.ChipsScroll
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={S.chipsContent}
              >
                <S.FilterChip
                  $selected={selectedCategory === "all"}
                  onPress={() => setSelectedCategory("all")}
                >
                  <S.FilterChipText $selected={selectedCategory === "all"}>
                    Todas
                  </S.FilterChipText>
                </S.FilterChip>
                {categories.map((category) => {
                  const isSelected = selectedCategory === category;

                  return (
                    <S.FilterChip
                      key={category}
                      $selected={isSelected}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <S.FilterChipText $selected={isSelected}>
                        {category}
                      </S.FilterChipText>
                    </S.FilterChip>
                  );
                })}
              </S.ChipsScroll>
            </S.FiltersCard>

            <S.SectionTitle>Historico</S.SectionTitle>
          </S.HeaderContent>
        }
        ItemSeparatorComponent={() => <S.ItemSeparator />}
        ListEmptyComponent={
          <S.EmptyState>
            {isLoading
              ? "Carregando transacoes..."
              : hasActiveFilters
                ? "Nenhuma transacao encontrada com os filtros aplicados."
                : "Nenhuma transacao cadastrada para este usuario."}
          </S.EmptyState>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <S.ListFooterText>Carregando mais transacoes...</S.ListFooterText>
          ) : !hasMore && filteredTransactions.length ? (
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
