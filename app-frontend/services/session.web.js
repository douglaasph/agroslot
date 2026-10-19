const TOKEN_KEY = 'access-token';

export async function setSessionToken(token) {
    if (!token) {
        throw new Error('O accessToken não foi informado.');
    }

    sessionStorage.setItem(TOKEN_KEY, token);
}

export async function clearSessionToken() {
    sessionStorage.removeItem(TOKEN_KEY);
}

export async function getSessionToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}