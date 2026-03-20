import { useState } from "react";
import * as S from "./styles";
import { loginUser } from "@/services/auth";

export default function Login() {
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

  return (
    <S.Container>
      <S.Input placeholder="Email" onChangeText={setEmail} />
      <S.Input placeholder="Senha" secureTextEntry onChangeText={setPassword} />

      <S.Button onPress={handleLogin}>
        <S.ButtonText>Entrar</S.ButtonText>
      </S.Button>
    </S.Container>
  );
}