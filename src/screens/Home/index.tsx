import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "styled-components/native";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/services/firestore";
import {
  createTransaction,
  removeTransaction,
  subscribeToTransactions,
  type Transaction,
  type TransactionInput,
  type TransactionType,
  updateTransaction,
} from "@/services/transactions";
import { AppStackParamList } from "@/routes/types";
import * as S from "./styles";

const getCurrentDate = () => new Date().toISOString().slice(0, 10);

const initialFormState = {
  title: "",
  category: "",
  amount: "",
  transactionDate: getCurrentDate(),
  type: "expense" as TransactionType,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const normalizeAmount = (value: string) =>
  Number(value.replace(/\./g, "").replace(",", "."));

export default function Home() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, "Home">>();
  const theme = useTheme();
  const { signOut, user } = useAuth();
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState(initialFormState.title);
  const [category, setCategory] = useState(initialFormState.category);
  const [amount, setAmount] = useState(initialFormState.amount);
  const [transactionDate, setTransactionDate] = useState(
    initialFormState.transactionDate,
  );
  const [type, setType] = useState<TransactionType>(initialFormState.type);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTitle(initialFormState.title);
    setCategory(initialFormState.category);
    setAmount(initialFormState.amount);
    setTransactionDate(getCurrentDate());
    setType(initialFormState.type);
    setEditingId(null);
  };

  useEffect(() => {
    if (!user) {
      setUserName("");
      setTransactions([]);
      return;
    }

    const unsubscribe = subscribeToTransactions(user.uid, setTransactions);

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadUserProfile = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        setUserName(profile?.name ?? user.displayName ?? user.email ?? "");
      } catch {
        setUserName(user.displayName ?? user.email ?? "");
      }
    };

    void loadUserProfile();
  }, [user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Transações",
      headerRight: () => (
        <TouchableOpacity onPress={() => void signOut()}>
          <S.HeaderButtonText>Sair</S.HeaderButtonText>
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: theme.colors.primary,
        fontSize: theme.fontSize.large,
      },
    });
  }, [navigation, signOut, theme.colors.primary, theme.fontSize.large]);

  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((total, item) => total + item.amount, 0);
    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((total, item) => total + item.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const handleSelectType = (nextType: TransactionType) => {
    setType(nextType);
  };

  const fillFormForEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setTitle(transaction.title);
    setCategory(transaction.category);
    setAmount(String(transaction.amount).replace(".", ","));
    setTransactionDate(transaction.transactionDate);
    setType(transaction.type);
    setMessage("Editando transação selecionada.");
  };

  const getPayload = (): TransactionInput | null => {
    const normalizedAmount = normalizeAmount(amount);

    if (!title.trim()) {
      setMessage("Informe a descrição da transação.");
      return null;
    }

    if (!category.trim()) {
      setMessage("Informe a categoria.");
      return null;
    }

    if (!transactionDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setMessage("Informe a data no formato AAAA-MM-DD.");
      return null;
    }

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setMessage("Informe um valor válido maior que zero.");
      return null;
    }

    return {
      title: title.trim(),
      category: category.trim(),
      amount: normalizedAmount,
      transactionDate,
      type,
    };
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    const payload = getPayload();

    if (!payload) {
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      if (editingId) {
        await updateTransaction(user.uid, editingId, payload);
        setMessage("Transação atualizada com sucesso.");
      } else {
        await createTransaction(user.uid, payload);
        setMessage("Transação cadastrada com sucesso.");
      }

      resetForm();
    } catch {
      setMessage("Não foi possível salvar a transação.");
    } finally {
      setSubmitting(false);
    }
  };

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
          try {
            await removeTransaction(user.uid, transactionId);

            if (editingId === transactionId) {
              resetForm();
            }

            setMessage("Transação removida com sucesso.");
          } catch {
            setMessage("Não foi possível remover a transação.");
          }
        },
      },
    ]);
  };

  return (
    <S.Container>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <S.HeaderContent>
            <S.WelcomeText>Bem vindo, {userName}!</S.WelcomeText>

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

            <S.FormCard>
              <S.SectionTitle>
                {editingId ? "Editar transação" : "Nova transação"}
              </S.SectionTitle>

              <S.Input
                placeholder="Descrição"
                value={title}
                onChangeText={setTitle}
              />
              <S.Input
                placeholder="Categoria"
                value={category}
                onChangeText={setCategory}
              />
              <S.Input
                placeholder="Valor"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
              <S.Input
                placeholder="Data (AAAA-MM-DD)"
                value={transactionDate}
                onChangeText={setTransactionDate}
              />

              <S.TypeSelector>
                <S.TypeButton
                  $selected={type === "income"}
                  onPress={() => handleSelectType("income")}
                >
                  <S.TypeButtonText $selected={type === "income"}>
                    Entrada
                  </S.TypeButtonText>
                </S.TypeButton>
                <S.TypeButton
                  $selected={type === "expense"}
                  onPress={() => handleSelectType("expense")}
                >
                  <S.TypeButtonText $selected={type === "expense"}>
                    Saída
                  </S.TypeButtonText>
                </S.TypeButton>
              </S.TypeSelector>

              {!!message && <S.Message>{message}</S.Message>}

              <Button
                title={editingId ? "Salvar alterações" : "Cadastrar transação"}
                onPress={handleSubmit}
                loading={submitting}
              />
              {editingId ? (
                <Button
                  title="Cancelar edição"
                  onPress={resetForm}
                  variant="outline"
                />
              ) : null}
            </S.FormCard>

            <S.SectionTitle>Histórico</S.SectionTitle>
          </S.HeaderContent>
        }
        contentContainerStyle={S.listContent}
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
              <S.ActionButton onPress={() => fillFormForEdit(item)}>
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
