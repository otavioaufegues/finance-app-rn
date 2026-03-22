import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "styled-components/native";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { AppStackParamList } from "@/routes/types";
import { getUserProfile } from "@/services/firestore";
import * as S from "./styles";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatChartLabel = (date: string) => {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}`;
};

export default function Home() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, "Home">>();
  const { width: screenWidth } = useWindowDimensions();
  const theme = useTheme();
  const { signOut, user } = useAuth();
  const { summary, balanceHistory } = useTransactions();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!user) {
      setUserName("");
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
      title: "Home",
      headerRight: () => (
        <TouchableOpacity onPress={() => void signOut()}>
          <S.HeaderButtonText>Sair</S.HeaderButtonText>
        </TouchableOpacity>
      ),
    });
  }, [navigation, signOut]);

  const chartData = useMemo(() => {
    if (!balanceHistory.length) {
      return [];
    }

    const labelStep = Math.max(1, Math.ceil(balanceHistory.length / 4));

    return balanceHistory.map((item, index) => ({
      value: Number(item.balance.toFixed(2)),
      dataPointText: formatCompactCurrency(item.balance),
      textColor: theme.colors.text,
      textFontSize: 10,
      textShiftY: -18,
      textShiftX: index === balanceHistory.length - 1 ? -20 : 0,
      label:
        index === 0 ||
        index === balanceHistory.length - 1 ||
        index % labelStep === 0
          ? formatChartLabel(item.date)
          : "",
    }));
  }, [balanceHistory, theme.colors.text]);

  const chartWidth = Math.max(screenWidth - 100, 280);

  return (
    <S.Container>
      <ScrollView contentContainerStyle={S.scrollContent}>
        <S.Content>
          <S.Title>Bem-vindo{userName ? `, ${userName}` : ""}</S.Title>
          <S.Subtitle>
            Acompanhe seu saldo e a evolucao das movimentacoes em um so lugar.
          </S.Subtitle>

          <S.BalanceCard>
            <S.CardLabel>Saldo atual</S.CardLabel>
            <S.BalanceValue $positive={summary.balance >= 0}>
              {formatCurrency(summary.balance)}
            </S.BalanceValue>
          </S.BalanceCard>

          <S.ChartCard>
            <S.ChartHeader>
              <S.CardTitle>Evolucao do saldo</S.CardTitle>
              <S.CardCaption>{balanceHistory.length} lancamento(s)</S.CardCaption>
            </S.ChartHeader>

            {chartData.length ? (
              <LineChart
                areaChart
                curved
                isAnimated
                data={chartData}
                width={chartWidth}
                height={220}
                color={theme.colors.primary}
                thickness={3}
                startFillColor={theme.colors.primary}
                endFillColor={theme.colors.primary}
                startOpacity={0.24}
                endOpacity={0.04}
                spacing={50}
                initialSpacing={10}
                endSpacing={30}
                noOfSections={4}
                yAxisLabelWidth={40}
                labelsExtraHeight={24}
                overflowTop={24}
                xAxisLabelsHeight={36}
                hideDataPoints={false}
                dataPointsColor={theme.colors.primary}
                dataPointsRadius={4}
                yAxisColor="#D9E2F2"
                xAxisColor="#D9E2F2"
                rulesColor="#E8EEF7"
                yAxisTextStyle={{ color: theme.colors.gray, fontSize: 8 }}
                xAxisLabelTextStyle={{ color: theme.colors.gray, fontSize: 9 }}
                formatYLabel={(label) => formatCurrency(Number(label))}
              />
            ) : (
              <S.EmptyChartText>
                Cadastre transacoes para visualizar a evolucao do saldo.
              </S.EmptyChartText>
            )}
          </S.ChartCard>

          <Button
            title="Ir para transacoes"
            onPress={() => navigation.navigate("TransactionsList")}
          />
        </S.Content>
      </ScrollView>
    </S.Container>
  );
}
