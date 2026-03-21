import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "@/screens/Home";
import TransactionForm from "@/screens/TransactionForm";
import TransactionsList from "@/screens/TransactionsList";
import { AppStackParamList } from "./types";

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="TransactionsList" component={TransactionsList} />
      <Stack.Screen name="TransactionForm" component={TransactionForm} />
    </Stack.Navigator>
  );
}
