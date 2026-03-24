import { useMemo } from "react";
import { PieChart } from "react-native-gifted-charts";
import { useTheme } from "styled-components/native";
import type { Transaction } from "@/services/transactions";
import * as S from "../styles";

type CategoryPieChartProps = {
  transactions: Transaction[];
  balance: number;
};

const PIE_COLORS = [
  "#2F80ED",
  "#27AE60",
  "#F2994A",
  "#EB5757",
  "#56CCF2",
  "#9B51E0",
  "#219653",
  "#F2C94C",
];

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

export default function CategoryPieChart({
  transactions,
  balance,
}: CategoryPieChartProps) {
  const theme = useTheme();

  const categoryChartData = useMemo(() => {
    if (!transactions.length) {
      return [];
    }

    const totalsByCategory = transactions.reduce<
      Record<string, { label: string; value: number }>
    >((accumulator, transaction) => {
      const category = transaction.category.trim() || "Sem categoria";

      if (!accumulator[category]) {
        accumulator[category] = {
          label: category,
          value: 0,
        };
      }

      accumulator[category].value += transaction.amount;

      return accumulator;
    }, {});

    return Object.values(totalsByCategory)
      .sort((firstItem, secondItem) => secondItem.value - firstItem.value)
      .map((item, index) => ({
        value: Number(item.value.toFixed(2)),
        color: PIE_COLORS[index % PIE_COLORS.length],
        text: item.label,
      }));
  }, [transactions]);

  const categoryTotal = useMemo(
    () => categoryChartData.reduce((total, item) => total + item.value, 0),
    [categoryChartData],
  );

  return (
    <S.ChartCard>
      <S.ChartHeader>
        <S.CardTitle>Transacoes por categoria</S.CardTitle>
        <S.CardCaption>
          Distribuicao do valor movimentado entre categorias
        </S.CardCaption>
      </S.ChartHeader>

      {categoryChartData.length ? (
        <S.PieSection>
          <S.PieChartWrapper>
            <PieChart
              data={categoryChartData}
              donut
              isAnimated
              radius={92}
              innerRadius={62}
              innerCircleColor={theme.colors.white}
              strokeColor={theme.colors.white}
              strokeWidth={3}
              showText={false}
              centerLabelComponent={() => (
                <S.PieCenterContent>
                  <S.PieCenterLabel>Saldo</S.PieCenterLabel>
                  <S.PieCenterValue>
                    {formatCompactCurrency(balance)}
                  </S.PieCenterValue>
                </S.PieCenterContent>
              )}
            />
          </S.PieChartWrapper>

          <S.LegendList>
            {categoryChartData.map((item) => {
              const percentage = categoryTotal
                ? Math.round((item.value / categoryTotal) * 100)
                : 0;

              return (
                <S.LegendItem key={item.text}>
                  <S.LegendIndicator
                    $color={item.color ?? theme.colors.primary}
                  />
                  <S.LegendContent>
                    <S.LegendTitle>{item.text}</S.LegendTitle>
                    <S.LegendSubtitle>
                      {formatCurrency(item.value)} - {percentage}%
                    </S.LegendSubtitle>
                  </S.LegendContent>
                </S.LegendItem>
              );
            })}
          </S.LegendList>
        </S.PieSection>
      ) : (
        <S.EmptyChartText>
          Cadastre transacoes para visualizar a distribuicao por categoria.
        </S.EmptyChartText>
      )}
    </S.ChartCard>
  );
}
