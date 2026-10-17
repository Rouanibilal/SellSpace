import { api } from './api';

export type Store = {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};

export type CreateStoreData = {
    name: string;
    slug: string;
    description?: string;
};

export type UpdateStoreData = Partial<CreateStoreData>;

type StoresResponse = {
    stores: Store[];
};

type StoreResponse = {
    message: string;
    store: Store;
};

export async function getStores(): Promise<Store[]> {
    const response = await api.get<StoresResponse>('/stores');

    return response.data.stores;
}

export async function createStore(data: CreateStoreData): Promise<Store> {
    const response = await api.post<StoreResponse>('/stores', data);

    return response.data.store;
}

export async function getStore(id: number): Promise<Store> {
    const response = await api.get<{ store: Store }>(`/stores/${id}`);

    return response.data.store;
}

export async function updateStore(
    id: number,
    data: UpdateStoreData,
): Promise<Store> {
    const response = await api.patch<StoreResponse>(`/stores/${id}`, data);

    return response.data.store;
}

export async function deleteStore(id: number): Promise<void> {
    await api.delete(`/stores/${id}`);
}