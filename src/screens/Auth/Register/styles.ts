import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const Container = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Input = styled.TextInput`
  border: 1px solid ${({ theme }) => theme.colors.gray};
  padding: 10px;
  margin-bottom: 10px;
`;

export const Message = styled.Text<{ type: "success" | "error" }>`
  margin-bottom: 10px;
  color: ${({ theme, type }) =>
    type === "success" ? theme.colors.secondary : "#D32F2F"};
`;
