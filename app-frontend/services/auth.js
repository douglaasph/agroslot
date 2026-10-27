import { apiPost } from "./api";
import { clearSessionToken, setSessionToken } from "./session";

export async function logout() {
    await clearSessionToken();
}

export async function login({ email, password }) {
    const res = await apiPost('/auth/login', { email: email, password: password });

    if (!res.ok) {
        const data = await res.json();
        console.log("i tried")
        console.log(data)

        return { error: data.message || data.error, success: false }
    }

    const data = await res.json();

    await setSessionToken(data.accessToken);

    return { error: '', success: true }
}


export async function createAccount({ email, fullName, password }) {
    const res = await apiPost('/auth/register', { email: email, password: password, nome: fullName });

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}

export async function forgotPassword({ email }) {
    const res = await apiPost('/auth/forgot-password', { email: email });

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}