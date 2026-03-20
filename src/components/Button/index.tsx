import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components/native";
import * as S from "./styles";
import type { ButtonProps } from "./types";
import { getButtonTextColor } from "./types";

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = true,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const indicatorColor = getButtonTextColor(theme, variant);

  return (
    <S.Container
      activeOpacity={0.8}
      accessibilityRole="button"
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $disabled={isDisabled}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : null}
      <S.Title $variant={variant}>{title}</S.Title>
    </S.Container>
  );
}

export default Button;
