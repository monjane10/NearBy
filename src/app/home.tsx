import { useEffect,useState } from "react";
import { View, Text } from "react-native";
import{api} from "@/services/api"
import{Categories, CategoriesProps} from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";
import MapView from "react-native-maps";
import { StyleSheet } from "react-native";
import * as Location from "expo-location";

type MarketsProps = PlaceProps

const currentLocation = {
    latitude: -23.561187293883442,
    longitude: -46.656451388116494

}

export default function Home(){
    const [categories, setCategories] = useState<CategoriesProps>([]);
    const [category, setCategory] = useState("");
    const[markets, setMarkets] = useState<MarketsProps[]>([]);



    async function fecthCategories() {
        try {
            const {data} = await api.get("/categories")
            setCategories(data);
            setCategory(data[0].id)
            
        } catch (error) {
            console.log(error)
            alert("Erro ao carregar categorias")
        }
        
    }

    async function fecthMarkets() {

        if(!category) return;
        try {
            const {data} = await api.get("/markets/category/" + category);
            setMarkets(data);

            
        } catch (error) {
            console.log(error)
            alert("Erro ao carregar locais")
        }
        
    }


    async function getCurrentLocation(){
        try {
            const {granted} = await Location.requestForegroundPermissionsAsync();
            if (granted){
                const location  = await Location.getCurrentPositionAsync();
                console.log(location)
                }
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCurrentLocation
        fecthCategories()
    },[])

    useEffect(() => {
        fecthMarkets()
    },[category])
    return (
        <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
        <MapView
          style={{ ...StyleSheet.absoluteFillObject }}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        />

        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
          <Categories data={categories} onSelect={setCategory} selected={category} />
        </View>
  
        <Places data={markets} />
      </View>
    )
}