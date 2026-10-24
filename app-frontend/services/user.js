import { apiFetch, apiPut } from "./api";

export async function changeUserPassword({ currentPassword, newPassword }) {
    const res = await apiPut('/user/password', { currentPassword: currentPassword, newPassword: newPassword });

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}

export async function getMe() {
    const res = await apiFetch('/user/me');

    if (!res.ok) {
        try {
            const data = await res.json();
            return { error: data.message || data.error, success: false }
        } catch {
            return { error: '', success: false }
        }
    }

    const user = await res.json();

    return { error: '', success: true, user: user }
}

export async function changeNameOrEmail({ nome, email }) {
    const res = await apiPut('/user', { nome, email });

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}