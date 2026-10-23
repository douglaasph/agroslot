import { LinearGradient } from "expo-linear-gradient";
import { Button, View } from "react-native-web";
import ThemedStyles, { Colors } from "../../styles/stylesheets";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, Text } from "react-native";
import BasicCard from "../../components/BasicCard";
import Input from "../../components/BasicInput";
import BasicButton from "../../components/BasicButton";
import { validatePassword } from "../../common/Validation";
import { changeUserPassword } from "../../services/user";

export default function ChangePassword({ navigation }) {
    const styles = ThemedStyles();
    const [loading, setLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // erros
    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState(false);
    const [changePasswordErrorMessage, setChangePasswordErrorMessage] = useState('');


    // alert de sucesso
    const showAlert = () => {
        Alert.alert(
            "Sucesso",
            "Sua senha foi alterada com sucesso!",
            { cancelable: true }
        );
    };

    // handle create
    function handleChange() {
        setLoading(true);
        setOldPasswordError(false);
        setNewPasswordError(false);
        setConfirmNewPasswordError(false);
        setChangePasswordError(false);
        setChangePasswordErrorMessage('');

        let validPassword = validatePassword(newPassword);
        let matchPassword = newPassword === confirmNewPassword;

        // checks
        if (!validPassword || !matchPassword) {
            setNewPasswordError(!validPassword);
            setConfirmNewPasswordError(!matchPassword);
            setLoading(false);
        } else {

            async function tryChangePassword({ oldPassword, newPassword }) {
                const res = await changeUserPassword({ currentPassword: oldPassword, newPassword: newPassword });

                if (!res.success) {
                    setChangePasswordError(true);
                    setChangePasswordErrorMessage(res.error);
                    return;
                } else {
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');

                    // ação conclusiva
                    showAlert();
                    navigation.goBack();
                }
            }

            tryChangePassword({ oldPassword, newPassword });

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
                    label="Senha Atual"
                    placeholder="********"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    keyboardType="password"
                    error={oldPasswordError}
                    secureTextEntry
                    errorMessage="Senha deve ser maior ou igual a 8 caracteres e deve conter letras maísculas, minúsculas, números e caracteres especiais"
                />

                <Input
                    label="Senha Nova"
                    placeholder="********"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    keyboardType="password"
                    error={newPasswordError}
                    secureTextEntry
                    errorMessage="Senha deve ser maior ou igual a 8 caracteres e deve conter letras maísculas, minúsculas, números e caracteres especiais"
                />

                <Input
                    label="Confirmar Senha Nova"
                    placeholder="********"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    keyboardType="password"
                    error={confirmNewPasswordError}
                    secureTextEntry
                    errorMessage="Senhas não coincidem"
                />

                <Text style={{ color: Colors.colorDanger.color, display: changePasswordError ? 'flex' : 'none' }}>Erro: {changePasswordErrorMessage}</Text>

                <BasicButton onPress={() => handleChange()} disabled={oldPassword.length === '' || newPassword.length === 0 || confirmNewPassword.length === 0} loading={loading} title={'Alterar senha'} />

            </BasicCard>

            <StatusBar style="auto" />
        </View >
    );
}