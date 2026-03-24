import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
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

const formatAmountInput = (value: string) => {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const amountInCents = Number(digits);

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountInCents / 100);
};

const formatAmountFromNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const CALENDAR_DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const parseDateString = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return new Date();
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const formatDateForDisplay = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return value;
  }

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
};

const formatDateToStorage = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [calendarMonthDate, setCalendarMonthDate] = useState(() =>
    parseDateString(getCurrentDate()),
  );

  useEffect(() => {
    if (!transaction) {
      return;
    }

    setTitle(transaction.title);
    setCategory(transaction.category);
    setAmount(formatAmountFromNumber(transaction.amount));
    setTransactionDate(transaction.transactionDate);
    setType(transaction.type);
    setIsCategoryOpen(false);
    setCalendarMonthDate(parseDateString(transaction.transactionDate));
  }, [transaction]);

  const calendarDays = useMemo(() => {
    const year = calendarMonthDate.getFullYear();
    const month = calendarMonthDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingEmptyDays = firstDayOfMonth.getDay();
    const days = [];

    for (let index = 0; index < leadingEmptyDays; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(year, month, day));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [calendarMonthDate]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format(calendarMonthDate),
    [calendarMonthDate],
  );

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

  const handleOpenCalendar = () => {
    setCalendarMonthDate(parseDateString(transactionDate));
    setIsCalendarOpen(true);
  };

  const handleSelectDate = (date: Date) => {
    setTransactionDate(formatDateToStorage(date));
    setCalendarMonthDate(date);
    setIsCalendarOpen(false);
  };

  const handleChangeCalendarMonth = (direction: "previous" | "next") => {
    setCalendarMonthDate((currentValue) => {
      const nextMonth = new Date(currentValue);
      nextMonth.setMonth(
        currentValue.getMonth() + (direction === "next" ? 1 : -1),
      );
      return nextMonth;
    });
  };

  const handleAmountChange = (value: string) => {
    setAmount(formatAmountInput(value));
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
              placeholder="0,00"
              keyboardType="number-pad"
              value={amount}
              onChangeText={handleAmountChange}
            />
            <S.FieldLabel>Data</S.FieldLabel>
            <S.DateButton onPress={handleOpenCalendar}>
              <S.DateButtonContent>
                <S.DateButtonLabel>Selecionar data</S.DateButtonLabel>
                <S.DateButtonValue>
                  {formatDateForDisplay(transactionDate)}
                </S.DateButtonValue>
              </S.DateButtonContent>
              <S.DateButtonHint>Abrir calendario</S.DateButtonHint>
            </S.DateButton>

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

      <Modal
        animationType="fade"
        transparent
        visible={isCalendarOpen}
        onRequestClose={() => setIsCalendarOpen(false)}
      >
        <S.CalendarOverlay>
          <Pressable
            style={{ flex: 1, width: "100%" }}
            onPress={() => setIsCalendarOpen(false)}
          />

          <S.CalendarModalCard>
            <S.CalendarHeader>
              <S.CalendarMonthButton
                onPress={() => handleChangeCalendarMonth("previous")}
              >
                <S.CalendarMonthButtonText>{"<"}</S.CalendarMonthButtonText>
              </S.CalendarMonthButton>

              <S.CalendarMonthLabel>{monthLabel}</S.CalendarMonthLabel>

              <S.CalendarMonthButton
                onPress={() => handleChangeCalendarMonth("next")}
              >
                <S.CalendarMonthButtonText>{">"}</S.CalendarMonthButtonText>
              </S.CalendarMonthButton>
            </S.CalendarHeader>

            <S.CalendarWeekRow>
              {CALENDAR_DAY_LABELS.map((dayLabel) => (
                <S.CalendarWeekLabel key={dayLabel}>
                  {dayLabel}
                </S.CalendarWeekLabel>
              ))}
            </S.CalendarWeekRow>

            <S.CalendarGrid>
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <S.CalendarEmptyDay key={`empty-${index}`} />;
                }

                const dayValue = date.getDate();
                const dateValue = formatDateToStorage(date);
                const isSelected = dateValue === transactionDate;
                const isToday = dateValue === getCurrentDate();

                return (
                  <S.CalendarDayButton
                    key={dateValue}
                    $selected={isSelected}
                    onPress={() => handleSelectDate(date)}
                  >
                    <S.CalendarDayText $selected={isSelected} $today={isToday}>
                      {dayValue}
                    </S.CalendarDayText>
                  </S.CalendarDayButton>
                );
              })}
            </S.CalendarGrid>

            <S.CalendarFooter>
              <S.CalendarFooterText>
                Data escolhida: {formatDateForDisplay(transactionDate)}
              </S.CalendarFooterText>
              <Button
                title="Fechar"
                onPress={() => setIsCalendarOpen(false)}
                variant="outline"
              />
            </S.CalendarFooter>
          </S.CalendarModalCard>
        </S.CalendarOverlay>
      </Modal>
    </KeyboardAvoidingView>
  );
}
