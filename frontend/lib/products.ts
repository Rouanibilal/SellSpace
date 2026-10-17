import { api } from './api';

export type ProductCategory = {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string | null;
};

export type Product = {
    id: number;
    store_id: number;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    currency: string;
    status: 'draft' | 'published';
    categories: ProductCategory[];
    created_at: string;
    updated_at: string;
};

export type CreateProductData = {
    name: string;
    slug: string;
    description?: string;
    price: number;
    currency?: string;
    status?: 'draft' | 'published';
    categories?: number[];
};

export type UpdateProductData = {
    name?: string;
    slug?: string;
    description?: string | null;
    price?: number;
    currency?: string;
    status?: 'draft' | 'published';
    categories?: number[];
};

type ProductsResponse = {
    products: Product[];
};

type ProductResponse = {
    message: string;
    product: Product;
};

type CategoriesResponse = {
    categories: ProductCategory[];
};


export async function getProducts(storeId: number): Promise<Product[]> {
    const response = await api.get<ProductsResponse>(
        `/stores/${storeId}/products`,
    );

    return response.data.products;
}

export async function createProduct(
    storeId: number,
    data: CreateProductData,
): Promise<Product> {
    const response = await api.post<ProductResponse>(
        `/stores/${storeId}/products`,
        data,
    );

    return response.data.product;
}

export async function getProduct(id: number): Promise<Product> {
    const response = await api.get<{ product: Product }>(
        `/products/${id}`,
    );

    return response.data.product;
}

export async function updateProduct(
    id: number,
    data: UpdateProductData,
): Promise<Product> {
    const response = await api.patch<ProductResponse>(
        `/products/${id}`,
        data,
    );

    return response.data.product;
}

export async function deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
}

export async function getCategories(): Promise<ProductCategory[]> {
    const response = await api.get<CategoriesResponse>('/categories');

    return response.data.categories;
}