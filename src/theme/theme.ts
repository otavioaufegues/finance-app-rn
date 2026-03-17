export const theme = {
  colors: {
    primary: "#2F80ED",
    secondary: "#27AE60",
    background: "#F5F6FA",
    text: "#333333",
    white: "#FFFFFF",
    gray: "#BDBDBD",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  fontSize: {
    small: 14,
    medium: 16,
    large: 20,
    title: 24,
  },
};

export type Theme = typeof theme;

export type ColorType = keyof Theme['colors'];
export type SpacingType = keyof Theme['spacing'];