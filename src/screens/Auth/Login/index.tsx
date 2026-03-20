import { useState } from "react";
import * as S from "./styles";
import { loginUser } from "@/services/auth";
import { useNavigation } from "@react-navigation/native";
import Button from "@/components/Button";


export default function Login() {
  const navigation = useNavigation();
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
  }

  return (
    <S.Container>
      <S.Input placeholder="Email" onChangeText={setEmail} />
      <S.Input placeholder="Senha" secureTextEntry onChangeText={setPassword} />

      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Cadastrar" onPress={handleRegister} variant="outline" />
    </S.Container>
  );
}
