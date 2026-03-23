import { useEffect, useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import {
  createTransaction,
  type TransactionInput,
  type TransactionType,
  updateTransaction,
} from "@/services/transactions";
import { AppStackParamList } from "@/routes/types";
import * as S from "./styles";

const getCurrentDate = () => new Date().toISOString().slice(0, 10);

const normalizeAmount = (value: string) =>
  Number(value.replace(/\./g, "").replace(",", "."));

export default function TransactionForm() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, "TransactionForm">>();
  const route =
    useRoute<NativeStackScreenProps<AppStackParamList, "TransactionForm">["route"]>();
  const { user } = useAuth();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const transaction = route.params?.transaction;
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState(getCurrentDate());
  const [type, setType] = useState<TransactionType>("expense");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!transaction) {
      return;
    }

    setTitle(transaction.title);
    setCategory(transaction.category);
    setAmount(String(transaction.amount).replace(".", ","));
    setTransactionDate(transaction.transactionDate);
    setType(transaction.type);
    setIsCategoryOpen(false);
  }, [transaction]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: transaction ? "Editar transacao" : "Nova transacao",
    });
  }, [navigation, transaction]);

  const getPayload = (): TransactionInput | null => {
    const normalizedAmount = normalizeAmount(amount);

    if (!title.trim()) {
      setMessage("Informe a descricao da transacao.");
      return null;
    }

    if (!category.trim()) {
      setMessage("Selecione uma categoria.");
      return null;
    }

    if (!transactionDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setMessage("Informe a data no formato AAAA-MM-DD.");
      return null;
    }

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setMessage("Informe um valor valido maior que zero.");
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

      if (transaction) {
        await updateTransaction(user.uid, transaction.id, payload);
      } else {
        await createTransaction(user.uid, payload);
      }

      navigation.goBack();
    } catch {
      setMessage("Nao foi possivel salvar a transacao.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <S.Container>
          <S.FormCard>
            <S.SectionTitle>
              {transaction ? "Atualize os dados" : "Preencha os dados da transacao"}
            </S.SectionTitle>

            <S.Input
              placeholder="Descricao"
              value={title}
              onChangeText={setTitle}
            />

            <S.FieldLabel>Categoria</S.FieldLabel>
            <S.SelectButton onPress={() => setIsCategoryOpen((currentValue) => !currentValue)}>
              <S.SelectButtonText $placeholder={!category}>
                {category ||
                  (categoriesLoading ? "Carregando categorias..." : "Selecione uma categoria")}
              </S.SelectButtonText>
            </S.SelectButton>

            {isCategoryOpen && (
              <S.SelectList>
                {categories.map((item) => (
                  <S.SelectOption
                    key={item.id}
                    onPress={() => {
                      setCategory(item.name);
                      setIsCategoryOpen(false);
                    }}
                  >
                    <S.SelectOptionText>{item.name}</S.SelectOptionText>
                  </S.SelectOption>
                ))}

                {!categories.length && !categoriesLoading && (
                  <S.EmptyOptionsText>Nenhuma categoria disponivel.</S.EmptyOptionsText>
                )}
              </S.SelectList>
            )}

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
                onPress={() => setType("income")}
              >
                <S.TypeButtonText $selected={type === "income"}>
                  Entrada
                </S.TypeButtonText>
              </S.TypeButton>
              <S.TypeButton
                $selected={type === "expense"}
                onPress={() => setType("expense")}
              >
                <S.TypeButtonText $selected={type === "expense"}>
                  Saida
                </S.TypeButtonText>
              </S.TypeButton>
            </S.TypeSelector>

            {!!message && <S.Message>{message}</S.Message>}

            <Button
              title={transaction ? "Salvar alteracoes" : "Cadastrar transacao"}
              onPress={handleSubmit}
              loading={submitting}
            />
            <Button
              title="Cancelar"
              onPress={() => navigation.goBack()}
              variant="outline"
            />
          </S.FormCard>
        </S.Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
