import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getTransactionsPage,
  subscribeToTransactions,
  type Transaction,
  type TransactionsPageCursor,
} from "@/services/transactions";

export type TransactionsSummary = {
  income: number;
  expense: number;
  balance: number;
};

export type BalanceHistoryPoint = {
  date: string;
  balance: number;
};

const EMPTY_SUMMARY: TransactionsSummary = {
  income: 0,
  expense: 0,
  balance: 0,
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

  const balanceHistory = useMemo<BalanceHistoryPoint[]>(() => {
    if (!transactions.length) {
      return [];
    }

    const sortedTransactions = [...transactions].sort((firstTransaction, secondTransaction) =>
      firstTransaction.transactionDate.localeCompare(secondTransaction.transactionDate),
    );

    let currentBalance = 0;

    return sortedTransactions.map((transaction) => {
      currentBalance +=
        transaction.type === "income" ? transaction.amount : -transaction.amount;

      return {
        date: transaction.transactionDate,
        balance: currentBalance,
      };
    });
  }, [transactions]);

  return {
    transactions,
    summary,
    isLoading,
    balanceHistory,
  };
}

const DEFAULT_TRANSACTIONS_PAGE_SIZE = 20;

export function useInfiniteTransactions(
  pageSize = DEFAULT_TRANSACTIONS_PAGE_SIZE,
) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef<TransactionsPageCursor>(null);
  const hasMoreRef = useRef(true);
  const isLoadingMoreRef = useRef(false);

  const loadPage = useCallback(
    async (mode: "initial" | "refresh" | "append") => {
      if (!user) {
        setTransactions([]);
        cursorRef.current = null;
        setHasMore(false);
        hasMoreRef.current = false;
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
        isLoadingMoreRef.current = false;
        return;
      }

      if (mode === "append") {
        if (isLoadingMoreRef.current || !hasMoreRef.current) {
          return;
        }

        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
      } else if (mode === "refresh") {
        cursorRef.current = null;
        setHasMore(true);
        hasMoreRef.current = true;
        setIsRefreshing(true);
      } else {
        cursorRef.current = null;
        setHasMore(true);
        hasMoreRef.current = true;
        setTransactions([]);
        setIsLoading(true);
      }

      try {
        const page = await getTransactionsPage(
          user.uid,
          pageSize,
          mode === "append" ? cursorRef.current : null,
        );

        setTransactions((currentValue) =>
          mode === "append"
            ? [...currentValue, ...page.transactions]
            : page.transactions,
        );
        cursorRef.current = page.cursor;
        setHasMore(page.hasMore);
        hasMoreRef.current = page.hasMore;
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
        isLoadingMoreRef.current = false;
      }
    },
    [pageSize, user],
  );

  useEffect(() => {
    void loadPage("initial");
  }, [loadPage]);

  const refresh = useCallback(() => loadPage("refresh"), [loadPage]);
  const loadMore = useCallback(() => loadPage("append"), [loadPage]);

  return {
    transactions,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    refresh,
    loadMore,
  };
}
