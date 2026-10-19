'use client';

import {
    useMemo,
    useState,
    useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth-provider';

import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';

import {
    getCartSnapshot,
    parseCartSnapshot,
    removeFromCart,
    subscribeToCart,
    updateCartQuantity,
} from '@/lib/cart';

import { formatPrice } from '@/lib/format-price';

import {
    marketplaceCategories,
    mockMarketplaceProducts,
} from '@/data/mock-marketplace';

function getEmptyCartSnapshot(): string {
    return '';
}

export default function ShoppingCart() {
    const router = useRouter();
    const { user, isLoading, signOut } = useAuth();

    const [search, setSearch] = useState('');
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const cartSnapshot = useSyncExternalStore(
        subscribeToCart,
        getCartSnapshot,
        getEmptyCartSnapshot,
    );

    const items = useMemo(
        () => parseCartSnapshot(cartSnapshot),
        [cartSnapshot],
    );

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    const cartLines = useMemo(
        () =>
            items.flatMap((item) => {
                const product = mockMarketplaceProducts.find(
                    (candidate) => candidate.id === item.productId,
                );

                if (!product) {
                    return [];
                }

                return [
                    {
                        ...item,
                        product,
                        lineTotal: product.price * item.quantity,
                    },
                ];
            }),
        [items],
    );

    const subtotal = cartLines.reduce(
        (total, item) => total + item.lineTotal,
        0,
    );

    const totalQuantity = cartLines.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    function handleBrowseProducts() {
        const params = new URLSearchParams();

        if (search.trim()) {
            params.set('search', search.trim());
        }

        const query = params.toString();

        router.push(`/marketplace${query ? `?${query}` : ''}`);
    }

    function handleSelectCategory(category: string) {
        const params = new URLSearchParams();

        if (category !== 'All products') {
            params.set('category', category);
        }

        const query = params.toString();

        router.push(`/marketplace${query ? `?${query}` : ''}`);
    }

    function handleQuantityChange(
        productId: string,
        quantity: number,
    ) {
        if (!Number.isInteger(quantity)) {
            return;
        }

        if (quantity < 1) {
            removeFromCart(productId);
        } else {
            updateCartQuantity(productId, Math.min(quantity, 99));
        }
    }

    function handleRemove(productId: string) {
        removeFromCart(productId);
    }

    async function handleSignOut() {
        setMessage(null);
        setIsSigningOut(true);

        try {
            await signOut();
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
                        <Link href="/" className="hover:text-accent">
                            Home
                        </Link>

                        <span className="mx-2" aria-hidden="true">
                            /
                        </span>

                        <span className="font-medium text-foreground">
                            Shopping cart
                        </span>
                    </nav>

                    <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-accent">
                                Your shopping bag
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                Shopping cart
                            </h1>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            {totalQuantity}{' '}
                            {totalQuantity === 1 ? 'item' : 'items'}
                        </p>
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

            <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {cartLines.length === 0 ? (
                    <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-border bg-surface-muted px-6 py-14 text-center sm:py-20">
                        <div className="flex size-16 items-center justify-center rounded-full bg-surface text-accent">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-8"
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
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                            Explore the marketplace and add products you
                            would like to buy. They will appear here.
                        </p>

                        <Link
                            href="/marketplace"
                            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                        >
                            Explore products
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
                        <section
                            aria-labelledby="cart-items-heading"
                            className="min-w-0"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <h2
                                    id="cart-items-heading"
                                    className="text-lg font-semibold"
                                >
                                    Your items
                                </h2>

                                <Link
                                    href="/marketplace"
                                    className="text-sm font-medium text-accent hover:text-accent-hover"
                                >
                                    Continue shopping
                                </Link>
                            </div>

                            <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface px-4 sm:px-5">
                                {cartLines.map((item) => (
                                    <article
                                        key={item.productId}
                                        className="flex gap-4 py-5 sm:gap-5"
                                    >
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            aria-label={`View ${item.product.name}`}
                                            className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted sm:size-32"
                                        >
                                            <div
                                                role="img"
                                                aria-label={item.product.name}
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{
                                                    backgroundColor:
                                                    item.product.background,
                                                    backgroundImage: `url("${item.product.imageUrl}")`,
                                                }}
                                            />
                                        </Link>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/products/${item.product.slug}`}
                                                        className="text-sm font-semibold leading-5 hover:text-accent sm:text-base"
                                                    >
                                                        {item.product.name}
                                                    </Link>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {item.product.category}
                                                    </p>

                                                    <Link
                                                        href={`/store/${item.product.storeSlug}`}
                                                        className="mt-1 inline-block text-xs text-muted-foreground underline underline-offset-4 hover:text-accent"
                                                    >
                                                        {item.product.store}
                                                    </Link>
                                                </div>

                                                <p className="shrink-0 text-sm font-bold tabular-nums sm:text-base">
                                                    {formatPrice(item.lineTotal)}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                <div className="inline-flex h-9 items-center rounded-lg border border-border">
                                                    <button
                                                        type="button"
                                                        aria-label={`Decrease ${item.product.name} quantity`}
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.productId,
                                                                item.quantity - 1,
                                                            )
                                                        }
                                                        className="flex size-9 items-center justify-center rounded-l-lg transition hover:bg-surface-muted"
                                                    >
                                                        −
                                                    </button>

                                                    <span
                                                        aria-label={`Quantity: ${item.quantity}`}
                                                        className="min-w-9 text-center text-sm font-medium"
                                                    >
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        aria-label={`Increase ${item.product.name} quantity`}
                                                        disabled={item.quantity >= 99}
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.productId,
                                                                item.quantity + 1,
                                                            )
                                                        }
                                                        className="flex size-9 items-center justify-center rounded-r-lg transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemove(item.productId)
                                                    }
                                                    className="text-xs font-medium text-muted-foreground underline underline-offset-4 transition hover:text-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <p className="mt-4 text-xs leading-5 text-muted-foreground">
                                This cart is stored in your current browser
                                for this development preview.
                            </p>
                        </section>

                        <aside className="rounded-2xl border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-40">
                            <h2 className="text-lg font-semibold">
                                Order summary
                            </h2>

                            <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                                <span className="text-muted-foreground">
                                    Subtotal
                                </span>

                                <span className="font-semibold tabular-nums">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <div className="mt-3 flex items-start justify-between gap-4 text-sm">
                                <span className="text-muted-foreground">
                                    Shipping
                                </span>

                                <span className="text-right text-xs leading-5 text-muted-foreground">
                                    Calculated later
                                </span>
                            </div>

                            <div className="mt-5 border-t border-border pt-5">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="font-semibold">
                                        Subtotal
                                    </span>

                                    <span className="text-xl font-bold tabular-nums">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                    Shipping, payment, and final order
                                    confirmation will be handled during
                                    checkout.
                                </p>
                            </div>

                            <Link
                                href="/checkout"
                                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                            >
                                Continue to checkout
                            </Link>

                            <Link
                                href="/marketplace"
                                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:border-accent hover:bg-surface-muted"
                            >
                                Continue shopping
                            </Link>
                        </aside>
                    </div>
                )}
            </section>

            <MarketplaceFooter />
        </main>
    );
}