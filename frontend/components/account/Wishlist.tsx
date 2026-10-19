'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth-provider';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';
import ProductCard from '@/components/marketplace/ProductCard';

import {
    getWishlistSnapshot,
    parseWishlistSnapshot,
    subscribeToWishlist,
} from '@/lib/wishlist';

import {
    marketplaceCategories,
    mockMarketplaceProducts,
} from '@/data/mock-marketplace';

export default function Wishlist() {
    const router = useRouter();
    const { user, isLoading, signOut } = useAuth();

    const [search, setSearch] = useState('');
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const wishlistSnapshot = useSyncExternalStore(
        subscribeToWishlist,
        getWishlistSnapshot,
        () => '',
    );

    const savedIds = useMemo(
        () => parseWishlistSnapshot(wishlistSnapshot),
        [wishlistSnapshot],
    );

    const savedProducts = useMemo(
        () =>
            savedIds.flatMap((id) => {
                const product = mockMarketplaceProducts.find(
                    (item) => item.id === id,
                );

                return product ? [product] : [];
            }),
        [savedIds],
    );

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
                            Wishlist
                        </span>
                    </nav>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-accent">
                                Saved for later
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                Your wishlist
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                                Keep the products you love together and
                                come back to them whenever you are ready.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-background px-4 py-3">
                            <p className="text-2xl font-bold">
                                {savedProducts.length}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {savedProducts.length === 1
                                    ? 'Saved product'
                                    : 'Saved products'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {message && (
                <p
                    role="alert"
                    className="mx-auto max-w-[1408px] px-4 pt-4 text-sm text-red-600 sm:px-6 lg:px-8"
                >
                    {message}
                </p>
            )}

            <section
                aria-labelledby="wishlist-products-heading"
                className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
            >
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2
                            id="wishlist-products-heading"
                            className="text-xl font-bold sm:text-2xl"
                        >
                            Saved products
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Select a product to view its details. Use the
                            heart button to remove it from your wishlist.
                        </p>
                    </div>

                    <Link
                        href="/marketplace"
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent"
                    >
                        Discover more
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>

                {savedProducts.length > 0 ? (
                    <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
                        {savedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-7 flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface-muted px-5 py-16 text-center sm:py-20">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-surface text-accent">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-8"
                            >
                                <path
                                    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <h3 className="mt-5 text-xl font-bold">
                            Your wishlist is empty
                        </h3>

                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Browse the marketplace and tap the heart on
                            products you would like to save.
                        </p>

                        <Link
                            href="/marketplace"
                            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                        >
                            Explore products
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                )}

                <div className="mt-12 border-t border-border pt-6">
                    <Link
                        href="/account"
                        className="text-sm font-semibold text-accent hover:text-accent-hover"
                    >
                        Go to my account →
                    </Link>
                </div>
            </section>

            <MarketplaceFooter />
        </main>
    );
}