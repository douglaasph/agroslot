import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, Text, View, ScrollView, Image } from "react-native";
import ThemedStyles, { Colors } from "../../styles/stylesheets";

export default function Diagnostic({ navigation, route }) {
    const { plant } = route.params;
    const { plantHistory } = route.params;
    const styles = ThemedStyles();;

    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        if (!plant || !plantHistory) {
            setFetchError(True);
        }
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: Colors.colorParchment.color, minHeight: '100%', justifyContent: 'flex-start' }]}>
            <View style={{ justifyContent: 'flex-start', paddingLeft: 20, paddingBottom: 5, flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingTop: 30, width: '100%', backgroundColor: Colors.whiteBackground.backgroundColor }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Pressable onPress={() => {
                        navigation.goBack();
                    }} style={{ backgroundColor: Colors.background.backgroundColor, borderRadius: '25%', padding: 6 }}>
                        <Ionicons name="return-up-back" color={Colors.colorSoil.color} size={28} />
                    </Pressable>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 18, color: Colors.colorPrimary.color, fontWeight: '500' }}>{plant?.nome || '...'}</Text>
                        <Text style={{ color: Colors.softGray.color }}>{plant.especie_planta || '...'} - Slot ({plant?.posicaoX || '...'}, {plant?.posicaoY || '...'})</Text>
                    </View>
                </View>
            </View>


            <View style={{
                width: '100%', padding: 10, flex: 1
            }}>
                <Text style={{ fontSize: 18, fontWeight: '400' }}>Diagnóstico em {plantHistory?.uploadDate ? new Date(plantHistory?.uploadDate).toLocaleDateString('pt-BR') : '...'}</Text>

                <ScrollView
                    style={{
                        width: '100%',
                        flex: 1
                    }}
                    contentContainerStyle={{
                        paddingTop: 10,
                        paddingBottom: 60,
                        gap: 10
                    }}>

                    <Text>Resultado: {plantHistory?.predicao}</Text>
                    <Text>Confiança do modelo: {plantHistory?.nivelSaudePredicao || '...'}%</Text>
                    <View style={{ height: 320 }}>
                        {plantHistory?.foto_url ?
                            <Image source={{ uri: plantHistory.foto_url }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                            : null}
                    </View>

                </ScrollView>
            </View>

            <Text style={{ color: Colors.colorDanger.color, display: fetchError ? 'flex' : 'none' }}>Tivemos um problema para carregar esses dados.</Text>

            <StatusBar style="dark" />
        </View >
    );
}