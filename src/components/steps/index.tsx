import { View, Text } from "react-native"
import { s } from "./styles"
import { Step } from "../step"
import { IconMapPin, IconQrcode, IconTicket } from "@tabler/icons-react-native"


export function Steps() {
    return (
        <View style={s.container}>
            <Text style={s.title}>Veja como funciona:</Text>

            <Step icon={IconMapPin} title="Encontra Estabelecimentos" description="Descobre locais perto de ti que são parceiros do NearBy" />
            <Step icon={IconQrcode} title="Ativa o cupão com QR Code" description="Escaneia o QR Code do estabelecimento para usufruíres dos benefícios" />
            <Step icon={IconTicket} title="Garanta as vantagens perto de ti" description="Ativa cupões onde estiveres, em diferentes tipos de estabelecimentos" />

        </View>

    )
}