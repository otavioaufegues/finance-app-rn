import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  subscribeToTransactions,
  type Transaction,
} from "@/services/transactions";

export type TransactionsSummary = {
  income: number;
  expense: number;
  balance: number;
};

export type TransactionsChartData = {
  categories: string[];
  series: number[];
};

const EMPTY_SUMMARY: TransactionsSummary = {
  income: 0,
  expense: 0,
  balance: 0,
};

const EMPTY_CHART_DATA: TransactionsChartData = {
  categories: [],
  series: [],
};

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = subscribeToTransactions(user.uid, (nextTransactions) => {
      setTransactions(nextTransactions);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const summary = useMemo<TransactionsSummary>(() => {
    if (!transactions.length) {
      return EMPTY_SUMMARY;
    }

    const totals = transactions.reduce(
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
  }, [transactions]);

  return {
    transactions,
    summary,
    isLoading,
    chartData: EMPTY_CHART_DATA,
  };
}
