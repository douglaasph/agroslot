import { ActivityIndicator, Button, Pressable, Text } from "react-native";
import { Colors } from "../styles/stylesheets";

// estados padrão, desabilitado e loading
export default function BasicButton({ disabled, loading, onPress, title, color, textColor }) {
    const fallbackFunc = () => alert('No action here.');

    return (
        <Button
            title={title}
            style={{
                backgroundColor: `${disabled ? Colors.disabledGrayBackground.color : color ? color : Colors.colorPrimary.color}`,
                padding: 10,
                borderRadius: 10,
                maxHeight: 60,
                minHeight: 50,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            color={color || Colors.colorPrimary.color}
            disabled={disabled}
            onPress={onPress || fallbackFunc}
        >
            ${loading ?
                <Text style={{ textAlign: 'center', alignSelf: 'center', textAlignVertical: 'center' }}>
                    <ActivityIndicator style={{ alignSelf: 'center', padding: 1 }} color={Colors.background.backgroundColor} />
                </Text>
                :
                <Text
                    style={{
                        color: `${textColor || Colors.background.backgroundColor}`,
                        fontWeight: `${disabled ? '500' : '700'}`,
                        fontSize: 18,
                        textAlign: 'center'
                    }}>{title}</Text>
            }
        </Button>
    )
}

