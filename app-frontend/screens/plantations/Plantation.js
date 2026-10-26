import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, View } from "react-native";
import ThemedStyles, { Colors } from "../../styles/stylesheets";
import Popup from "../../components/Modal";
import { useEffect, useState } from "react";
import BasicButton from "../../components/BasicButton";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import CreatePlantationForm from "../../components/CreatePlantationForm";
import { deletePlantation, getPlantation } from "../../services/plantation";
import BasicCard from "../../components/BasicCard";
import LineProgress from "../../components/LineProgress";

export default function Plantation({ navigation, route }) {
    const { rawPlantation } = route.params;
    const styles = ThemedStyles();
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
    // plantations
    const [plantation, setPlantation] = useState(null);
    const [fetchError, setFetchError] = useState(false);

    async function tryGetPlantation() {
        const res = await getPlantation({ plantationId: plantation.id });
        if (!res.success) {
            setFetchError(true);
        } else {
            setPlantation(res.plantation)
        }
    }

    useEffect(() => {
        setPlantation(rawPlantation);
    }, []);

    async function tryDelete() {
        const res = await deletePlantation({ plantationId: plantation.id });

        if (!res.success) {
            alert('Erro ao excluir plantação.');
        } else {
            alert('Plantação excluída com sucesso!');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            });
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: Colors.colorParchment.color, minHeight: '100%', justifyContent: 'flex-start' }]}>
            <View style={{ justifyContent: 'flex-start', paddingLeft: 20, paddingBottom: 5, flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingTop: 30, width: '100%', backgroundColor: Colors.whiteBackground.backgroundColor }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Pressable onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} style={{ backgroundColor: Colors.background.backgroundColor, borderRadius: '25%', padding: 6 }}>
                        <Ionicons name="return-up-back" color={Colors.colorSoil.color} size={28} />
                    </Pressable>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 18, color: Colors.colorPrimary.color, fontWeight: '500' }}>{plantation?.nome}</Text>
                        <Text style={{ color: Colors.softGray.color }}>Matriz {plantation?.linhas} x {plantation?.colunas}</Text>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center', width: '100%', paddingVertical: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center' }}>Minhas Plantas</Text>
                <BasicButton onPress={() => setPopupVisible(true)} title={"Editar"} />
                <BasicButton onPress={() => setPopupDeleteVisible(true)} title={"Deletar"} color={Colors.colorDanger.color} />
            </View>

            <Popup
                visible={popupVisible}
                onClose={() => setPopupVisible(false)}
            >
                <CreatePlantationForm onCancel={() => setPopupVisible(false)} onCreate={tryGetPlantation} edit originalPlantation={plantation} />

            </Popup>

            <Popup
                visible={popupDeleteVisible}
                onClose={() => setPopupDeleteVisible(false)}
            >
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Ionicons name="alert-circle" size={32} color="orange" />
                    <Text style={{ fontSize: 22, paddingBottom: 10 }}>Atenção</Text>
                </View>

                <Text>Você está prestes a deletar essa plantação.</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 15 }}>
                    <BasicButton color={Colors.softGray.color} title="Cancelar" onPress={() => setPopupDeleteVisible(false)} />
                    <BasicButton color={Colors.colorDanger.color} title="Deletar" onPress={tryDelete} />
                </View>
            </Popup>

            <StatusBar style="auto" />
        </View >
    );
}