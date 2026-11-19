import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View, ScrollView, Linking, Image } from "react-native";
import BasicButton from "../../components/BasicButton";
import CreatePlantForm from "../../components/CreatePlantForm";
import Popup from "../../components/Modal";
import ThemedStyles, { Colors } from "../../styles/stylesheets";
import { deletePlant } from "../../services/plant";
import BasicCard from "../../components/BasicCard";
import LineProgress from "../../components/LineProgress";
import * as ImagePicker from 'expo-image-picker';

export default function Plant({ navigation, route }) {
    const { rawPlant } = route.params;
    const { plantation } = route.params;
    const { onGoBack } = route.params;
    const styles = ThemedStyles();

    const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
    const [popupEditPlantVisible, setPopupEditPlantVisible] = useState(false);

    const [refresh, setRefresh] = useState(false);

    const [plant, setPlant] = useState(null);
    const [fetchError, setFetchError] = useState(false);
    const [currentX, setCurrentX] = useState(0);
    const [currentY, setCurrentY] = useState(0);

    const [image, setImage] = useState(null);
    const [popupSelectImageVisible, setPopupSelectImageVisible] = useState(false);

    const [historico, setHistorico] = useState([{ 'id': 1, 'title': 'Saudável', 'date': '2026-07-10', 'confidence': 0.97 },
    { 'id': 2, 'title': 'Ferrugem Asiática', 'date': '2026-10-13', 'confidence': 0.84 }
    ]);

    useEffect(() => {
        setPlant(rawPlant);
    }, []);

    useEffect(() => {
        if (plant?.posicaoX && plant.posicaoX !== currentX) {
            setCurrentX(plant.posicaoX);
        }

        if (plant?.posicaoY && plant.posicaoY !== currentY) {
            setCurrentY(plant.posicaoY);
        }

    }, [plant])

    async function tryDelete() {
        const res = await deletePlant({ plantId: plant.id });

        if (!res.success) {
            alert('Erro ao excluir planta.');
        } else {
            Alert.alert("Sucesso", "Planta excluída com sucesso!");
            onGoBack(true);
            navigation.goBack();
        }
    }

    function getStyle({ status, icon }) {
        if (!icon) {
            if (status == 'healthy') {
                return { backgroundColor: Colors.colorPrimaryLight.color }
            } else if (status == 'danger') {
                return { backgroundColor: Colors.colorDanger.color, color: Colors.whiteBackground.backgroundColor }
            } else {
                return { backgroundColor: Colors.softGray.color }
            }
        } else {
            if (status == 'healthy') {
                return { color: Colors.colorPrimaryLight.color }
            } else if (status == 'danger') {
                return { color: Colors.colorDanger.color }
            } else {
                return { color: Colors.softGray.color }
            }
        }
    }

    // função para abrir a galeria
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }

    };

    // pedir permissão pra abrir camera
    const requestCameraPermission = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                'Permissão necessária',
                'Para tirar uma foto, você precisa permitir o acesso à câmera nas configurações do aplicativo.',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Abrir configurações',
                        onPress: () => Linking.openSettings(),
                    },
                ]
            );

            return false;
        }

        return true;
    };

    // função para abrir a camera
    const openCamera = async () => {
        const hasPermission = await requestCameraPermission();

        if (!hasPermission) return;

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaType,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }

    };

    const closeImagePopup = () => {
        setPopupSelectImageVisible(false);
        setImage(null);
    }

    return (
        <View style={[styles.container, { backgroundColor: Colors.colorParchment.color, minHeight: '100%', justifyContent: 'flex-start' }]}>
            <View style={{ justifyContent: 'flex-start', paddingLeft: 20, paddingBottom: 5, flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingTop: 30, width: '100%', backgroundColor: Colors.whiteBackground.backgroundColor }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Pressable onPress={() => {
                        onGoBack(true);
                        navigation.goBack();
                    }} style={{ backgroundColor: Colors.background.backgroundColor, borderRadius: '25%', padding: 6 }}>
                        <Ionicons name="return-up-back" color={Colors.colorSoil.color} size={28} />
                    </Pressable>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 18, color: Colors.colorPrimary.color, fontWeight: '500' }}>{plant?.nome}</Text>
                        <Text style={{ color: Colors.softGray.color }}>{plantation?.nome} - Slot ({currentX ? currentX : '...'}, {currentY ? currentY : '...'})</Text>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center', width: '100%', paddingVertical: 10 }}>

                <BasicButton onPress={() => setPopupEditPlantVisible(true)} title={"Editar"} />
                <BasicButton onPress={() => setPopupDeleteVisible(true)} title={"Deletar"} color={Colors.colorDanger.color} />
            </View>

            <View style={{ flexDirection: 'column', justifyContent: 'space-between', gap: 20, paddingHorizontal: 10, alignItems: 'center', width: '100%', paddingVertical: 10 }}>

                <BasicCard style={{ flexDirection: 'row', alignItems: 'stretch', width: '100%' }}>
                    <Ionicons name="leaf" style={getStyle({ status: plant?.status, icon: true })} size={44} />
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>{plant?.nome}</Text>
                            <Text style={[getStyle({ status: plant?.status, icon: false }), { padding: 5, borderRadius: '5%' }]}>{plant?.status || 'Saudável'}</Text>
                        </View>
                        <Text style={{ color: Colors.softGray.color }}>Cadastrada em: {plant?.created || '...'}</Text>
                        <Text style={{ color: Colors.softGray.color }}>Posição: linha {currentX ? currentX : '...'} coluna {currentY ? currentY : '...'}</Text>
                    </View>
                </BasicCard>

                <BasicButton onPress={() => setPopupSelectImageVisible(true)} title={"Realizar Diagnóstico"} />
            </View>

            <View style={{
                width: '100%', padding: 10, flex: 1
            }}>
                <Text style={{ fontSize: 18, fontWeight: '400' }}>Histórico de Diagnósticos</Text>

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
                    {historico?.map((h) => (
                        <HistoryCard title={h.title} key={h.id} date={h.date} confidence={h.confidence} onPress={() => alert('OK')} />
                    ))}

                </ScrollView>
            </View>

            <Text style={{ color: Colors.colorDanger.color, display: fetchError ? 'flex' : 'none' }}>{fetchError}</Text>

            <Popup
                visible={popupEditPlantVisible}
                onClose={() => setPopupEditPlantVisible(false)}
            >
                <CreatePlantForm onCancel={() => setPopupEditPlantVisible(false)} edit originalPlant={plant} onCreate={setPlant} />
            </Popup>

            <Popup
                visible={popupDeleteVisible}
                onClose={() => setPopupDeleteVisible(false)}
            >
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Ionicons name="alert-circle" size={32} color="orange" />
                    <Text style={{ fontSize: 22, paddingBottom: 10 }}>Atenção</Text>
                </View>

                <Text>Você está prestes a deletar essa planta.</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 15 }}>
                    <BasicButton color={Colors.softGray.color} title="Cancelar" onPress={() => setPopupDeleteVisible(false)} />
                    <BasicButton color={Colors.colorDanger.color} title="Deletar" onPress={tryDelete} />
                </View>
            </Popup>

            <Popup
                visible={popupSelectImageVisible}
                onClose={closeImagePopup}
            >
                <Text style={{ fontWeight: '500', fontSize: 18, paddingBottom: 12 }}>Diagnosticar Planta</Text>
                {!image ?
                    <BasicCard style={{ flexDirection: 'column', gap: 15, shadowOpacity: 0, padding: 3 }}>
                        <Text style={{ textAlign: 'center' }}>Precisamos de uma foto da folha da sua planta para realizar o diagnóstico</Text>
                        <Pressable
                            onPress={pickImage}
                            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 40, shadowColor: Colors.softGray.color, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 4, elevation: 3, borderRadius: 5, backgroundColor: Colors.whiteBackground.backgroundColor }}>
                            <Text>Escolher da galeria</Text>
                            <Ionicons name="image" size={28} color={Colors.colorPrimaryDark.color} />
                        </Pressable>
                        <Pressable
                            onPress={openCamera}
                            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 40, shadowColor: Colors.softGray.color, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 4, elevation: 3, borderRadius: 5, backgroundColor: Colors.whiteBackground.backgroundColor }}>
                            <Text>Tirar foto</Text>
                            <Ionicons size={28} color={Colors.colorPrimary.color} name="camera" />
                        </Pressable>
                    </BasicCard> :
                    <View style={{ flexDirection: 'column', gap: 15, alignItems: 'center' }}>
                        <Text>A imagem foi carregada com sucesso!!</Text>
                        <Image source={{ uri: image }} style={{ width: 100, height: 100, resizeMode: 'cover', borderRadius: 10 }} />
                        <BasicButton title="Realizar diagnóstico" />
                    </View>
                }
            </Popup>

            <StatusBar style="dark" />
        </View >
    );
}

export function HistoryCard({ title, date, confidence, onPress }) {

    return (
        <Pressable
            onPress={onPress}
        >
            <BasicCard style={{ flexDirection: 'row' }}>
                <View style={{ width: '15%', backgroundColor: Colors.softGray.color, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons size={34} name="image" />
                </View>
                <View style={{ flexGrow: 2 }}>
                    <Text style={{ fontSize: 16 }}>{title || '...'}</Text>
                    <Text style={{ color: Colors.softGray.color, fontSize: 14 }}>{date || '...'}</Text>
                </View>
                <View style={{ flexGrow: 1, flexDirection: 'column' }}>
                    <Text style={{ textAlign: 'right' }}>{confidence * 100 || '...'}%</Text>
                    <Text style={{ color: Colors.softGray.color, fontSize: 14, textAlign: 'right' }}>confiança</Text>
                    <LineProgress max={100} current={confidence * 100} />
                </View>
            </BasicCard>
        </Pressable>
    )
}