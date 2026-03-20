import { useState } from "react";
import * as S from "./styles";
import { registerUser } from "@/services/auth";
import { createUserProfile } from "@/services/firestore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const user = await registerUser(email, password);

      await createUserProfile(user.uid, user.email || "");

      console.log("Usuário criado!");
    } catch (error) {
      console.log("Erro cadastro:", error);
    }
  };

  return (
    <S.Container>
      <S.Input placeholder="Email" onChangeText={setEmail} />
      <S.Input placeholder="Senha" secureTextEntry onChangeText={setPassword} />

      <S.Button onPress={handleRegister}>
        <S.ButtonText>Cadastrar</S.ButtonText>
      </S.Button>
    </S.Container>
  );
}