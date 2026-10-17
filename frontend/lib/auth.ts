import { api, initializeCsrf } from './api';

export type Role = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
};

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: Role[];
};

type AuthResponse = {
    message: string;
    user: User;
};

export type RegisterData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type LoginData = {
    email: string;
    password: string;
};

export async function register(data: RegisterData): Promise<User> {
    await initializeCsrf();

    const response = await api.post<AuthResponse>('/register', data);

    return response.data.user;
}

export async function login(data: LoginData): Promise<User> {
    await initializeCsrf();

    const response = await api.post<AuthResponse>('/login', data);

    return response.data.user;
}

export async function logout(): Promise<void> {
    await api.post('/logout');
}

export async function getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/user');

    return response.data;
}

export async function onboardAsSeller(): Promise<User> {
    await initializeCsrf();

    const response = await api.post<AuthResponse>('/seller-onboarding');

    return response.data.user;
}