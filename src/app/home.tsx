import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { api } from "@/services/api";
import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import {colors, fontFamily} from "@/styles/theme"
import { router } from "expo-router";

type MarketsProps = PlaceProps & {
    latitude: number;
    longitude: number;
};

const currentLocation = {
    latitude: -25.925446942876974,
    longitude: 32.58628683173757,
};

export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps>([]);
    const [category, setCategory] = useState("");
    const [markets, setMarkets] = useState<MarketsProps[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    async function fetchCategories() {
        try {
            const { data } = await api.get("/categories");
            setCategories(data);
            setCategory(data[0].id);
        } catch (error) {
            console.log(error);
            alert("Erro ao carregar categorias");
        }
    }

    async function fetchMarkets() {
        if (!category) return;
        try {
            const { data } = await api.get("/markets/category/" + category);
            setMarkets(data);
        } catch (error) {
            console.log(error);
            alert("Erro ao carregar locais");
        }
    }

    async function getCurrentLocation() {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if (granted) {
                const location = await Location.getCurrentPositionAsync();
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCurrentLocation();
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchMarkets();
    }, [category]);

    return (
        <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >

                {userLocation && (
                    <Marker
                        identifier="current"
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                        image={require("@/assets/location.png")}
                    />
                )}

                {markets.map((item) => (
                    <Marker
                        key={item.id}
                        identifier={item.id}
                        coordinate={{
                            latitude: item.latitude,
                            longitude: item.longitude,
                        }}
                        image={require("@/assets/pin.png")}
                    >

                        <Callout onPress={() => router.push({ pathname: '/market/[id]', params: { id: item.id } })}>
                            <View>
                                <Text style={{fontSize: 14, color: colors.gray[600], fontFamily: fontFamily.medium}}>{item.name}</Text>
                                <Text style={{fontSize: 12, color: colors.gray[600], fontFamily: fontFamily.regular}}>{item.address}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }}>
                <Categories data={categories} onSelect={setCategory} selected={category} />
            </View>

            <Places data={markets} />
        </View>
    );
}
