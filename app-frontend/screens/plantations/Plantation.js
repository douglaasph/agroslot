import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import BasicButton from "../../components/BasicButton";
import CreatePlantationForm from "../../components/CreatePlantationForm";
import Popup from "../../components/Modal";
import { deletePlantation, getPlantation } from "../../services/plantation";
import ThemedStyles, { Colors } from "../../styles/stylesheets";

export default function Plantation({ navigation, route }) {
    const { rawPlantation } = route.params;
    const styles = ThemedStyles();
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
    // plantations
    const [plantation, setPlantation] = useState(null);
    const [fetchError, setFetchError] = useState(false);
    // mock for a 3 row 5 col plantation
    const [plants, setPlants] = useState([{ 'id': 1, 'nome': 'planta1', 'especie_planta': 'SOJA', 'posicao_x': 1, 'posicao_y': 1, 'available': false, status: 'healthy' },
    { 'id': 2, 'nome': 'planta2', 'especie_planta': 'SOJA', 'posicao_x': 1, 'posicao_y': 2, 'available': false, status: 'attention' },
    { 'id': 7, 'nome': '', 'especie_planta': '', 'posicao_x': 1, 'posicao_y': 4, 'available': true },
    { 'id': 8, 'nome': '', 'especie_planta': '', 'posicao_x': 1, 'posicao_y': 5, 'available': true },
    { 'id': 3, 'nome': '', 'especie_planta': '', 'posicao_x': 1, 'posicao_y': 3, 'available': true },

    { 'id': 4, 'nome': 'planta3', 'especie_planta': 'SOJA', 'posicao_x': 3, 'posicao_y': 1, 'available': false, status: 'danger' },
    { 'id': 5, 'nome': '', 'especie_planta': '', 'posicao_x': 3, 'posicao_y': 2, 'available': true },
    { 'id': 6, 'nome': 'planta4', 'especie_planta': 'SOJA', 'posicao_x': 3, 'posicao_y': 3, 'available': false, status: 'attention' },
    { 'id': 9, 'nome': '', 'especie_planta': '', 'posicao_x': 3, 'posicao_y': 4, 'available': true },
    { 'id': 10, 'nome': '', 'especie_planta': '', 'posicao_x': 3, 'posicao_y': 5, 'available': true },

    { 'id': 1, 'nome': 'planta1', 'especie_planta': 'SOJA', 'posicao_x': 2, 'posicao_y': 1, 'available': false, status: 'healthy' },
    { 'id': 2, 'nome': 'planta2', 'especie_planta': 'SOJA', 'posicao_x': 2, 'posicao_y': 2, 'available': false, status: 'attention' },
    { 'id': 7, 'nome': '', 'especie_planta': '', 'posicao_x': 2, 'posicao_y': 4, 'available': true },
    { 'id': 8, 'nome': '', 'especie_planta': '', 'posicao_x': 2, 'posicao_y': 5, 'available': true },
    { 'id': 3, 'nome': '', 'especie_planta': '', 'posicao_x': 2, 'posicao_y': 3, 'available': true },
    ]);

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
            Alert.alert("Sucesso", "Plantação excluída com sucesso!");
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

            <View style={{
                backgroundColor: Colors.colorPrimaryDark.color, width: '90%', maxHeight: '50%', height: rawPlantation?.linhas * 70 + 60, borderRadius: 10, alignItems: 'center', padding: 10
            }}>
                <View style={{
                    backgroundColor: Colors.colorSoil.color, width: '100%', height: '100%', borderRadius: 10, padding: 5
                }}>
                    <View style={{
                        borderRadius: 6,
                        backgroundColor: Colors.brownBorder.color, padding: 3, flex: 1
                    }}>
                        <View style={{
                            backgroundColor: Colors.colorGrass.color, borderRadius: 6,
                            borderColor: Colors.colorSoil.color, borderWidth: 5, flex: 1, padding: 10,
                        }}>
                            <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true}>
                                <ScrollView horizontal={true} nestedScrollEnabled={true} showsHorizontalScrollIndicator={true}>
                                    <View style={{
                                        flexDirection: 'column', gap: 5
                                    }}>
                                        {Array.from({ length: rawPlantation?.linhas }, (_, index) => (
                                            <View
                                                key={index}
                                                style={{
                                                    flexDirection: 'row',
                                                    gap: 5,
                                                    justifyContent: 'center',
                                                    paddingBottom: 5
                                                }}
                                            >
                                                {plants?.filter((p) => p.posicao_x === index + 1).map((p) => (
                                                    <PlantSlot key={p.id} available={p.available} status={p.status} onPress={() => alert(p.nome)} />
                                                ))}
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </ScrollView>
                        </View>
                    </View>
                </View>

            </View>

            <Text style={{ color: Colors.colorDanger.color, display: fetchError ? 'flex' : 'none' }}>{fetchError}</Text>

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

export function PlantSlot({ available, status, onPress }) {
    let color = Colors.colorHealthy.color;

    switch (status) {
        case 'danger':
            color = Colors.colorDanger.color;
        case 'attention':
            color = 'orange'
    }

    return (
        <Pressable
            onPress={onPress}
            style={{
                backgroundColor: Colors.colorSoil.color,
                padding: 10, borderRadius: 15,
                shadowOffset: { width: 1, height: 2 }, shadowColor: 'black', shadowOpacity: 0.3
            }}
        >
            {available ?
                <Ionicons name="add" size={32} color={Colors.brownBorder.color} /> :
                <Ionicons name="leaf" size={32} color={color} />
            }
        </Pressable>
    )
}