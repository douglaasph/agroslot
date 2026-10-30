import { apiDelete, apiFetch, apiPost, apiPut } from "./api";

export async function createPlantation({ nome, colunas, linhas }) {
    const res = await apiPost('/plantation',{ 
        nome, 
        colunas, 
        linhas
    });

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}

export async function getPlantations() {
    const res = await apiFetch('/plantation');

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    const data = await res.json();

    return { error: '', success: true, plantations: data }
}

export async function getPlantation({ plantationId }) {
    const res = await apiFetch(`/plantation/${plantationId}`);

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    const data = await res.json();

    return { error: '', success: true, plantation: data }
}

export async function editPlantation({ nome, linhas, colunas, plantationId }) {
    const res = await apiPut(`/plantation/${plantationId}`,{ 
        nome, 
        linhas, 
        colunas});

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}

export async function deletePlantation({ plantationId }) {
    const res = await apiDelete(`/plantation/${plantationId}`);

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}