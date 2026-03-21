import { useEffect, useLayoutEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/services/firestore";
import { AppStackParamList } from "@/routes/types";
import * as S from "./styles";

export default function Home() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, "Home">>();
  const { signOut, user } = useAuth();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!user) {
      setUserName("");
      return;
    }

    const loadUserProfile = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        setUserName(profile?.name ?? user.displayName ?? user.email ?? "");
      } catch {
        setUserName(user.displayName ?? user.email ?? "");
      }
    };

    void loadUserProfile();
  }, [user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerRight: () => (
        <TouchableOpacity onPress={() => void signOut()}>
          <S.HeaderButtonText>Sair</S.HeaderButtonText>
        </TouchableOpacity>
      ),
    });
  }, [navigation, signOut]);

  return (
    <S.Container>
      <S.Content>
        <S.Title>Bem-vindo{userName ? `, ${userName}` : ""}</S.Title>
        <S.Subtitle>
          Acompanhe suas transações financeiras em uma área separada.
        </S.Subtitle>

        <Button
          title="Ir para transações"
          onPress={() => navigation.navigate("TransactionsList")}
        />
      </S.Content>
    </S.Container>
  );
}
