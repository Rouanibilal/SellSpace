'use client';

import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useAuth } from '@/components/auth-provider';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';

import { marketplaceCategories } from '@/data/mock-marketplace';
import type { RegisterData } from '@/lib/auth';

type ValidationErrors = Record<string, string[]>;
type AccountType = 'customer' | 'seller';

const inputClassName =
    'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/10';

function AccountIcon({ type }: { type: AccountType }) {
    if (type === 'customer') {
        return (
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-6"
            >
                <path
                    d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.5L21 8H6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="10" cy="20" r="1" fill="currentColor" />
                <circle cx="18" cy="20" r="1" fill="currentColor" />
            </svg>
        );
    }

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-6"
        >
            <path
                d="M3 10h18v10H3V10ZM2 10l2-6h16l2 6M8 10v10m8-10v10"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function RegisterPage() {
    const router = useRouter();
    const { user, isLoading, signUp, becomeSeller, signOut } = useAuth();

    const [accountType, setAccountType] = useState<AccountType>('customer');

    const [form, setForm] = useState<RegisterData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [navigationError, setNavigationError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    function handleBrowseProducts() {
        router.push('/marketplace');
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

    function handleChange(field: keyof RegisterData, value: string) {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: [] }));
        setServerError(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrors({});
        setServerError(null);
        setIsSubmitting(true);

        let accountCreated = false;

        try {
            await signUp(form);
            accountCreated = true;

            if (accountType === 'seller') {
                await becomeSeller();
            }

            router.push('/');
            router.refresh();
        } catch (error: unknown) {
            if (accountCreated && accountType === 'seller') {
                setServerError(
                    'Your account was created, but seller setup could not be completed. You are still signed in.',
                );
            } else if (
                isAxiosError<{
                    message?: string;
                    errors?: ValidationErrors;
                }>(error)
            ) {
                setErrors(error.response?.data.errors ?? {});
                setServerError(
                    error.response?.data.message ??
                    'Unable to create your account. Check your connection and try again.',
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
                search=""
                onSearchChange={() => {}}
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
                        <Link href="/" className="transition hover:text-accent">
                            Home
                        </Link>

                        <span className="mx-2" aria-hidden="true">
                            /
                        </span>

                        <span className="font-medium text-foreground">
                            Create account
                        </span>
                    </nav>

                    <p className="mt-6 text-sm font-semibold text-accent">
                        Become part of SellSpace
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Create your account
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Discover products from independent stores or start
                        selling. Choose the experience that suits you.
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
                    <div className="rounded-2xl border border-border bg-surface-muted p-6 sm:p-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 sm:text-sm">
                            <span
                                aria-hidden="true"
                                className="size-2 rounded-full bg-blue-600"
                            />
                            One marketplace, many possibilities
                        </div>

                        <h2 className="mt-7 text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
                            Find your next
                            <span className="block text-accent">
                                favourite thing.
                            </span>
                        </h2>

                        <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                            SellSpace brings shoppers and independent stores
                            together in one place. Create your account to get
                            started.
                        </p>

                        <div className="mt-8 space-y-5 border-t border-border pt-6">
                            <div className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent">
                                    <AccountIcon type="customer" />
                                </span>

                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Discover as a customer
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Browse products, explore stores, and
                                        find items that fit your life.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent">
                                    <AccountIcon type="seller" />
                                </span>

                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Grow as a seller
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Create your account and enable seller
                                        access to start your selling journey.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
                        <p className="text-sm leading-6 text-muted-foreground">
                            Already part of SellSpace?
                        </p>

                        <Link
                            href="/login"
                            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent-hover"
                        >
                            Log in to your account
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
                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
                        <header>
                            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                                Your details
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Select an account type, then complete the form.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            <fieldset>
                                <legend className="mb-3 text-sm font-semibold">
                                    I want to join as a
                                </legend>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {(
                                        [
                                            {
                                                type: 'customer',
                                                title: 'Customer',
                                                description:
                                                    'Discover products and shop from stores.',
                                            },
                                            {
                                                type: 'seller',
                                                title: 'Seller',
                                                description:
                                                    'Create an account and enable selling.',
                                            },
                                        ] as const
                                    ).map((option) => {
                                        const selected =
                                            accountType === option.type;

                                        return (
                                            <button
                                                key={option.type}
                                                type="button"
                                                disabled={isSubmitting}
                                                aria-pressed={selected}
                                                onClick={() => {
                                                    setAccountType(option.type);
                                                    setServerError(null);
                                                }}
                                                className={`rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${
                                                    selected
                                                        ? 'border-accent bg-blue-50 ring-1 ring-accent dark:bg-blue-50/50'
                                                        : 'border-border bg-surface hover:border-accent hover:bg-surface-muted'
                                                }`}
                                            >
                                                <span className="flex items-center justify-between gap-3">
                                                    <span
                                                        className={`flex size-10 items-center justify-center rounded-xl ${
                                                            selected
                                                                ? 'bg-accent text-white'
                                                                : 'bg-surface-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        <AccountIcon
                                                            type={option.type}
                                                        />
                                                    </span>

                                                    <span
                                                        aria-hidden="true"
                                                        className={`flex size-5 items-center justify-center rounded-full border ${
                                                            selected
                                                                ? 'border-accent bg-accent text-white'
                                                                : 'border-border text-transparent'
                                                        }`}
                                                    >
                                                        <svg
                                                            viewBox="0 0 16 16"
                                                            fill="none"
                                                            className="size-3"
                                                        >
                                                            <path
                                                                d="m3.5 8 3 3 6-6"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>
                                                </span>

                                                <span className="mt-4 block text-sm font-semibold text-foreground">
                                                    {option.title}
                                                </span>

                                                <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                                                    {option.description}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </fieldset>

                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    required
                                    maxLength={255}
                                    value={form.name}
                                    onChange={(event) =>
                                        handleChange('name', event.target.value)
                                    }
                                    aria-invalid={Boolean(errors.name?.length)}
                                    className={inputClassName}
                                />

                                {errors.name?.map((message) => (
                                    <p
                                        key={message}
                                        className="mt-1 text-sm text-error"
                                    >
                                        {message}
                                    </p>
                                ))}
                            </div>

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
                                    onChange={(event) =>
                                        handleChange('email', event.target.value)
                                    }
                                    aria-invalid={Boolean(errors.email?.length)}
                                    className={inputClassName}
                                />

                                {errors.email?.map((message) => (
                                    <p
                                        key={message}
                                        className="mt-1 text-sm text-error"
                                    >
                                        {message}
                                    </p>
                                ))}
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
                                    autoComplete="new-password"
                                    placeholder="At least 8 characters"
                                    required
                                    minLength={8}
                                    value={form.password}
                                    onChange={(event) =>
                                        handleChange('password', event.target.value)
                                    }
                                    aria-invalid={Boolean(
                                        errors.password?.length,
                                    )}
                                    className={inputClassName}
                                />

                                {errors.password?.map((message) => (
                                    <p
                                        key={message}
                                        className="mt-1 text-sm text-error"
                                    >
                                        {message}
                                    </p>
                                ))}
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Confirm password
                                </label>

                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Enter your password again"
                                    required
                                    minLength={8}
                                    value={form.password_confirmation}
                                    onChange={(event) =>
                                        handleChange(
                                            'password_confirmation',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={Boolean(
                                        errors.password_confirmation?.length,
                                    )}
                                    className={inputClassName}
                                />

                                {errors.password_confirmation?.map((message) => (
                                    <p
                                        key={message}
                                        className="mt-1 text-sm text-error"
                                    >
                                        {message}
                                    </p>
                                ))}
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
                                {isSubmitting
                                    ? 'Creating account…'
                                    : accountType === 'seller'
                                        ? 'Create seller account'
                                        : 'Create customer account'}

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

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            By creating an account, you agree to use SellSpace
                            responsibly.
                        </p>
                    </section>
                </div>
            </section>

            <MarketplaceFooter />
        </main>
    );
}