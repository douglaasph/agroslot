import { getSessionToken } from './session';
import { fetch as expoFetch } from 'expo/fetch';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

async function request(path, options = {}) {
    const token = await getSessionToken();
    const headers = new Headers(options.headers || {});

    const isFormData = options.body instanceof FormData;

    if (isFormData) {
        headers.delete('Content-Type');
    } else if (options.body !== undefined && options.body !== null) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token.trim()}`);
    }

    const config = {
        ...options,
        headers,
        cache: 'no-store',
    };

    const fetchFunction = isFormData ? expoFetch : fetch;

    const response = await fetchFunction(`${API_URL}${path}`, config);

    return response;
}

export const apiFetch = (path, init = {}) => request(path, init);

export const apiPost = (path, data, init = {}) =>
    request(path, { ...init, method: 'POST', body: JSON.stringify(data) });

export const apiPostFormData = (path, formData, init = {}) =>
    request(path, {
        ...init,
        method: 'POST',
        body: formData
    });

export const apiPut = (path, data, init = {}) =>
    request(path, { ...init, method: 'PUT', body: JSON.stringify(data) });

export const apiPatch = (path, data, init = {}) =>
    request(path, { ...init, method: 'PATCH', body: JSON.stringify(data) });

export const apiDelete = (path, init = {}) =>
    request(path, { ...init, method: 'DELETE' });