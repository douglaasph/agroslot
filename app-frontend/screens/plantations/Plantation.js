import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View, ScrollView } from "react-native";
import BasicButton from "../../components/BasicButton";
import CreatePlantationForm from "../../components/CreatePlantationForm";
import CreatePlantForm from "../../components/CreatePlantForm";
import Popup from "../../components/Modal";
import { deletePlantation, getPlantation } from "../../services/plantation";
import ThemedStyles, { Colors } from "../../styles/stylesheets";
import { getPlantsByPlantationId } from "../../services/plant";
import DropdownC from "../../components/Dropdown";

export default function Plantation({ navigation, route }) {
    const { rawPlantation } = route.params;
    const styles = ThemedStyles();
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
    const [popupCreatePlantVisible, setPopupCreatePlantVisible] = useState(false);

    const [refresh, setRefresh] = useState(false);

    const [chosenPosicaoX, setChosenPosicaoX] = useState(null);
    const [chosenPosicaoY, setChosenPosicaoY] = useState(null);
    const [plantationId, setPlantationId] = useState(null);

    // plantations
    const [plantation, setPlantation] = useState(null);
    const [fetchError, setFetchError] = useState(false);
    // mock for a 3 row 5 col plantation
    const [plants, setPlants] = useState([]);

    async function tryGetPlantation() {
        const res = await getPlantation({ plantationId: plantation.id });
        if (!res.success) {
            setFetchError(true);
        } else {
            setPlantation(res.plantation)
        }
    }

    async function getPlants() {
        const res = await getPlantsByPlantationId({ plantationId: rawPlantation.id, rows: rawPlantation.linhas, cols: rawPlantation.colunas });
        if (!res.success) {
            setFetchError(true);
        } else {
            setPlants(res.plants)
        }
    }

    useEffect(() => {
        setPlantation(rawPlantation);
        getPlants();
    }, []);

    useEffect(() => {
        if (refresh) {
            getPlants();
        }
    }, [refresh])

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

    function openCreatePlantForm({p_x, p_y}) {
        setPlantationId(plantation.id)
        setChosenPosicaoX(p_x);
        setChosenPosicaoY(p_y);
        setPopupCreatePlantVisible(true);
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
            
            <View style={{padding: 15, flexDirection: 'row', alignContent: 'space-between', justifyContent: 'space-between', width: '90%'}}>
                <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                    <View style={{backgroundColor: Colors.colorPrimary.color, borderRadius: '50%', width: 15, height: 15}} />
                    <Text>Saudável</Text>
                </View> 
                <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                    <View style={{backgroundColor: 'orange', borderRadius: '50%', width: 15, height: 15}} />
                    <Text>Atenção</Text>
                </View>      
                <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                    <View style={{backgroundColor: Colors.colorDanger.color, borderRadius: '50%', width: 15, height: 15}} />
                    <Text>Perigo</Text>
                </View>   
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
                                                {plants?.filter((p) => p.posicaoX === index + 1).map((p) => (
                                                    <PlantSlot key={p.id} available={p.available} status={p.status} onPress={() => p.available ? openCreatePlantForm({p_x: p.posicaoX, p_y: p.posicaoY}) : navigation.navigate('Planta', {'rawPlant': p, 'plantation': plantation, 'onGoBack': (update) => { if (update) getPlants()}})} />
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
                    visible={popupCreatePlantVisible}
                    onClose={() => setPopupCreatePlantVisible(false)}
                >
       <CreatePlantForm onCancel={() => setPopupCreatePlantVisible(false)} plantation_id={plantationId} posicao_x={chosenPosicaoX} posicao_y={chosenPosicaoY} onCreate={() => setRefresh(true)} />
            </Popup>

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