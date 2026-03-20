import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "@/screens/Auth/Login";
import Register from "@/screens/Auth/Register";
import { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}