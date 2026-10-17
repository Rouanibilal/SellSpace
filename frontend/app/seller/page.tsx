'use client';

import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useAuth } from '@/components/auth-provider';
import {
    deleteStore,
    getStores,
    type Store,
} from '@/lib/stores';
export default function SellerDashboardPage() {
    const { user, isLoading } = useAuth();

    const [stores, setStores] = useState<Store[]>([]);
    const [isLoadingStores, setIsLoadingStores] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deletingStoreId, setDeletingStoreId] = useState<number | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    async function handleDeleteStore(store: Store) {
        const confirmed = window.confirm(
            `Delete "${store.name}"? This action cannot be undone.`,
        );

        if (!confirmed) return;

        setDeletingStoreId(store.id);
        setActionError(null);

        try {
            await deleteStore(store.id);
            setStores((current) =>
                current.filter((item) => item.id !== store.id),
            );
        } catch {
            setActionError(
                'Unable to delete this store. Please try again.',
            );
        } finally {
            setDeletingStoreId(null);
        }
    }

    useEffect(() => {
        if (isLoading || !isSeller) {
            return;
        }

        let active = true;

        getStores()
            .then((result) => {
                if (!active) return;

                setStores(result);
                setError(null);
            })
            .catch((err: unknown) => {
                if (!active) return;

                if (isAxiosError(err) && err.response?.status === 403) {
                    setError('You are not authorized to manage these stores.');
                } else {
                    setError('Unable to load your stores. Please try again.');
                }
            })
            .finally(() => {
                if (active) {
                    setIsLoadingStores(false);
                }
            });

        return () => {
            active = false;
        };
    }, [isLoading, isSeller]);

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
                <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                <p>Please log in to access your seller dashboard.</p>
                <Link className="underline" href="/login">
                    Log in
                </Link>
            </main>
        );
    }

    if (!isSeller) {
        return (
            <main className="mx-auto max-w-5xl space-y-4 px-4 py-12">
                <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                <p>You need seller access to manage a store.</p>
                <Link className="underline" href="/">
                    Return home to become a seller
                </Link>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl space-y-8 px-4 py-12">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        Welcome, {user.name}. Manage your SellSpace stores here.
                    </p>
                </div>

                <Link
                    href="/seller/stores/create"
                    className="inline-flex w-fit rounded-md bg-black px-5 py-2 font-medium text-white"
                >
                    Create a store
                </Link>
            </header>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Your stores</h2>

                {isLoadingStores ? (
                    <p role="status" className="text-gray-600">
                        Loading your stores...
                    </p>
                ) : error ? (
                    <p role="alert" className="text-red-600">
                        {error}
                    </p>
                ) : stores.length === 0 ? (
                    <div className="rounded-lg border p-6">
                        <h3 className="font-semibold">
                            You haven&apos;t created a store yet
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Create your first store to start building your
                            presence on SellSpace.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {stores.map((store) => (
                            <article
                                key={store.id}
                                className="space-y-3 rounded-lg border p-5"
                            >
                                <h3 className="text-lg font-semibold">
                                    {store.name}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    /{store.slug}
                                </p>

                                <p className="text-gray-600">
                                    {store.description ||
                                        'No description provided.'}
                                </p>

                                <div className="flex items-center gap-3 pt-2">
                                    <Link
                                        href={`/seller/stores/${store.id}/edit`}
                                        className="rounded-md border px-4 py-2 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteStore(store)}
                                        disabled={deletingStoreId === store.id}
                                        className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-60"
                                    >
                                        {deletingStoreId === store.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                                {actionError && (
                                    <p role="alert" className="text-sm text-red-600">
                                        {actionError}
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}