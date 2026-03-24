import { SafeAreaView } from "react-native-safe-area-context";
import { Animated } from "react-native";
import styled from "styled-components/native";

export const scrollContent = {
  padding: 16,
  paddingBottom: 32,
};

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Content = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.title}px;
  font-weight: 700;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  line-height: 22px;
`;

export const BalanceCard = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const CardLabel = styled.Text`
  color: rgba(255, 255, 255, 0.78);
  font-size: ${({ theme }) => theme.fontSize.small}px;
`;

export const BalanceValue = styled.Text<{ $positive: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ $positive, theme }) =>
    $positive ? theme.colors.white : "#FFE1E1"};
  font-size: 32px;
  font-weight: 700;
`;

export const ChartCard = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const ChartCarouselSection = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const ChartSlide = styled.View`
  padding-right: ${({ theme }) => theme.spacing.sm}px;
`;

export const ChartPagination = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const PaginationDot = styled(Animated.View)`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const ChartHeader = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const CardTitle = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.large}px;
  font-weight: 700;
`;

export const CardCaption = styled.Text`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSize.small}px;
`;

export const EmptyChartText = styled.Text`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  line-height: 22px;
`;

export const HeaderButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: 600;
`;

export const PieSection = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
`;

export const PieChartWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

export const PieCenterContent = styled.View`
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

export const PieCenterLabel = styled.Text`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSize.small}px;
`;

export const PieCenterValue = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: 700;
`;

export const LegendList = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const LegendIndicator = styled.View<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ $color }) => $color};
`;

export const LegendContent = styled.View`
  flex: 1;
  gap: 2px;
`;

export const LegendTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: 600;
`;

export const LegendSubtitle = styled.Text`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSize.small}px;
`;
