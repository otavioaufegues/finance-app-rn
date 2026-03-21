import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FirebaseError } from "firebase/app";
import Button from "@/components/Button";
import { AuthStackParamList } from "@/routes/types";
import { registerUser } from "@/services/auth";
import { createUserProfile } from "@/services/firestore";
import * as S from "./styles";

const getRegisterErrorMessage = (error: unknown) => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Este email já está em uso.";
      case "auth/invalid-email":
        return "Informe um email válido.";
      case "auth/weak-password":
        return "A senha deve ter pelo menos 6 caracteres.";
      default:
        return "Não foi possível concluir o cadastro.";
    }
  }

  return "Ocorreu um erro ao cadastrar o usuário.";
};

export default function Register() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, "Register">>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const handleRegister = async () => {
    try {
      setMessage("");

      const user = await registerUser(email, password);

      await createUserProfile(user.uid, user.email || "");

      setMessageType("success");
      setMessage("Usuário cadastrado com sucesso.");

      navigation.navigate("Login", {
        message: "Usuário cadastrado com sucesso. Faça login para continuar.",
        messageType: "success",
      });
    } catch (error) {
      setMessageType("error");
      setMessage(getRegisterErrorMessage(error));
    }
  };

  return (
    <S.Container>
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
      {!!message && <S.Message type={messageType}>{message}</S.Message>}

      <Button title="Cadastrar" onPress={handleRegister} />
    </S.Container>
  );
}
