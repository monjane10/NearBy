import { useEffect,useState } from "react";
import { View, Text } from "react-native";
import{api} from "@/services/api"
import{Categories, CategoriesProps} from "@/components/categories";

export default function Home(){
    const [categories, setCategories] = useState<CategoriesProps>([]);


    async function fecthCategories() {
        try {
            const {data} = await api.get("/categories")
            setCategories(data);
            
        } catch (error) {
            console.log(error)
            alert("Erro ao carregar categorias")
        }
        
    }
    useEffect(() => {
        fecthCategories()
    },[])
    return (
        <View style={{flex:1}}>
            
            <Categories data={categories} />
        </View>
    )
}