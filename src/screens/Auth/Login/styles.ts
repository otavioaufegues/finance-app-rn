import styled from "styled-components/native";

export const Container = styled.View`
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
