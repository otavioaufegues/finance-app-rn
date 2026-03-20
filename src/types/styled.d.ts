import "styled-components/native";
import type { Theme } from "@/theme/theme";

declare module "styled-components/native" {
  interface DefaultTheme extends Theme {}
}
