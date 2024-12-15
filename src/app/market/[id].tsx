import { View, Alert } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { Details, PropsDetails } from "@/components/market/details";

type DataProps = PropsDetails & {
  cover: string;
};

export default function Market() {
  const [data, setData] = useState<DataProps | null>(null); // Inicializando como null
  const [isLoading, setIsLoading] = useState(true);

  const params = useLocalSearchParams<{ id: string }>();

  // Função para fazer a requisição à API
  async function fetchMarket() {
    if (!params.id) {
      Alert.alert("ID inválido", "O ID do mercado não foi fornecido.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get(`/market/${params.id}`);
      if (response.data) {
        setData(response.data);
      } else {
        Alert.alert("Erro", "Dados do mercado não encontrados.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do mercado:", error);
      Alert.alert("Erro ao carregar os dados", "Tente novamente mais tarde.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Carrega os dados assim que o componente for montado ou quando o ID mudar
  useEffect(() => {
    if (params.id) {
      fetchMarket();
    }
  }, [params.id]);

  // Exibe o loading enquanto os dados estão sendo carregados
  if (isLoading) {
    return <Loading />;
  }

  // Se não houver dados, redireciona para a página principal
  if (!data) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Cover uri={data.cover} />
      <Details data={data} />
    </View>
  );
}
