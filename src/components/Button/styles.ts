import styled, { css } from "styled-components/native";
import type {
  ButtonContainerStyleProps,
  ButtonSize,
  ButtonTextStyleProps,
} from "./types";
import { getButtonBackground, getButtonTextColor } from "./types";

const sizeStyles = {
  sm: css`
    min-height: 40px;
    padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  `,
  md: css`
    min-height: 48px;
    padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  `,
  lg: css`
    min-height: 56px;
    padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.xl}px;
  `,
} satisfies Record<ButtonSize, ReturnType<typeof css>>;

export const Container = styled.TouchableOpacity<ButtonContainerStyleProps>`
  border-radius: 10px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  background-color: ${({ theme, $variant }) =>
    getButtonBackground(theme, $variant)};
  border-width: ${({ $variant }) => ($variant === "outline" ? "1px" : "0px")};
  border-color: ${({ theme }) => theme.colors.primary};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  ${({ $size }) => sizeStyles[$size]}
`;

export const Title = styled.Text<ButtonTextStyleProps>`
  font-size: ${({ theme }) => theme.fontSize.medium}px;
  font-weight: 600;
  color: ${({ theme, $variant }) => getButtonTextColor(theme, $variant)};
`;
