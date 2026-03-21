import { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "styled-components/native";
import { useAuth } from "@/contexts/AuthContext";
import { AppStackParamList } from "@/routes/types";
import * as S from "./styles";

export default function Home() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, "Home">>();
  const theme = useTheme();
  const { setIsAuthenticated } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Bem-vindo",
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsAuthenticated(false)}>
          <S.HeaderButtonText>Sair</S.HeaderButtonText>
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: theme.colors.primary,
        fontSize: theme.fontSize.large,
      },
    });
  }, [navigation, setIsAuthenticated, theme.colors.primary, theme.fontSize.large]);

  return (
    <S.Container>
    </S.Container>
  );
}