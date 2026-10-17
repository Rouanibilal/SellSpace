'use client';

import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { useAuth } from '@/components/auth-provider';
import { getStore, updateStore } from '@/lib/stores';

type ValidationErrors = Record<string, string[]>;

export default function EditStorePage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const storeId = Number(params.id);
    const isValidStoreId = Number.isSafeInteger(storeId) && storeId > 0;
    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [isLoadingStore, setIsLoadingStore] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (isLoading || !isSeller || !isValidStoreId) {
            return;
        }

        let active = true;

        getStore(storeId)
            .then((store) => {
                if (!active) return;

                setName(store.name);
                setSlug(store.slug);
                setDescription(store.description ?? '');
                setLoadError(null);
            })
            .catch((error: unknown) => {
                if (!active) return;

                if (isAxiosError(error) && error.response?.status === 403) {
                    setLoadError(
                        'You are not authorized to manage this store.',
                    );
                } else if (
                    isAxiosError(error) &&
                    error.response?.status === 404
                ) {
                    setLoadError('Store not found.');
                } else {
                    setLoadError(
                        'Unable to load this store. Please try again.',
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setIsLoadingStore(false);
                }
            });

        return () => {
            active = false;
        };
    }, [isLoading, isSeller, isValidStoreId, storeId]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrors({});
        setServerError(null);
        setIsSubmitting(true);

        try {
            await updateStore(storeId, {
                name: name.trim(),
                slug: slug.trim(),
                description: description.trim() || undefined,
            });

            router.push('/seller');
            router.refresh();
        } catch (error: unknown) {
            if (
                isAxiosError<{
                    message?: string;
                    errors?: ValidationErrors;
                }>(error)
            ) {
                setErrors(error.response?.data.errors ?? {});
                setServerError(
                    error.response?.data.errors
                        ? null
                        : error.response?.data.message ??
                        'Unable to update your store. Please try again.',
                );
            } else {
                setServerError('An unexpected error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <main className="mx-auto max-w-2xl px-4 py-12">
                <p role="status">Checking your session...</p>
            </main>
        );
    }

    if (!isValidStoreId) {
        return (
            <main className="mx-auto max-w-2xl space-y-4 px-4 py-12">
                <h1 className="text-3xl font-bold">Edit store</h1>
                <p role="alert">Invalid store ID.</p>
                <Link href="/seller" className="underline">
                    Back to dashboard
                </Link>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="mx-auto max-w-2xl space-y-4 px-4 py-12">
                <h1 className="text-3xl font-bold">Edit store</h1>
                <p>Please log in to continue.</p>
                <Link href="/login" className="underline">
                    Log in
                </Link>
            </main>
        );
    }

    if (!isSeller) {
        return (
            <main className="mx-auto max-w-2xl space-y-4 px-4 py-12">
                <h1 className="text-3xl font-bold">Edit store</h1>
                <p>You need seller access to manage a store.</p>
                <Link href="/" className="underline">
                    Return home
                </Link>
            </main>
        );
    }

    if (isLoadingStore) {
        return (
            <main className="mx-auto max-w-2xl px-4 py-12">
                <p role="status">Loading store...</p>
            </main>
        );
    }

    if (loadError) {
        return (
            <main className="mx-auto max-w-2xl space-y-4 px-4 py-12">
                <h1 className="text-3xl font-bold">Edit store</h1>
                <p role="alert" className="text-red-600">
                    {loadError}
                </p>
                <Link href="/seller" className="underline">
                    Back to dashboard
                </Link>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-2xl space-y-8 px-4 py-12">
            <header>
                <Link href="/seller" className="text-sm underline">
                    ← Back to dashboard
                </Link>

                <h1 className="mt-4 text-3xl font-bold">Edit your store</h1>
                <p className="mt-2 text-gray-600">
                    Update your store information.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-1 block text-sm font-medium"
                    >
                        Store name
                    </label>

                    <input
                        id="name"
                        name="name"
                        required
                        maxLength={255}
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            setErrors((current) => ({
                                ...current,
                                name: [],
                            }));
                            setServerError(null);
                        }}
                        aria-invalid={Boolean(errors.name?.length)}
                        className="w-full rounded-md border px-3 py-2"
                    />

                    {errors.name?.map((message) => (
                        <p key={message} className="mt-1 text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </div>

                <div>
                    <label
                        htmlFor="slug"
                        className="mb-1 block text-sm font-medium"
                    >
                        Store URL identifier
                    </label>

                    <input
                        id="slug"
                        name="slug"
                        required
                        maxLength={255}
                        pattern="[A-Za-z0-9_-]+"
                        value={slug}
                        onChange={(event) => {
                            setSlug(event.target.value);
                            setErrors((current) => ({
                                ...current,
                                slug: [],
                            }));
                            setServerError(null);
                        }}
                        aria-invalid={Boolean(errors.slug?.length)}
                        className="w-full rounded-md border px-3 py-2"
                    />

                    {errors.slug?.map((message) => (
                        <p key={message} className="mt-1 text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="mb-1 block text-sm font-medium"
                    >
                        Description (optional)
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        maxLength={5000}
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                            setErrors((current) => ({
                                ...current,
                                description: [],
                            }));
                            setServerError(null);
                        }}
                        aria-invalid={Boolean(errors.description?.length)}
                        className="w-full rounded-md border px-3 py-2"
                    />

                    {errors.description?.map((message) => (
                        <p key={message} className="mt-1 text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </div>

                {serverError && (
                    <p role="alert" className="text-sm text-red-600">
                        {serverError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-black px-5 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? 'Saving changes...' : 'Save changes'}
                </button>
            </form>
        </main>
    );
}