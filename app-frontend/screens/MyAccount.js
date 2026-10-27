import { LinearGradient } from "expo-linear-gradient";
import { Button, View } from "react-native";
import ThemedStyles, { Colors } from "../styles/stylesheets";
import BasicButton from "../components/BasicButton";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { logout } from "../services/auth";
import { Pressable, Text } from "react-native";
import { getMe } from "../services/user";

export default function MyAccount({ navigation }) {
    const styles = ThemedStyles();
    const [user, setUser] = useState(null);

    const handleLogout = async () => {
        await logout();

        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        })
    }


    useEffect(() => {
        async function getUser() {
            const user = await getMe();
            if (!user.success) {
                handleLogout();
            } else {
                setUser(user.user);
            }
        }
        getUser();
    }, [])

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
                        <Text style={{ fontSize: 18, color: Colors.background.backgroundColor, fontWeight: '400' }}>Minha Conta</Text>
                    </View>
                </View>

            </LinearGradient >
            <View style={{ flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', width: '100%', paddingVertical: 10 }}>
                <View style={{ borderRadius: '100%', backgroundColor: Colors.colorPrimary.color, height: 50, width: 50, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderColor: Colors.whiteBackground.backgroundColor, borderWidth: 2 }}>
                    <Text style={{ alignSelf: 'center', fontSize: 24, color: Colors.whiteBackground.backgroundColor }}>{user?.nome[0].toUpperCase() || ' '}</Text>
                </View>
                <Text style={{ fontSize: 24 }}>{user?.nome || '...'}</Text>
                <Text>{user?.email || '...'}</Text>

            </View>

            <View style={[styles.shadow, { width: '90%', backgroundColor: Colors.whiteBackground.backgroundColor, padding: 16, borderRadius: 10, borderColor: Colors.brownBorder.color, borderWidth: 2 }]}>
                <Text style={{ color: Colors.colorSoil.color, fontWeight: '500', paddingBottom: 10 }}>DADOS DA CONTA</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderColor: Colors.colorParchment.color, borderBottomWidth: 2 }}>
                    <Text style={{ color: Colors.softGray.color, fontWeight: '500' }}>Nome completo</Text>
                    <Text>{user?.nome || '...'}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderColor: Colors.colorParchment.color, borderBottomWidth: 2 }}>
                    <Text style={{ color: Colors.softGray.color, fontWeight: '500' }}>Email</Text>
                    <Text>{user?.email || '...'}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 }}>
                    <Text style={{ color: Colors.softGray.color, fontWeight: '500' }}>Membro desde</Text>
                    <Text>Julho 2026</Text>
                </View>
            </View>

            <Pressable onPress={() => navigation.navigate('Menu de Alterar Dados da Conta')} style={[styles.shadow, { width: '90%', backgroundColor: Colors.whiteBackground.backgroundColor, padding: 16, borderRadius: 10, borderColor: Colors.brownBorder.color, borderWidth: 2, flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="options" size={24} />
                    <Text>Alterar Dados</Text>
                </View>
                <Ionicons name="caret-down" size={24} color={Colors.colorPrimary.color} />
            </Pressable>

            <BasicButton color={Colors.colorDanger.color} title="Sair da conta" onPress={handleLogout} />

            <StatusBar style="auto" />
        </View >
    );
}