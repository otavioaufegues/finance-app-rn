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

export const DateButton = styled.TouchableOpacity`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 10px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.white};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const DateButtonContent = styled.View`
  flex: 1;
  gap: 2px;
`;

export const DateButtonLabel = styled.Text`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSize.small}px;
`;

export const DateButtonValue = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: 600;
`;

export const DateButtonHint = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.small}px;
  font-weight: 600;
`;

export const CalendarOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.32);
`;

export const CalendarModalCard = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const CalendarHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const CalendarMonthButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const CalendarMonthButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.large}px;
  font-weight: 700;
`;

export const CalendarMonthLabel = styled.Text`
  flex: 1;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.large}px;
  font-weight: 700;
  text-transform: capitalize;
`;

export const CalendarWeekRow = styled.View`
  flex-direction: row;
`;

export const CalendarWeekLabel = styled.Text`
  flex: 1;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSize.small}px;
  font-weight: 600;
`;

export const CalendarGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const CalendarEmptyDay = styled.View`
  width: 14.2857%;
  aspect-ratio: 1;
`;

export const CalendarDayButton = styled.TouchableOpacity<{ $selected: boolean }>`
  width: 14.2857%;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : "transparent"};
`;

export const CalendarDayText = styled.Text<{
  $selected: boolean;
  $today: boolean;
}>`
  color: ${({ $selected, $today, theme }) => {
    if ($selected) {
      return theme.colors.white;
    }

    if ($today) {
      return theme.colors.primary;
    }

    return theme.colors.text;
  }};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: ${({ $selected, $today }) => ($selected || $today ? 700 : 500)};
`;

export const CalendarFooter = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const CalendarFooterText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
`;

export const Preview = styled.Image`
  width: 120px;
  height: 120px;
  margin-top: 10px;
  border-radius: 8px;
`;