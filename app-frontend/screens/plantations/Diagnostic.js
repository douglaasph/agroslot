import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, Text, View, ScrollView, Image, Alert } from "react-native";
import ThemedStyles, { Colors } from "../../styles/stylesheets";
import { formatPrediction } from "./Plant";
import BasicButton from "../../components/BasicButton";
import BasicCard from "../../components/BasicCard";
import Popup from "../../components/Modal";

export default function Diagnostic({ navigation, route }) {
    const { plant } = route.params;
    const { plantHistory } = route.params;
    const styles = ThemedStyles();

    const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);

    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        if (!plant || !plantHistory) {
            setFetchError(True);
        }
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: Colors.whiteBackground.backgroundColor, minHeight: '100%', justifyContent: 'flex-start' }]}>
            <View style={{ justifyContent: 'flex-start', paddingHorizontal: 20, paddingBottom: 5, flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingTop: 30, width: '100%', backgroundColor: Colors.colorPrimary.color }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <Pressable onPress={() => {
                            navigation.goBack();
                        }} style={{ backgroundColor: Colors.background.backgroundColor, borderRadius: '25%', padding: 6 }}>
                            <Ionicons name="return-up-back" color={Colors.colorSoil.color} size={28} />
                        </Pressable>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 18, color: Colors.whiteBackground.backgroundColor, fontWeight: '500' }}>{plant?.nome || '...'}</Text>
                            <Text style={{ color: Colors.colorParchment.color }}>{plant.especie_planta || '...'} - Slot ({plant?.posicaoX || '...'}, {plant?.posicaoY || '...'})</Text>
                        </View>
                    </View>
                    <Pressable
                        onPress={() => setPopupDeleteVisible(true)}
                        style={{ backgroundColor: Colors.colorDanger.color, borderRadius: 5, padding: 4, alignSelf: 'center' }}>
                        <Ionicons name="trash-bin" size={32} color={Colors.white.color} />
                    </Pressable>
                </View>
            </View>

            <View style={{
                width: '100%', flex: 1
            }}>
                <BasicCard style={{ padding: 10, shadowOpacity: 0.3, borderTopEndRadius: 0, borderTopStartRadius: 0 }}>
                    <Text style={{ fontSize: 24, fontWeight: '600', color: Colors.textColor.color }}>Diagnóstico em {plantHistory?.uploadDate ? new Date(plantHistory?.uploadDate).toLocaleDateString('pt-BR') : '...'}</Text>
                </BasicCard>
                <ScrollView
                    style={{
                        width: '100%',
                        flex: 1
                    }}
                    contentContainerStyle={{
                        paddingTop: 20,
                        paddingBottom: 60,
                        gap: 10,
                        paddingHorizontal: 10
                    }}>
                    <BasicCard style={{ alignItems: 'center', borderWidth: 3, borderColor: Colors.textColor.color, padding: 0, gap: 0, shadowOpacity: 0.4 }}>
                        <View style={{ backgroundColor: Colors.colorPrimaryDark.color, alignSelf: 'stretch', borderTopEndRadius: 8, borderTopStartRadius: 8, padding: 4 }}>
                            <Text style={{ fontSize: 16, color: Colors.white.color, textAlign: 'center' }}>Resultado</Text>
                        </View>
                        <View style={{ backgroundColor: Colors.background.backgroundColor, alignSelf: 'stretch', padding: 8, borderBottomEndRadius: 8, borderBottomStartRadius: 8 }}>
                            <Text style={{ fontSize: 18, textAlign: 'center', fontWeight: '600' }}>{plantHistory?.predicao ? formatPrediction({ prediction: plantHistory?.predicao }) : '...'}</Text>
                        </View>
                    </BasicCard>

                    <View style={{ height: 320, padding: 8, borderRadius: 15, backgroundColor: Colors.background.backgroundColor }}>
                        {plantHistory?.foto_url ?
                            <Image source={{ uri: plantHistory.foto_url }} resizeMode="cover" style={{ width: '100%', height: '100%', borderRadius: 10 }} />
                            : <Text>Não foi possível carregar a imagem...</Text>}
                    </View>

                    <BasicCard style={{ alignItems: 'center', borderWidth: 4, borderColor: Colors.textColor.color, padding: 0, gap: 0, shadowOpacity: 0.4, flexDirection: 'row', flex: 1 }}>
                        <View style={{ backgroundColor: Colors.colorSoil.color, alignSelf: 'stretch', paddingVertical: 18, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, flex: 1 }}>
                            <Text style={{ fontSize: 22, color: Colors.white.color, textAlign: 'center', fontWeight: '700' }}>Confiança</Text>
                            <Text style={{ fontSize: 18, color: Colors.white.color, textAlign: 'center', fontWeight: '700' }}>do Diagnóstico</Text>
                        </View>
                        <View style={{ backgroundColor: Colors.colorParchment.color, alignSelf: 'stretch', justifyContent: 'center', paddingVertical: 18, borderBottomEndRadius: 8, borderTopEndRadius: 8, flex: 1 }}>
                            <Text style={{ fontSize: 24, textAlign: 'center', fontWeight: '600' }}>{plantHistory?.nivelSaudePredicao || '...'}%</Text>
                        </View>
                    </BasicCard>

                </ScrollView>
            </View>

            <Text style={{ color: Colors.colorDanger.color, display: fetchError ? 'flex' : 'none' }}>Tivemos um problema para carregar esses dados.</Text>

            <Popup
                visible={popupDeleteVisible}
                onClose={() => setPopupDeleteVisible(false)}
            >
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Ionicons name="alert-circle" size={32} color="orange" />
                    <Text style={{ fontSize: 22, paddingBottom: 10 }}>Atenção</Text>
                </View>

                <Text>Você está prestes a deletar esse diagnóstico e foto dessa planta.</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 15 }}>
                    <BasicButton color={Colors.softGray.color} title="Cancelar" onPress={() => setPopupDeleteVisible(false)} />
                    <BasicButton color={Colors.colorDanger.color} title="Deletar" onPress={() => Alert.alert("feature", 'soon')} />
                </View>
            </Popup>

            <StatusBar style="light" />
        </View >
    );
}