import { File } from "expo-file-system";
import { apiFetch, apiPostFormData } from "./api";

export async function getHistoryByPlantId({ plantId }) {
    const res = await apiFetch(`/planthistory/${plantId}`);

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    const data = await res.json();

    return { error: '', success: true, history: data }
}

export async function sendImageForDiagnosis({ plantId, image }) {
    const formData = new FormData();

    const file = new File(image.uri);

    formData.append('file', file);

    const res = await apiPostFormData(`/planthistory/${plantId}`, formData);

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}