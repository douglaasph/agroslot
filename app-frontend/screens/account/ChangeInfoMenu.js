import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native-web";
import ThemedStyles, { Colors } from "../../styles/stylesheets";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

export default function ChangeInfoMenu({ navigation }) {
    const styles = ThemedStyles();

    return (
        <View style={[styles.container, { backgroundColor: Colors.background.backgroundColor, minHeight: '100%', justifyContent: 'flex-start', gap: 10 }]}>
            <LinearGradient
                colors={[Colors.colorPrimaryLight.color, Colors.colorGrass.color]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '100%', gap: 5, height: '15%', flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}
            >
                <View style={{ justifyContent: 'space-evenly', paddingLeft: 20, paddingBottom: 5, flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <Pressable onPress={() => navigation.goBack()} style={{ backgroundColor: Colors.background.backgroundColor, borderRadius: '25%', padding: 6 }}>
                            <Ionicons name="return-up-back" color={Colors.colorSoil.color} size={28} />
                        </Pressable>
                        <Text style={{ fontSize: 18, color: Colors.background.backgroundColor, fontWeight: '400' }}>Alterar Dados</Text>
                    </View>
                </View>

            </LinearGradient >

            <Pressable onPress={() => navigation.navigate('Alterar Nome ou Email')} style={[styles.shadow, { width: '90%', backgroundColor: Colors.whiteBackground.backgroundColor, padding: 16, borderRadius: 10, borderColor: Colors.brownBorder.color, borderWidth: 2, flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="clipboard-sharp" size={24} color={Colors.softGray.color} />
                    <Text>Alterar Nome ou Email</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={Colors.colorPrimary.color} />
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Alterar Senha')} style={[styles.shadow, { width: '90%', backgroundColor: Colors.whiteBackground.backgroundColor, padding: 16, borderRadius: 10, borderColor: Colors.brownBorder.color, borderWidth: 2, flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="key" color="orange" size={24} />
                    <Text>Alterar Senha</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={Colors.colorPrimary.color} />
            </Pressable>

            <StatusBar style="auto" />
        </View >
    );
}