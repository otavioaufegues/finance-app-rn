import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "@/components/Button";
import { AuthStackParamList } from "@/routes/types";
import { loginUser } from "@/services/auth";
import * as S from "./styles";

export default function Login() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, "Login">>();
  const route =
    useRoute<NativeStackScreenProps<AuthStackParamList, "Login">["route"]>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      console.log("Logado:", user.email);
    } catch (error) {
      console.log("Erro login:", error);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <S.Container>
      {!!route.params?.message && (
        <S.Message type={route.params.messageType ?? "success"}>
          {route.params.message}
        </S.Message>
      )}
      <S.Input
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <S.Input
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Cadastrar" onPress={handleRegister} variant="outline" />
    </S.Container>
  );
}
