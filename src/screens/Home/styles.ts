import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSize.title};
  color: ${({ theme }) => theme.colors.primary};
`;

export const Subtitle = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
`;

export const HeaderButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: 600;
`;
