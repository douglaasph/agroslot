import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native-web";
import ThemedStyles, { Colors } from "../../styles/stylesheets";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text } from "react-native";
import BasicCard from "../../components/BasicCard";
import Input from "../../components/BasicInput";
import BasicButton from "../../components/BasicButton";
import { validateEmail } from "../../common/Validation";
import { changeNameOrEmail, getMe } from "../../services/user";

export default function ChangeNameEmail({ navigation }) {
    const styles = ThemedStyles();
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const [user, setUser] = useState(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // erros
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [changeNameEmailError, setChangeNameEmailError] = useState(false);
    const [changeNameEmailErrorMessage, setChangeNameEmailErrorMessage] = useState('');


    // alert de sucesso
    const showAlert = () => {
        Alert.alert(
            "Sucesso",
            "Suas alterações foram salvas!",
            { cancelable: true }
        );
    };

    useEffect(() => {
        async function getUser() {
            const user = await getMe();
            if (!user.success) {
                handleLogout();
            } else {
                setUser(user.user);
                setName(user.user.nome);
                setEmail(user.user.email);
            }
        }
        getUser();
    }, [saved])

    // handle create
    function handleChange() {
        setLoading(true);
        setNameError(false);
        setEmailError(false);
        setChangeNameEmailError(false);
        setChangeNameEmailErrorMessage('');

        let validEmail = validateEmail(email);
        let validName = name.length >= 10;

        // checks
        if (!validEmail || !validName) {
            setNameError(!validEmail);
            setEmailError(!validName);
            setLoading(false);
        } else {

            async function trySaveChanges({ name, email }) {
                const res = await changeNameOrEmail({ nome: name, email });

                if (!res.success) {
                    setChangeNameEmailError(true);
                    setChangeNameEmailErrorMessage(res.error);
                    return;
                } else {
                    setName('');
                    setEmail('');
                    setLoading(false);
                    setSaved(true);

                    // ação conclusiva
                    showAlert();
                }
            }

            trySaveChanges({ name, email });

        }

    }

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
                        <Ionicons name="key" color="orange" size={24} />
                        <Text style={{ fontSize: 18, color: Colors.background.backgroundColor, fontWeight: '400' }}>Alterar Senha</Text>
                    </View>
                </View>

            </LinearGradient >

            <BasicCard style={{ width: '85%' }}>
                <Input
                    label="Nome Completo"
                    placeholder="Alex Silva"
                    value={name}
                    onChangeText={setName}
                    error={nameError}
                    errorMessage="Nome inválido"
                />

                <Input
                    label="Email"
                    placeholder="voce@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    error={emailError}
                    errorMessage="Email inválido"
                />

                <Text style={{ color: Colors.colorDanger.color, display: changeNameEmailError ? 'flex' : 'none' }}>Erro: {changeNameEmailErrorMessage}</Text>

                <BasicButton onPress={() => handleChange()} disabled={name.length === '' || email.length === 0 || (name === user.nome && email === user.email)} loading={loading} title={'Salvar Alterações'} />

            </BasicCard>

            <StatusBar style="auto" />
        </View >
    );
}