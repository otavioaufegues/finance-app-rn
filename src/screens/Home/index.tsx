import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
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
  const scrollX = useRef(new Animated.Value(0)).current;
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

  const carouselWidth = Math.max(screenWidth - 32, 280);
  const chartWidth = Math.max(carouselWidth - 68, 220);

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

          <S.ChartCarouselSection>
            <Animated.ScrollView
              horizontal
              pagingEnabled
              bounces={false}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              snapToInterval={carouselWidth}
              snapToAlignment="start"
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false },
              )}
            >
              <S.ChartSlide style={{ width: carouselWidth }}>
                <BalanceEvolutionChart
                  balanceHistory={balanceHistory}
                  chartWidth={chartWidth}
                />
              </S.ChartSlide>

              <S.ChartSlide style={{ width: carouselWidth }}>
                <CategoryPieChart
                  transactions={transactions}
                  balance={summary.balance}
                />
              </S.ChartSlide>
            </Animated.ScrollView>

            <S.ChartPagination>
              {[0, 1].map((pageIndex) => {
                const inputRange = [
                  (pageIndex - 1) * carouselWidth,
                  pageIndex * carouselWidth,
                  (pageIndex + 1) * carouselWidth,
                ];

                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.35, 1, 0.35],
                  extrapolate: "clamp",
                });

                const scaleX = scrollX.interpolate({
                  inputRange,
                  outputRange: [1, 1.8, 1],
                  extrapolate: "clamp",
                });

                return (
                  <S.PaginationDot
                    key={pageIndex}
                    style={{ opacity, transform: [{ scaleX }] }}
                  />
                );
              })}
            </S.ChartPagination>
          </S.ChartCarouselSection>

        </S.Content>
      </ScrollView>
    </S.Container>
  );
}
