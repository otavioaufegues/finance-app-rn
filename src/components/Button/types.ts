import type { TouchableOpacityProps } from "react-native";
import type { DefaultTheme } from "styled-components/native";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export interface ButtonContainerStyleProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $disabled: boolean;
}

export interface ButtonTextStyleProps {
  $variant: ButtonVariant;
}

export const getButtonBackground = (
  theme: DefaultTheme,
  variant: ButtonVariant
) => {
  if (variant === "secondary") {
    return theme.colors.secondary;
  }

  if (variant === "outline") {
    return "transparent";
  }

  return theme.colors.primary;
};

export const getButtonTextColor = (
  theme: DefaultTheme,
  variant: ButtonVariant
) => {
  if (variant === "outline") {
    return theme.colors.primary;
  }

  return theme.colors.white;
};
