import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md}px;
  justify-content: center;
`;

export const FormCard = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.large}px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const Input = styled.TextInput`
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 10px;
  padding: 12px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const FieldLabel = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: 600;
`;

export const SelectButton = styled.TouchableOpacity`
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 10px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const SelectButtonText = styled.Text<{ $placeholder: boolean }>`
  color: ${({ $placeholder, theme }) =>
    $placeholder ? theme.colors.gray : theme.colors.text};
`;

export const SelectList = styled.View`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 10px;
  overflow: hidden;
`;

export const SelectOption = styled.TouchableOpacity`
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.white};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background};
`;

export const SelectOptionText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
`;

export const EmptyOptionsText = styled.Text`
  padding: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const TypeSelector = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const TypeButton = styled.TouchableOpacity<{ $selected: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  align-items: center;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.background};
`;

export const TypeButtonText = styled.Text<{ $selected: boolean }>`
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.white : theme.colors.text};
  font-weight: 600;
`;

export const Message = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.colors.text};
`;
