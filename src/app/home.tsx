import { useEffect,useState } from "react";
import { View, Text } from "react-native";
import{api} from "@/services/api"
import{Categories, CategoriesProps} from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";

type MarketsProps = PlaceProps 

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
    useEffect(() => {
        fecthCategories()
    },[])

    useEffect(() => {
        fecthMarkets()
    },[category])
    return (
        <View style={{flex:1}}>
            
            <Categories data={categories} onSelect={setCategory} selected={category} />

            <Places data={markets} />
        </View>
    )
}