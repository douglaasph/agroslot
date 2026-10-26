import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, View } from "react-native";
import ThemedStyles, { Colors } from "../styles/stylesheets";
import Popup from "../components/Modal";
import { useEffect, useState } from "react";
import BasicButton from "../components/BasicButton";
import { logout } from "../services/auth";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getMe } from "../services/user";
import CreatePlantationForm from "../components/CreatePlantationForm";
import { getPlantations } from "../services/plantation";
import BasicCard from "../components/BasicCard";
import LineProgress from "../components/LineProgress";

export default function HomeScreen({ navigation }) {
  const styles = ThemedStyles();
  const [popupVisible, setPopupVisible] = useState(false);
  const [user, setUser] = useState(null);

  // plantations
  const [plantations, setPlantations] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
  }, []);

  useEffect(() => {
    async function tryGetPlantations() {
      const res = await getPlantations();
      if (!res.success) {
        setFetchError(true);
      } else {
        setPlantations(res.plantations)
      }
    }
    tryGetPlantations();
  }, [refresh]);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background.backgroundColor, minHeight: '100%', justifyContent: 'flex-start' }]}>
      <LinearGradient
        colors={[Colors.colorPrimaryLight.color, Colors.colorGrass.color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: '100%', gap: 5, height: '25%', flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}
      >
        <View style={{ justifyContent: 'center', paddingLeft: 20 }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ionicons name='leaf' size={20} color={Colors.lightText.color} />
            <Text style={{ fontWeight: '500', color: Colors.lightText.color }}>AgroSlot</Text>
          </View>
          <Text style={{ color: Colors.whiteBackground.backgroundColor, fontWeight: 'bold', fontSize: 28 }}>Olá, {user?.nome.split(' ')[0] || '...'}</Text>
          <Text style={{ color: Colors.lightText.color, fontWeight: '500' }}>Sua fazenda está crescendo bem.</Text>
        </View>

        <Pressable onPress={() => navigation.navigate('Minha Conta')} style={{ backgroundColor: Colors.colorPrimaryLight.color, borderColor: Colors.lightText.color, borderWidth: 1, height: 40, width: 40, justifyContent: 'center', alignSelf: 'center', borderRadius: '100%' }}>
          <Text style={{ textAlign: 'center', color: Colors.whiteBackground.backgroundColor }}>{user?.nome[0].toUpperCase() || ' '}</Text>
        </Pressable>

      </LinearGradient >
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', paddingVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center' }}>Minhas Plantações</Text>
        <BasicButton onPress={() => setPopupVisible(true)} title={"+ Nova Plantação"} />
      </View>

      {!fetchError ?

        <ScrollView
          style={{
            width: '90%',
            alignSelf: 'center',
            flex: 1
          }}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 60,
            gap: 10
          }}>
          {plantations?.map((p) => (
            <BasicCard style={{ width: '100%' }}>
              <Pressable style={{ flex: 1, gap: 8 }} onPress={() => navigation.navigate('Plantação', { rawPlantation: p })}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 20 }}>{p.nome}</Text>
                    <Text style={{ color: Colors.softGray.color }}>{p.linhas} x {p.colunas} slots</Text>
                  </View>

                  <Ionicons name="flower-outline" size={24} color="orange" />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: Colors.softGray.color }}>Ocupação</Text>
                  <Text style={{ color: Colors.softGray.color }}>{p.linhas}/{p.capacidade} slots</Text>
                </View>

                <LineProgress current={p.linhas} max={p.capacidade} />
              </Pressable>
            </BasicCard>
          ))}

          {plantations.length === 0 ?
            <View>
              <Text style={{ color: Colors.softGray.color, fontWeight: '500' }}>Sem plantações ainda...</Text>
            </View>

            : null}

        </ScrollView>
        :
        <Text style={{ color: Colors.colorDanger.color, fontWeight: '500' }}>Erro ao buscar suas plantações :/</Text>
      }

      <Popup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
      >
        <CreatePlantationForm onCancel={() => setPopupVisible(false)} onCreate={() => setRefresh(true)} />

      </Popup>
      <StatusBar style="auto" />
    </View >
  );
}