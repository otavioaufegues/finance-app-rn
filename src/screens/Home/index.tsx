import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { AppStackParamList } from "@/routes/types";
import { getUserProfile } from "@/services/firestore";
import BalanceEvolutionChart from "./components/BalanceEvolutionChart";
import CategoryPieChart from "./components/CategoryPieChart";
import * as S from "./styles";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function Home() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, "Home">>();
  const { width: screenWidth } = useWindowDimensions();
  const { signOut, user } = useAuth();
  const { summary, balanceHistory, transactions } = useTransactions();
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

  const chartWidth = Math.max(screenWidth - 100, 280);

  return (
    <S.Container>
      <ScrollView contentContainerStyle={S.scrollContent}>
        <S.Content>
          <S.Title>Bem-vindo{userName ? `, ${userName}` : ""}</S.Title>
          <S.Subtitle>
            Acompanhe seu saldo e a evolucao das movimentacoes em um so lugar.
          </S.Subtitle>

          <Button
            title="Ir para transacoes"
            onPress={() => navigation.navigate("TransactionsList")}
          />
          
          <S.BalanceCard>
            <S.CardLabel>Saldo atual</S.CardLabel>
            <S.BalanceValue $positive={summary.balance >= 0}>
              {formatCurrency(summary.balance)}
            </S.BalanceValue>
          </S.BalanceCard>

          <BalanceEvolutionChart
            balanceHistory={balanceHistory}
            chartWidth={chartWidth}
          />

          <CategoryPieChart
            transactions={transactions}
            balance={summary.balance}
          />

        </S.Content>
      </ScrollView>
    </S.Container>
  );
}
