import { StatusBar } from "expo-status-bar";
import { Alert, ScrollView, Text, View } from "react-native";
import ThemedStyles, { Colors } from "../styles/stylesheets";
import BackButtonTest from "../components/BackButtonTest";
import { useState } from "react";
import BasicButton from "../components/BasicButton";
import { validateEmail } from "../common/Validation";
import BasicCard from "../components/BasicCard";
import Input from "../components/BasicInput";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function RecoverPassword({ navigation }) {
    const styles = ThemedStyles();

    // values
    const [email, setEmail] = useState('');

    // states
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);

    // success alert
    const showAlert = () => {
        Alert.alert(
            "Sucesso",
            "O link foi enviado com sucesso! Por gentileza, cheque o seu email.",
            { cancelable: true }
        );
    };

    // handle recover
    function handleRecover() {
        setLoading(true);
        setEmailError(false);

        let validEmail = validateEmail(email);

        // checks
        if (!validEmail) {
            setEmailError(!validEmail);
            setLoading(false);
        } else {
            setLoading(false);
            setEmailError(false);
            setEmail('');

            // ação conclusiva
            // navigation.navigate('Login')
            showAlert();
        }

    }

    return (
        <View style={[styles.container, { width: '100%' }]}>
            <LinearGradient
                colors={[Colors.colorPrimaryLight.color, Colors.colorGrass.color]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '100%', flex: 1 }}
            >
                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center',
                    paddingBottom: 60,
                    justifyContent: 'center',
                    gap: 10

                }}>

                    <View style={{ backgroundColor: Colors.whiteBackground.backgroundColor, borderRadius: '25%', padding: 12 }}>
                        <Ionicons name='leaf' size={40} color={Colors.colorPrimary.color} />
                    </View>

                    <BasicCard style={{ width: '85%' }}>
                        <Text style={[styles.colorPrimary, { textAlign: 'left', fontSize: 20, fontWeight: 700 }]}>Recuperar senha</Text>

                        <Text>Digite seu email para receber o link para redefinir a sua senha.</Text>

                        <Input
                            label="Email"
                            placeholder="voce@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            error={emailError}
                            errorMessage="Email inválido"
                        />

                        <BasicButton onPress={handleRecover} disabled={false} loading={loading} title={'Enviar link'} />

                        <Text style={{ textAlign: 'center', color: Colors.colorPrimaryLight.color }} onPress={() => navigation.goBack()}>Voltar para login</Text>

                    </BasicCard>

                    <StatusBar style="auto" />
                </ScrollView>
            </LinearGradient>
        </View>
    );
}