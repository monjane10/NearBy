import { Text, View } from 'react-native';
import { IconProps } from '@tabler/icons-react-native';
import { s } from './styles';
import { colors } from '@/styles/theme';

type Props = {
    description: string;
    icon: React.ComponentType<IconProps>;  // Espera um componente de ícone, não o JSX renderizado
};

export function Info({ icon: Icon, description }: Props) {
    return (
        <View style={s.container}>
            {/* Agora o componente de ícone é renderizado corretamente */}
            <Icon color={colors.gray[400]} size={20} />
            <Text style={s.text}>{description}</Text>
        </View>
    );
}
