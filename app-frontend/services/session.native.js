
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access-token';

export async function setSessionToken(token) {
    if (!token) {
        throw new Error('O accessToken não foi informado.');
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearSessionToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getSessionToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}
