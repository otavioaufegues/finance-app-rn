import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const listContent = {
  padding: 16,
  paddingBottom: 32,
};

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const HeaderContent = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

export const SummaryRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const SummaryCard = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const BalanceCard = styled(SummaryCard)`
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const SummaryLabel = styled.Text`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSize.small}px;
`;

export const SummaryValue = styled.Text<{ $variant: "income" | "expense" }>`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ $variant, theme }) =>
    $variant === "income" ? theme.colors.secondary : "#D32F2F"};
  font-size: ${({ theme }) => theme.fontSize.large}px;
  font-weight: 700;
`;

export const BalanceValue = styled.Text<{ $positive: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ $positive, theme }) =>
    $positive ? theme.colors.white : "#FFE1E1"};
  font-size: ${({ theme }) => theme.fontSize.title}px;
  font-weight: 700;
`;

export const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.large}px;
  font-weight: 700;
`;

export const TransactionCard = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const TransactionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const TransactionTitle = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: 700;
`;

export const TransactionAmount = styled.Text<{ $type: "income" | "expense" }>`
  color: ${({ $type, theme }) =>
    $type === "income" ? theme.colors.secondary : "#D32F2F"};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: 700;
`;

export const TransactionMeta = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const ActionButton = styled.TouchableOpacity`
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
`;

export const ActionButtonText = styled.Text<{ $danger?: boolean }>`
  color: ${({ $danger, theme }) =>
    $danger ? "#D32F2F" : theme.colors.primary};
  font-weight: 700;
`;

export const EmptyState = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  padding: ${({ theme }) => theme.spacing.lg}px 0;
`;

export const ItemSeparator = styled.View`
  height: ${({ theme }) => theme.spacing.sm}px;
`;

export const HeaderButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: 600;
`;
