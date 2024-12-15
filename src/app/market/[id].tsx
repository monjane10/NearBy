import { View, Alert, Modal, StatusBar, ScrollView } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { api } from "@/services/api";
import { useEffect, useState, useRef } from "react";
import { Loading } from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { Details, PropsDetails } from "@/components/market/details";
import { Coupon } from "@/components/market/coupon";
import Button from "@/components/button";
import { useCameraPermissions, CameraView } from "expo-camera";

type DataProps = PropsDetails & {
  cover: string;
};

export default function Market() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [data, setData] = useState<DataProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [couponIsFetching, setCouponIsFetching] = useState(false);

  const [_, requestPermission] = useCameraPermissions();

  const params = useLocalSearchParams<{ id: string }>();

  const qrLock = useRef(false);
  console.log(params.id);

  // Função para buscar dados do mercado
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

  // Função para abrir a câmera
  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        return Alert.alert("Permissão negada", "Para usar a câmera, você precisa habilitar a câmera.");
      }
      qrLock.current = false;
      setIsModalVisible(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível abrir a câmera.");
    }
  }

  // Função para obter o cupom
  async function getCoupon(id: string) {
    try {
      setCouponIsFetching(true);
      const { data } = await api.patch(`/coupon/${id}`);

      Alert.alert("Sucesso", "Cupom aplicado com sucesso.", data.coupon);
      setCoupon(data.coupon);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível obter o cupom.");
    } finally {
      setCouponIsFetching(false);
    }
  }

  // Função de uso do cupom
  function handleUseCoupon(code: string) {
    setIsModalVisible(false);

    Alert.alert(
      "Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?",
      "",
      [
        {
          style: "cancel",
          text: "Não",
        },
        {
          text: "Sim",
          onPress: () => {
            getCoupon(code); // Chama a função getCoupon passando o código do cupom
          },
        },
      ]
    );
  }

  // Carregar os dados assim que o ID mudar
  useEffect(() => {
    if (params.id) {
      fetchMarket();
    }
  }, [params.id, coupon]);

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" hidden={isModalVisible} />
      <ScrollView showsVerticalScrollIndicator={false}>
      <Cover uri={data.cover} />
      <Details data={data} />
      {coupon && <Coupon code={coupon} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={handleOpenCamera}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      {/* Modal de câmera */}
      <Modal style={{ flex: 1 }} visible={isModalVisible}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={(result) => {
            if (result && !qrLock.current) {
              qrLock.current = true; 
              setTimeout(() => {
                const scannedCode = result.data; 
                if (scannedCode) {
                  handleUseCoupon(scannedCode);
                }
                qrLock.current = false; 
              }, 500);
            }
          }}
        />

        <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <Button onPress={() => setIsModalVisible(false)} isLoading={couponIsFetching}>
            <Button.Title>Fechar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
