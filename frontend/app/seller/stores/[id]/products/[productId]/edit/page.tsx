'use client';

import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { useAuth } from '@/components/auth-provider';
import {
    getCategories,
    getProduct,
    updateProduct,
    type ProductCategory,
} from '@/lib/products';
import { getStore, type Store } from '@/lib/stores';

type ValidationErrors = Record<string, string[]>;

export default function EditProductPage() {
    const params = useParams<{ id: string; productId: string }>();
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const storeId = Number(params.id);
    const productId = Number(params.productId);

    const validIds =
        Number.isSafeInteger(storeId) &&
        storeId > 0 &&
        Number.isSafeInteger(productId) &&
        productId > 0;

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    const [store, setStore] = useState<Store | null>(null);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('MAD');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (isLoading || !user || !isSeller || !validIds) {
            return;
        }

        let active = true;

        async function loadData() {
            try {
                const [storeData, productData, categoryData] =
                    await Promise.all([
                        getStore(storeId),
                        getProduct(productId),
                        getCategories(),
                    ]);

                if (!active) return;

                if (productData.store_id !== storeData.id) {
                    setLoadError('This product does not belong to this store.');
                    return;
                }

                setStore(storeData);
                setCategories(categoryData);
                setName(productData.name);
                setSlug(productData.slug);
                setDescription(productData.description ?? '');
                setPrice(productData.price);
                setCurrency(productData.currency);
                setStatus(productData.status);
                setSelectedCategories(
                    productData.categories.map((category) => category.id),
                );
            } catch (error: unknown) {
                if (!active) return;

                if (isAxiosError(error) && error.response?.status === 403) {
                    setLoadError('You are not authorized to edit this product.');
                } else if (
                    isAxiosError(error) &&
                    error.response?.status === 404
                ) {
                    setLoadError('Store or product not found.');
                } else {
                    setLoadError('Unable to load product details.');
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
    }, [isLoading, user, isSeller, validIds, storeId, productId]);

    function clearFieldError(field: string) {
        setErrors((current) => ({ ...current, [field]: [] }));
        setServerError(null);
    }

    function toggleCategory(categoryId: number) {
        setSelectedCategories((current) =>
            current.includes(categoryId)
                ? current.filter((id) => id !== categoryId)
                : [...current, categoryId],
        );

        clearFieldError('categories');
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrors({});
        setServerError(null);
        setIsSubmitting(true);

        try {
            await updateProduct(productId, {
                name: name.trim(),
                slug: slug.trim(),
                description: description.trim() || null,
                price: Number(price),
                currency: currency.trim().toUpperCase(),
                status,
                categories: selectedCategories,
            });

            router.push(`/seller/stores/${storeId}/products`);
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
                        'Unable to update the product.',
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
            <main className="mx-auto max-w-3xl px-4 py-12">
                <p role="status">Checking your session...</p>
            </main>
        );
    }

    if (!validIds) {
        return (
            <main className="mx-auto max-w-3xl space-y-4 px-4 py-12">
                <h1 className="text-3xl font-bold">Edit product</h1>
                <p role="alert">Invalid store or product ID.</p>
                <Link href="/seller" className="underline">
                    Back to dashboard
                </Link>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="mx-auto max-w-3xl space-y-4 px-4 py-12">
                <h1 className="text-3xl font-bold">Edit product</h1>
                <p>Please log in to continue.</p>
                <Link href="/login" className="underline">
                    Log in
                </Link>
            </main>
        );
    }

    if (!isSeller) {
        return (
            <main className="mx-auto max-w-3xl space-y-4 px-4 py-12">
                <h1 className="text-3xl font-bold">Edit product</h1>
                <p>You need seller access to manage products.</p>
                <Link href="/" className="underline">
                    Return home
                </Link>
            </main>
        );
    }

    if (isLoadingData) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-12">
                <p role="status">Loading product...</p>
            </main>
        );
    }

    if (loadError) {
        return (
            <main className="mx-auto max-w-3xl space-y-4 px-4 py-12">
                <h1 className="text-3xl font-bold">Edit product</h1>
                <p role="alert" className="text-red-600">{loadError}</p>
                <Link
                    href={`/seller/stores/${storeId}/products`}
                    className="underline"
                >
                    Back to products
                </Link>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-3xl space-y-8 px-4 py-12">
            <header>
                <Link
                    href={`/seller/stores/${storeId}/products`}
                    className="text-sm underline"
                >
                    ← Back to products
                </Link>

                <h1 className="mt-4 text-3xl font-bold">Edit product</h1>
                <p className="mt-2 text-gray-600">
                    Update {name} in {store?.name}.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">
                        Product name
                    </label>
                    <input
                        id="name"
                        required
                        maxLength={255}
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            clearFieldError('name');
                        }}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    {errors.name?.map((message) => (
                        <p key={message} className="mt-1 text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </div>

                <div>
                    <label htmlFor="slug" className="mb-1 block text-sm font-medium">
                        URL identifier
                    </label>
                    <input
                        id="slug"
                        required
                        maxLength={255}
                        pattern="[A-Za-z0-9_-]+"
                        value={slug}
                        onChange={(event) => {
                            setSlug(event.target.value);
                            clearFieldError('slug');
                        }}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    {errors.slug?.map((message) => (
                        <p key={message} className="mt-1 text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </div>

                <div>
                    <label htmlFor="price" className="mb-1 block text-sm font-medium">
                        Price
                    </label>
                    <input
                        id="price"
                        type="number"
                        required
                        min="0"
                        max="9999999999.99"
                        step="0.01"
                        value={price}
                        onChange={(event) => {
                            setPrice(event.target.value);
                            clearFieldError('price');
                        }}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    {errors.price?.map((message) => (
                        <p key={message} className="mt-1 text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </div>

                <div>
                    <label htmlFor="currency" className="mb-1 block text-sm font-medium">
                        Currency
                    </label>
                    <input
                        id="currency"
                        required
                        minLength={3}
                        maxLength={3}
                        pattern="[A-Za-z]{3}"
                        value={currency}
                        onChange={(event) => {
                            setCurrency(event.target.value);
                            clearFieldError('currency');
                        }}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    {errors.currency?.map((message) => (
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
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        maxLength={5000}
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                            clearFieldError('description');
                        }}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    {errors.description?.map((message) => (
                        <p key={message} className="mt-1 text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </div>

                <div>
                    <label htmlFor="status" className="mb-1 block text-sm font-medium">
                        Status
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(event) => {
                            setStatus(event.target.value as 'draft' | 'published');
                            clearFieldError('status');
                        }}
                        className="w-full rounded-md border px-3 py-2"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <fieldset className="space-y-3">
                    <legend className="text-sm font-medium">Categories</legend>
                    {categories.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No categories are available.
                        </p>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-2 rounded-md border p-3"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                    />
                                    <span>{category.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    {errors.categories?.map((message) => (
                        <p key={message} className="text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                    {errors['categories.0']?.map((message) => (
                        <p key={message} className="text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </fieldset>

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