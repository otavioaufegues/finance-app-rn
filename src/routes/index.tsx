import { NavigationContainer } from "@react-navigation/native";
import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes";

const isAuthenticated = false; // 👈 depois vamos trocar isso

export default function Routes() {
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}