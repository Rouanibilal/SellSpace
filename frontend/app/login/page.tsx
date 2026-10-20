'use client';

import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useAuth } from '@/components/auth-provider';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';

import { marketplaceCategories } from '@/data/mock-marketplace';
import type { LoginData } from '@/lib/auth';

const inputClassName =
    'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/10';

export default function LoginPage() {
    const router = useRouter();
    const { user, isLoading, signIn, signOut } = useAuth();

    const [form, setForm] = useState<LoginData>({
        email: '',
        password: '',
    });

    const [emailError, setEmailError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [navigationError, setNavigationError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [search, setSearch] = useState('');

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    function handleBrowseProducts() {
        const term = search.trim();

        router.push(
            term
                ? `/marketplace?search=${encodeURIComponent(term)}`
                : '/marketplace',
        );
    }

    function handleSelectCategory(category: string) {
        const query =
            category === 'All products'
                ? ''
                : `?category=${encodeURIComponent(category)}`;

        router.push(`/marketplace${query}`);
    }

    async function handleSignOut() {
        setNavigationError(null);
        setIsSigningOut(true);

        try {
            await signOut();
            router.refresh();
        } catch {
            setNavigationError('Unable to log out. Please try again.');
        } finally {
            setIsSigningOut(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setEmailError(null);
        setServerError(null);
        setIsSubmitting(true);

        try {
            await signIn(form);

            router.push('/');
            router.refresh();
        } catch (error: unknown) {
            if (
                isAxiosError<{
                    message?: string;
                    errors?: Record<string, string[]>;
                }>(error)
            ) {
                const errors = error.response?.data.errors;

                setEmailError(errors?.email?.[0] ?? null);
                setServerError(
                    errors
                        ? null
                        : error.response?.data.message ??
                        'Unable to log in. Check your connection and try again.',
                );
            } else {
                setServerError(
                    'An unexpected error occurred. Please try again.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <MarketplaceHeader
                categories={marketplaceCategories}
                selectedCategory="All products"
                onSelectCategory={handleSelectCategory}
                search={search}
                onSearchChange={setSearch}
                onBrowseProducts={handleBrowseProducts}
                user={user}
                isLoading={isLoading}
                isSeller={isSeller}
                isSigningOut={isSigningOut}
                onSignOut={() => void handleSignOut()}
            />

            <section className="border-b border-border bg-surface">
                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                    <nav
                        aria-label="Breadcrumb"
                        className="text-sm text-muted-foreground"
                    >
                        <Link
                            href="/"
                            className="transition hover:text-accent"
                        >
                            Home
                        </Link>

                        <span className="mx-2" aria-hidden="true">
                            /
                        </span>

                        <span className="font-medium text-foreground">
                            Log in
                        </span>
                    </nav>

                    <p className="mt-6 text-sm font-semibold text-accent">
                        Welcome back to SellSpace
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Good to see you again.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Log in to your account and pick up where you left off.
                    </p>
                </div>
            </section>

            {navigationError && (
                <p
                    role="alert"
                    className="mx-auto max-w-[1408px] px-4 pt-4 text-sm text-error sm:px-6 lg:px-8"
                >
                    {navigationError}
                </p>
            )}

            <section className="mx-auto grid max-w-[1440px] items-start gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-12 lg:gap-10 lg:px-8">
                <aside className="lg:col-span-5">
                    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted p-6 sm:p-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 sm:text-sm">
                            <span
                                aria-hidden="true"
                                className="size-2 rounded-full bg-blue-600"
                            />
                            One marketplace, many discoveries
                        </div>

                        <h2 className="mt-7 text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
                            Your next
                            <span className="block text-accent">
                                favourite thing.
                            </span>
                            Is waiting.
                        </h2>

                        <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                            From independent stores to products worth
                            discovering, return to a marketplace made for
                            finding something new.
                        </p>

                        <div className="mt-8 space-y-5 border-t border-border pt-6">
                            <div className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent">
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="size-5"
                                    >
                                        <path
                                            d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.5L21 8H6"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <circle
                                            cx="10"
                                            cy="20"
                                            r="1"
                                            fill="currentColor"
                                        />
                                        <circle
                                            cx="18"
                                            cy="20"
                                            r="1"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </span>

                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Keep exploring
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Browse products and find new favourites
                                        across different categories.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent">
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="size-5"
                                    >
                                        <path
                                            d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>

                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Find stores you love
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Discover independent stores and explore
                                        their collections.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/marketplace"
                            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
                        >
                            Explore the marketplace
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="size-4"
                            >
                                <path
                                    d="M4 10h12m-5-5 5 5-5 5"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                    </div>
                </aside>

                <div className="lg:col-span-7">
                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8 lg:p-9">
                        <header>
                            <p className="text-sm font-semibold text-accent">
                                Your account
                            </p>

                            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                Log in to SellSpace
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Enter your account details to continue.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    required
                                    maxLength={255}
                                    value={form.email}
                                    onChange={(event) => {
                                        setForm((current) => ({
                                            ...current,
                                            email: event.target.value,
                                        }));

                                        setEmailError(null);
                                        setServerError(null);
                                    }}
                                    aria-invalid={Boolean(emailError)}
                                    aria-describedby={
                                        emailError ? 'email-error' : undefined
                                    }
                                    className={inputClassName}
                                />

                                {emailError && (
                                    <p
                                        id="email-error"
                                        className="mt-2 text-sm text-error"
                                    >
                                        {emailError}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    required
                                    value={form.password}
                                    onChange={(event) => {
                                        setForm((current) => ({
                                            ...current,
                                            password: event.target.value,
                                        }));

                                        setServerError(null);
                                    }}
                                    className={inputClassName}
                                />
                            </div>

                            {serverError && (
                                <p
                                    role="alert"
                                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                                >
                                    {serverError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? 'Logging in…' : 'Log in'}

                                {!isSubmitting && (
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        className="size-4"
                                    >
                                        <path
                                            d="M4 10h12m-5-5 5 5-5 5"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </button>
                        </form>

                        <div className="my-6 border-t border-border" />

                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/register"
                                className="font-semibold text-accent transition hover:text-accent-hover"
                            >
                                Create an account
                            </Link>
                        </p>
                    </section>
                </div>
            </section>

            <MarketplaceFooter />
        </main>
    );
}