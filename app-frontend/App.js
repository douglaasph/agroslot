import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import RecoverPassword from './screens/RecoverPassword';
import CreateAccount from './screens/CreateAccount';
import MyAccount from './screens/MyAccount';
import ChangeInfoMenu from './screens/account/ChangeInfoMenu';
import ChangePassword from './screens/account/ChangePassword';
import ChangeNameEmail from './screens/account/ChangeNameEmail';
import Plantation from './screens/plantations/Plantation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Criar Conta" component={CreateAccount} options={{ headerShown: false }} />
        <Stack.Screen name="Recuperar Senha" component={RecoverPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Minha Conta" component={MyAccount} options={{ headerShown: false }} />
        <Stack.Screen name="Menu de Alterar Dados da Conta" component={ChangeInfoMenu} options={{ headerShown: false }} />
        <Stack.Screen name="Alterar Senha" component={ChangePassword} options={{ headerShown: false }} />
        <Stack.Screen name="Alterar Nome ou Email" component={ChangeNameEmail} options={{ headerShown: false }} />
        <Stack.Screen name="Plantação" component={Plantation} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
