import axios from 'axios';

const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

export const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

export async function initializeCsrf(): Promise<void> {
    await axios.get(`${backendBaseUrl}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
}