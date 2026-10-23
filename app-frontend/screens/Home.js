import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import ThemedStyles, { Colors } from "../styles/stylesheets";
import BackButtonTest from "../components/BackButtonTest";
import Popup from "../components/Modal";
import { useEffect, useState } from "react";
import BasicButton from "../components/BasicButton";
import { logout } from "../services/auth";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const styles = ThemedStyles();
  const [popupVisible, setPopupVisible] = useState(false);
  const [user, setUser] = useState({ 'nome': 'João da Silva', email: 'joazinho@gmail.com' });

  const handleLogout = async () => {
    await logout();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    })
  }

  // useEffect(() => {
  //   async function getUser() {
  //     const user = { 'nome': 'João da Silva', email: 'joazinho@gmail.com' };
  //     setUser(user);
  //   }
  //   getUser()
  // })

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
          <Text style={{ textAlign: 'center', color: Colors.whiteBackground.backgroundColor }}>{user?.nome[0] || ' '}</Text>
        </Pressable>

      </LinearGradient >
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', paddingVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center' }}>Minhas Plantações</Text>
        <BasicButton title={"+ Nova Plantação"} />
      </View>
      <BasicButton title="Logout" onPress={handleLogout} />
      <BasicButton
        title="show popup"
        onPress={() => setPopupVisible(true)}
      >

      </BasicButton>

      <Popup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
      >
        <Text style={styles.title}>
          Eu sou um exemplo de como usar o modal
        </Text>

        <Text style={styles.description}>
          :D
        </Text>

        <BasicButton
          title="close"
          onPress={() => setPopupVisible(false)}
        />
      </Popup>
      <StatusBar style="auto" />
    </View >
  );
}