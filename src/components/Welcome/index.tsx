import {Image, Text, View} from 'react-native';
import{s} from "./styles"

export function Welcome(){
    return <View>
        <Image source={require("@/assets/logo.png")} style={s.logo} />
        <Text style={s.title}>
            Bem vindo ao Nearby!
        </Text>
        <Text style={s.subtitle}>
            O aplicativo que te ajuda a encontrar pessoas e lugares próximos a ti.
        </Text>
    </View>
    
}