import { apiPut } from "./api";

export async function changeUserPassword({ currentPassword, newPassword }) {
    const res = await apiPut('/user/password', { currentPassword: currentPassword, newPassword: newPassword });

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}