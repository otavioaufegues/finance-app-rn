import type { Transaction } from "@/services/transactions";

export type AuthStackParamList = {
  Login:
    | {
        message?: string;
        messageType?: "success" | "error";
      }
    | undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  TransactionsList: undefined;
  TransactionForm:
    | {
        transaction?: Transaction;
      }
    | undefined;
};
