import { TouchableOpacity, TouchableOpacityProps, Text, View, Image } from "react-native";
import {s} from "./styles"
import { IconTicket } from "@tabler/icons-react-native";
import {colors} from"@/styles/theme";

export type PlaceProps = {
    id: string;
    name: string;
    description: string;
    coupons: number;
    cover: string;
    address: string;
}

type Props = TouchableOpacityProps &{
    data: PlaceProps;
}

export function Place({data, ...rest}: Props) {
    return (
        <TouchableOpacity style={s.container} {...rest}>
            <Image style={s.image} source= {{uri: data.cover}} />
            <View style={s.content}>
                <Text style={s.name}>{data.name}</Text>
                <Text style={s.description}>{data.description}</Text>
            </View>
            <View style={s.footer}>
                <IconTicket size={16} color={colors.red.base} />
                <Text style={s.tickets}>{data.coupons} cupões disponíveis</Text>
            </View>
        </TouchableOpacity>
    )
}