import { useMemo } from "react";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "styled-components/native";
import type { BalanceHistoryPoint } from "@/hooks/useTransactions";
import * as S from "../styles";

type BalanceEvolutionChartProps = {
  balanceHistory: BalanceHistoryPoint[];
  chartWidth: number;
};

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

export default function BalanceEvolutionChart({
  balanceHistory,
  chartWidth,
}: BalanceEvolutionChartProps) {
  const theme = useTheme();

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

  return (
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
  );
}
