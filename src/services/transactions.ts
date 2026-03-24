import {
  addDoc,
  collection,
  type DocumentData,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  type QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firestore";

export type TransactionType = "income" | "expense";

export type TransactionInput = {
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  transactionDate: string;
};

export type Transaction = TransactionInput & {
  id: string;
};

const getTransactionsCollection = (uid: string) =>
  collection(db, "users", uid, "transactions");

const mapTransactionDocument = (
  item: QueryDocumentSnapshot<DocumentData>,
): Transaction => ({
  id: item.id,
  ...(item.data() as TransactionInput),
});

export const subscribeToTransactions = (
  uid: string,
  callback: (transactions: Transaction[]) => void,
) => {
  const transactionsQuery = query(
    getTransactionsCollection(uid),
    orderBy("transactionDate", "desc"),
  );

  return onSnapshot(transactionsQuery, (snapshot) => {
    const transactions = snapshot.docs.map(mapTransactionDocument);

    callback(transactions);
  });
};

export type TransactionsPageCursor = QueryDocumentSnapshot<DocumentData> | null;

export type TransactionsPage = {
  transactions: Transaction[];
  cursor: TransactionsPageCursor;
  hasMore: boolean;
};

export const getTransactionsPage = async (
  uid: string,
  pageSize: number,
  cursor?: TransactionsPageCursor,
): Promise<TransactionsPage> => {
  const baseQuery = query(
    getTransactionsCollection(uid),
    orderBy("transactionDate", "desc"),
  );

  const paginatedQuery = cursor
    ? query(baseQuery, startAfter(cursor), limit(pageSize))
    : query(baseQuery, limit(pageSize));

  const snapshot = await getDocs(paginatedQuery);

  return {
    transactions: snapshot.docs.map(mapTransactionDocument),
    cursor: snapshot.docs[snapshot.docs.length - 1] ?? null,
    hasMore: snapshot.docs.length === pageSize,
  };
};

export const createTransaction = async (uid: string, data: TransactionInput) => {
  await addDoc(getTransactionsCollection(uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateTransaction = async (
  uid: string,
  transactionId: string,
  data: TransactionInput,
) => {
  await updateDoc(doc(db, "users", uid, "transactions", transactionId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const removeTransaction = async (uid: string, transactionId: string) => {
  await deleteDoc(doc(db, "users", uid, "transactions", transactionId));
};
