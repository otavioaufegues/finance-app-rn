import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "@/screens/Home";
import { AppStackParamList } from "./types";

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}