import { Text, TextInput, View } from "react-native";
import { Colors } from "../styles/stylesheets";

export default function Input({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    error = false,
    errorMessage = '',
}) {
    return (
        <View style={{
            width: '100%',
            gap: 6,
        }}>
            {label && <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.colorPrimary.color,
            }} >{label}</Text>}

            <TextInput
                style={{
                    height: 60,
                    borderWidth: error ? 2 : 1,
                    borderColor: error ? Colors.colorDanger.color : Colors.colorSoilLight.color,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    fontSize: 16,
                    color: Colors.colorPrimaryDark.color,
                    backgroundColor: '#FFFFFF',
                }}
                placeholderTextColor={Colors.colorSoilLight.color}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
            />
            <Text style={{ color: Colors.colorDanger.color, display: error ? 'flex' : 'none' }}>{errorMessage}</Text>
        </View>
    );
}