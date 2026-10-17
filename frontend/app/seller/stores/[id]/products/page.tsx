'use client';

import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/components/auth-provider';
import { deleteProduct, getProducts, type Product } from '@/lib/products';
import { getStore, type Store } from '@/lib/stores';

export default function StoreProductsPage() {
    const params = useParams<{ id: string }>();
    const { user, isLoading } = useAuth();

    const storeId = Number(params.id);
    const isValidStoreId = Number.isSafeInteger(storeId) && storeId > 0;
    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        if (isLoading || !user || !isSeller || !isValidStoreId) {
            return;
        }

        let active = true;

        async function loadData() {
            setIsLoadingData(true);
            setError(null);

            try {
                const [storeData, productData] = await Promise.all([
                    getStore(storeId),
                    getProducts(storeId),
                ]);

                if (!active) return;

                setStore(storeData);
                setProducts(productData);
            } catch (err: unknown) {
                if (!active) return;

                if (isAxiosError(err) && err.response?.status === 403) {
                    setError('You are not authorized to manage this store.');
                } else if (
                    isAxiosError(err) &&
                    err.response?.status === 404
                ) {
                    setError('Store not found.');
                } else {
                    setError('Unable to load products. Please try again.');
                }
            } finally {
                if (active) {
                    setIsLoadingData(false);
                }
            }
        }

        void loadData();

        return () => {
            active = false;
        };
    }, [isLoading, user, isSeller, isValidStoreId, storeId]);

    async function handleDelete(product: Product) {
        if (
            !window.confirm(
                `Delete "${product.name}"? This action cannot be undone.`,
            )
        ) {
            return;
        }

        setDeletingId(product.id);
        setError(null);

        try {
            await deleteProduct(product.id);

            setProducts((current) =>
                current.filter((item) => item.id !== product.id),
            );
        } catch {
            setError('Unable to delete this product. Please try again.');
        } finally {
            setDeletingId(null);
        }
    }

    if (isLoading) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-12">
            <p role="status">Checking your session...</p>
        </main>
    );
    }

    if (!user) {
        return (
            <main className="mx-auto max-w-5xl space-y-4 px-4 py-12">
            <h1 className="text-3xl font-bold">Store products</h1>
        <p>Please log in to continue.</p>
        <Link href="/login" className="underline">
            Log in
            </Link>
            </main>
    );
    }

    if (!isSeller) {
        return (
            <main className="mx-auto max-w-5xl space-y-4 px-4 py-12">
            <h1 className="text-3xl font-bold">Store products</h1>
        <p>You need seller access to manage products.</p>
        <Link href="/" className="underline">
            Return home
        </Link>
        </main>
    );
    }

    if (!isValidStoreId) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-12">
            <p role="alert">Invalid store ID.</p>
        </main>
    );
    }

    return (
        <main className="mx-auto max-w-5xl space-y-8 px-4 py-12">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
            <Link href="/seller" className="text-sm underline">
                        ← Back to dashboard
    </Link>

    <h1 className="mt-4 text-3xl font-bold">
        {store?.name ?? 'Store products'}
    </h1>

    <p className="mt-2 text-gray-600">
        Manage the products in this store.
    </p>
    </div>

    <Link
    href={`/seller/stores/${storeId}/products/create`}
    className="inline-flex w-fit rounded-md bg-black px-5 py-2 font-medium text-white"
        >
        Add product
    </Link>
    </header>

    {isLoadingData ? (
        <p role="status" className="text-gray-600">
        Loading products...
        </p>
    ) : error ? (
        <p role="alert" className="text-red-600">
        {error}
        </p>
    ) : products.length === 0 ? (
        <section className="space-y-3 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">
            No products yet
    </h2>
    <p className="text-gray-600">
        Add your first product to this store.
    </p>
    </section>
    ) : (
        <section className="grid gap-4 sm:grid-cols-2">
            {products.map((product) => (
                    <article
                        key={product.id}
                className="space-y-3 rounded-lg border p-5"
                >
                <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">
                    {product.name}
                    </h2>

                    <span className="rounded-full border px-3 py-1 text-xs capitalize">
                    {product.status}
                    </span>
                    </div>

                    <p className="text-sm text-gray-500">
                    {product.slug}
                    </p>

                    <p className="text-lg font-medium">
                    {product.price} {product.currency}
        </p>

        <p className="text-sm text-gray-600">
        {product.description ||
                'No description provided.'}
        </p>

        {product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                        <span
                            key={category.id}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                        >
                        {category.name}
                        </span>
        ))}
            </div>
        )}

        <button
            type="button"
        onClick={() => handleDelete(product)}
        disabled={deletingId === product.id}
        className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-60"
        >
        {deletingId === product.id
            ? 'Deleting...'
            : 'Delete product'}
        </button>

        <Link
            href={`/seller/stores/${storeId}/products/${product.id}/edit`}
            className="inline-flex rounded-md border px-4 py-2 text-sm font-medium"
        >
            Edit product
        </Link>
        </article>
    ))}
        </section>
    )}
    </main>
);
}