import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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

export const subscribeToTransactions = (
  uid: string,
  callback: (transactions: Transaction[]) => void,
) => {
  const transactionsQuery = query(
    getTransactionsCollection(uid),
    orderBy("transactionDate", "desc"),
  );

  return onSnapshot(transactionsQuery, (snapshot) => {
    const transactions = snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as TransactionInput),
    }));

    callback(transactions);
  });
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
