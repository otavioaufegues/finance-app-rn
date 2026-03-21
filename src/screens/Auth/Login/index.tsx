import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { FirebaseError } from "firebase/app";
import Button from "@/components/Button";
import { AuthStackParamList } from "@/routes/types";
import { loginUser } from "@/services/auth";
import * as S from "./styles";

const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Email ou senha inválidos.";
      case "auth/invalid-email":
        return "Informe um email válido.";
      case "auth/too-many-requests":
        return "Muitas tentativas. Tente novamente em instantes.";
      default:
        return "Não foi possível realizar o login.";
    }
  }

  return "Ocorreu um erro ao fazer login.";
};

export default function Login() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, "Login">>();
  const route =
    useRoute<NativeStackScreenProps<AuthStackParamList, "Login">["route"]>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      await loginUser(email, password);
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={24}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
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
          {!!errorMessage && <S.Message type="error">{errorMessage}</S.Message>}

          <Button title="Entrar" onPress={handleLogin} loading={loading} />
          <Button title="Cadastrar" onPress={handleRegister} variant="outline" />
        </S.Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
