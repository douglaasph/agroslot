import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import ThemedStyles, { Colors } from "../styles/stylesheets";
import BasicButton from "../components/BasicButton";
import Input from "../components/BasicInput";
import { useState } from "react";
import BasicCard from "../components/BasicCard";
import { validateEmail, validatePassword } from "../common/Validation";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const styles = ThemedStyles();

  // values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // states
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // handle login
  function handleLogin() {
    setEmailError(false);
    setPasswordError(false);

    let validEmail = validateEmail(email);
    let validPassword = validatePassword(password);

    // email check
    if (!validEmail || !validPassword) {
      setEmailError(!validEmail);
      setPasswordError(!validPassword);
    } else {
      setEmailError(false);
      setPasswordError(false);
      setEmail('');
      setPassword('');
      navigation.navigate('Home');
    }

  }

  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={[Colors.colorPrimaryLight.color, Colors.colorGrass.color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { width: '100%', gap: 5 }]}
      >

        <View style={{ backgroundColor: Colors.whiteBackground.backgroundColor, borderRadius: '25%', padding: 12 }}>
          <Ionicons name='leaf' size={40} color={Colors.colorPrimary.color} />
        </View>

        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Text style={{ fontSize: 28, color: Colors.whiteBackground.backgroundColor, fontWeight: '500' }}>AgroSlot</Text>
          <Text style={{ fontSize: 12, color: Colors.whiteBackground.backgroundColor, opacity: 0.85 }}>Gestão inteligente de Soja</Text>
        </View>

        <BasicCard style={{ width: '85%' }}>
          <Text style={[styles.colorPrimary, { textAlign: 'left', fontSize: 20, fontWeight: 700 }]}>Entrar na conta</Text>

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
            errorMessage="Senha inválida"
          />

          <Text style={{ textAlign: 'right', color: Colors.colorPrimaryLight.color }} onPress={() => navigation.navigate('Recuperar Senha')}>Esqueci a minha senha</Text>

          <BasicButton onPress={handleLogin} disabled={false} loading={false} title={'Entrar'} />

          <Text style={{ textAlign: 'center', color: Colors.colorPrimaryLight.color }} onPress={() => navigation.navigate('Criar Conta')}>Não tem conta? Crie uma aqui</Text>

        </BasicCard>

        <StatusBar style="auto" />
      </LinearGradient>
    </View>
  );
}