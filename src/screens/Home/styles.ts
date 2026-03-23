import { SafeAreaView } from "react-native-safe-area-context";
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
