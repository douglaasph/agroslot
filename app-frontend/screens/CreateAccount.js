import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import ThemedStyles, { Colors } from "../styles/stylesheets";
import BackButtonTest from "../components/BackButtonTest";
import { useState } from "react";
import BasicButton from "../components/BasicButton";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BasicCard from "../components/BasicCard";
import Input from "../components/BasicInput";
import { validateEmail, validatePassword } from "../common/Validation";

export default function CreateAccount({ navigation }) {
    const styles = ThemedStyles();

    // values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');

    // states
    const [loading, setLoading] = useState(false);
    const [fullNameError, setFullNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    // handle create
    function handleCreate() {
        setLoading(true);
        setEmailError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);
        setFullNameError(false);

        let validEmail = validateEmail(email);
        let validPassword = validatePassword(password);
        let matchPassword = password === confirmPassword;
        let fullNameValid = fullName.length > 10;

        // checks
        if (!validEmail || !validPassword || !matchPassword || !fullNameValid) {
            setEmailError(!validEmail);
            setPasswordError(!validPassword);
            setConfirmPasswordError(!matchPassword);
            setFullNameError(!fullNameValid)
            setLoading(false);
        } else {
            setLoading(false);
            setEmailError(false);
            setPasswordError(false);
            setConfirmPasswordError(false);
            setFullNameError(false);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setFullName('');

            // ação conclusiva
            // navigation.navigate('Home');
            alert('Conta criada com sucesso!')
        }

    }

    return (
        <View style={[styles.container, { width: '100%' }]}>
            <LinearGradient
                colors={[Colors.colorPrimaryLight.color, Colors.colorGrass.color]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '100%', paddingTop: 30 }}
            >
                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center',
                    paddingBottom: 60

                }}>

                    <View style={{ backgroundColor: Colors.whiteBackground.backgroundColor, borderRadius: '25%', padding: 12 }}>
                        <Ionicons name='leaf' size={40} color={Colors.colorPrimary.color} />
                    </View>

                    <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                        <Text style={{ fontSize: 28, color: Colors.whiteBackground.backgroundColor, fontWeight: '500' }}>AgroSlot</Text>
                    </View>

                    <BasicCard style={{ width: '85%' }}>
                        <Text style={[styles.colorPrimary, { textAlign: 'left', fontSize: 20, fontWeight: 700 }]}>Criar conta</Text>

                        <Input
                            label="Nome Completo"
                            placeholder="Alex Silva"
                            value={fullName}
                            onChangeText={setFullName}
                            error={fullNameError}
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

                        <Input
                            label="Senha"
                            placeholder="********"
                            value={password}
                            onChangeText={setPassword}
                            keyboardType="password"
                            error={passwordError}
                            secureTextEntry
                            errorMessage="Senha deve ser maior ou igual a 8 caracteres e deve conter letras maísculas, minúsculas, números e caracteres especiais"
                        />

                        <Input
                            label="Confirmar senha"
                            placeholder="********"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            keyboardType="password"
                            error={confirmPasswordError}
                            secureTextEntry
                            errorMessage="Senhas não coincidem"
                        />

                        <BasicButton onPress={handleCreate} disabled={false} loading={loading} title={'Criar conta'} />

                        <Text style={{ textAlign: 'center', color: Colors.colorPrimaryLight.color }} onPress={() => navigation.goBack()}>Já tem conta? Entre aqui</Text>

                    </BasicCard>

                    <StatusBar style="auto" />
                </ScrollView>
            </LinearGradient>
        </View>
    );
}