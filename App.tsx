import { ThemeProvider } from "styled-components/native";
import Routes from "./src/routes";
import { theme } from "./src/theme/theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
}
