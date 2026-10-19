'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth-provider';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';

import { marketplaceCategories } from '@/data/mock-marketplace';

function formatMemberSince(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    return new Intl.DateTimeFormat('en', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(date);
}

export default function CustomerAccount() {
    const router = useRouter();

    const { user, isLoading, signOut } = useAuth();

    const [search, setSearch] = useState('');
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    function browseProducts() {
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
        setMessage(null);
        setIsSigningOut(true);

        try {
            await signOut();
            router.push('/');
        } catch {
            setMessage('Unable to log out. Please try again.');
        } finally {
            setIsSigningOut(false);
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
                onBrowseProducts={browseProducts}
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
                        <Link href="/" className="hover:text-accent">
                            Home
                        </Link>

                        <span className="mx-2" aria-hidden="true">
                            /
                        </span>

                        <span className="font-medium text-foreground">
                            My account
                        </span>
                    </nav>

                    <p className="mt-6 text-sm font-semibold text-accent">
                        Your SellSpace account
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        My account
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Manage your account information and return to
                        shopping whenever you are ready.
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {message && (
                    <p
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {message}
                    </p>
                )}

                {isLoading ? (
                    <div
                        role="status"
                        className="animate-pulse space-y-5"
                    >
                        <div className="h-36 rounded-2xl bg-surface-muted" />

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="h-56 rounded-2xl bg-surface-muted" />
                            <div className="h-56 rounded-2xl bg-surface-muted" />
                        </div>

                        <span className="sr-only">
                            Loading account information…
                        </span>
                    </div>
                ) : !user ? (
                    <section className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-7 text-center sm:p-12">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-accent">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-8"
                            >
                                <circle
                                    cx="12"
                                    cy="8"
                                    r="4"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />
                                <path
                                    d="M4 21a8 8 0 0 1 16 0"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            Sign in to your account
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Sign in to view your account information and
                            access your customer shopping experience.
                        </p>

                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Link
                                href="/login"
                                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/register"
                                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:border-accent hover:bg-surface-muted"
                            >
                                Create an account
                            </Link>
                        </div>
                    </section>
                ) : (
                    <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
                        <aside className="overflow-hidden rounded-2xl border border-border bg-surface">
                            <div className="bg-surface-muted p-5 sm:p-6">
                                <div className="flex size-16 items-center justify-center rounded-2xl bg-accent text-2xl font-bold text-white">
                                    {user.name
                                        .trim()
                                        .split(/\s+/)
                                        .slice(0, 2)
                                        .map((part) => part.charAt(0))
                                        .join('')
                                        .toUpperCase()}
                                </div>

                                <h2 className="mt-4 break-words text-xl font-bold">
                                    {user.name}
                                </h2>

                                <p className="mt-1 break-all text-sm text-muted-foreground">
                                    {user.email}
                                </p>

                                <span className="mt-3 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground">
                                    {isSeller
                                        ? 'Customer & seller'
                                        : 'Customer account'}
                                </span>
                            </div>

                            <nav
                                aria-label="Account navigation"
                                className="p-3"
                            >
                                <Link
                                    href="/account"
                                    aria-current="page"
                                    className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-accent"
                                >
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="size-5"
                                    >
                                        <circle
                                            cx="12"
                                            cy="8"
                                            r="4"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                        <path
                                            d="M4 21a8 8 0 0 1 16 0"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    Account overview
                                </Link>

                                <Link
                                    href="/marketplace"
                                    className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
                                >
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="size-5"
                                    >
                                        <path
                                            d="M4 5h16v14H4zM8 9h8M8 13h5"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Browse products
                                </Link>

                                <Link
                                    href="/stores"
                                    className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
                                >
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="size-5"
                                    >
                                        <path
                                            d="M3 10h18l-2-6H5l-2 6Zm2 0v10h14V10M9 20v-6h6v6"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Discover stores
                                </Link>

                                <Link
                                    href="/cart"
                                    className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
                                >
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
                                    Shopping cart
                                </Link>

                                {isSeller && (
                                    <Link
                                        href="/seller"
                                        className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="size-5"
                                        >
                                            <path
                                                d="M4 20V9l8-5 8 5v11M9 20v-6h6v6"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Seller dashboard
                                    </Link>
                                )}

                                <div className="my-3 border-t border-border" />

                                <button
                                    type="button"
                                    onClick={() => void handleSignOut()}
                                    disabled={isSigningOut}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="size-5"
                                    >
                                        <path
                                            d="M10 17l5-5-5-5M15 12H3m9-8h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    {isSigningOut
                                        ? 'Logging out…'
                                        : 'Log out'}
                                </button>
                            </nav>
                        </aside>

                        <div className="min-w-0 space-y-6">
                            <section className="overflow-hidden rounded-2xl border border-border bg-surface">
                                <div className="bg-accent px-5 py-6 text-white sm:px-8 sm:py-8">
                                    <p className="text-sm font-medium text-white/80">
                                        Your personal space
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                        Welcome back, {user.name.split(' ')[0]}!
                                    </h2>

                                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">
                                        Explore the marketplace, discover
                                        independent stores, and find your
                                        next favourite product.
                                    </p>

                                    <Link
                                        href="/marketplace"
                                        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-accent transition hover:bg-blue-50"
                                    >
                                        Start shopping
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </section>

                            <section
                                aria-labelledby="account-details-heading"
                                className="rounded-2xl border border-border bg-surface p-5 sm:p-8"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h2
                                            id="account-details-heading"
                                            className="text-xl font-bold"
                                        >
                                            Account information
                                        </h2>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Your current account details.
                                        </p>
                                    </div>

                                    <span className="rounded-lg border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                                        Read-only preview
                                    </span>
                                </div>

                                <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <div className="min-w-0 rounded-xl border border-border p-4">
                                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Full name
                                        </dt>

                                        <dd className="mt-2 break-words text-sm font-semibold">
                                            {user.name}
                                        </dd>
                                    </div>

                                    <div className="min-w-0 rounded-xl border border-border p-4">
                                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Email address
                                        </dt>

                                        <dd className="mt-2 break-all text-sm font-semibold">
                                            {user.email}
                                        </dd>

                                        <p
                                            className={`mt-2 text-xs font-medium ${
                                                user.email_verified_at
                                                    ? 'text-emerald-700'
                                                    : 'text-amber-700'
                                            }`}
                                        >
                                            {user.email_verified_at
                                                ? 'Email verified'
                                                : 'Email not verified'}
                                        </p>
                                    </div>

                                    <div className="min-w-0 rounded-xl border border-border p-4">
                                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Member since
                                        </dt>

                                        <dd className="mt-2 text-sm font-semibold">
                                            {formatMemberSince(user.created_at)}
                                        </dd>
                                    </div>

                                    <div className="min-w-0 rounded-xl border border-border p-4">
                                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Account roles
                                        </dt>

                                        <dd className="mt-2 flex flex-wrap gap-2">
                                            {user.roles.length > 0 ? (
                                                user.roles.map((role) => (
                                                    <span
                                                        key={role.id}
                                                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    No roles assigned
                                                </span>
                                            )}
                                        </dd>
                                    </div>
                                </dl>

                                <p className="mt-5 text-xs leading-5 text-muted-foreground">
                                    Profile editing is not available in this
                                    design stage. The information shown comes
                                    from your existing authentication state.
                                </p>
                            </section>

                            <section
                                aria-labelledby="shopping-shortcuts-heading"
                                className="rounded-2xl border border-border bg-surface p-5 sm:p-8"
                            >
                                <h2
                                    id="shopping-shortcuts-heading"
                                    className="text-xl font-bold"
                                >
                                    Your shopping shortcuts
                                </h2>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Continue where you left off.
                                </p>

                                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                    <Link
                                        href="/marketplace"
                                        className="group rounded-xl border border-border p-4 transition hover:border-accent hover:bg-surface-muted"
                                    >
                                        <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-accent">
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="size-5"
                                            >
                                                <rect
                                                    x="4"
                                                    y="4"
                                                    width="6"
                                                    height="6"
                                                    rx="1"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                />
                                                <rect
                                                    x="14"
                                                    y="4"
                                                    width="6"
                                                    height="6"
                                                    rx="1"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                />
                                                <rect
                                                    x="4"
                                                    y="14"
                                                    width="6"
                                                    height="6"
                                                    rx="1"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                />
                                                <rect
                                                    x="14"
                                                    y="14"
                                                    width="6"
                                                    height="6"
                                                    rx="1"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                />
                                            </svg>
                                        </span>

                                        <h3 className="mt-4 text-sm font-semibold group-hover:text-accent">
                                            Marketplace
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Browse all products.
                                        </p>
                                    </Link>

                                    <Link
                                        href="/stores"
                                        className="group rounded-xl border border-border p-4 transition hover:border-accent hover:bg-surface-muted"
                                    >
                                        <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-accent">
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="size-5"
                                            >
                                                <path
                                                    d="M3 10h18l-2-6H5l-2 6Zm2 0v10h14V10"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>

                                        <h3 className="mt-4 text-sm font-semibold group-hover:text-accent">
                                            Stores
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Discover independent sellers.
                                        </p>
                                    </Link>

                                    <Link
                                        href="/cart"
                                        className="group rounded-xl border border-border p-4 transition hover:border-accent hover:bg-surface-muted"
                                    >
                                        <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-accent">
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
                                            </svg>
                                        </span>

                                        <h3 className="mt-4 text-sm font-semibold group-hover:text-accent">
                                            Shopping cart
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Review your selected products.
                                        </p>
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </div>

            <MarketplaceFooter />
        </main>
    );
}