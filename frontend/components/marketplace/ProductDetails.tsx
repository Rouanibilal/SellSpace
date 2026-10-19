'use client';

import { useState } from 'react';
import Link from 'next/link';

import { addToCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format-price';
import type { MarketplaceProduct } from '@/types/marketplace';
import { mockMarketplaceStores } from '@/data/mock-marketplace';

type Props = {
    product: MarketplaceProduct;
};

export default function ProductDetails({ product }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [cartMessage, setCartMessage] = useState<string | null>(null);
    const [cartError, setCartError] = useState<string | null>(null);

    const store = mockMarketplaceStores.find(
        (item) => item.slug === product.storeSlug,
    );

    const hasDiscount =
        product.compareAtPrice !== undefined &&
        product.compareAtPrice > product.price;

    function handleAddToCart() {
        setCartMessage(null);
        setCartError(null);

        if (!product.inStock) {
            setCartError('This product is currently unavailable.');
            return;
        }

        try {
            addToCart(product.id, quantity);
            setCartMessage(
                `${quantity} ${
                    quantity === 1 ? 'item' : 'items'
                } added to your cart.`,
            );
        } catch {
            setCartError(
                'We could not update your cart. Please try again.',
            );
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
                >
                    <Link
                        href="/"
                        className="transition hover:text-accent"
                    >
                        Home
                    </Link>

                    <span aria-hidden="true">/</span>

                    <Link
                        href="/marketplace"
                        className="transition hover:text-accent"
                    >
                        Marketplace
                    </Link>

                    <span aria-hidden="true">/</span>

                    <span className="font-medium text-foreground">
                        {product.name}
                    </span>
                </nav>

                <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:gap-14 xl:gap-20">
                    <section
                        aria-label="Product image"
                        className="min-w-0"
                    >
                        <div
                            className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface-muted sm:aspect-square"
                            style={{
                                backgroundColor: product.background,
                            }}
                        >
                            <div
                                role="img"
                                aria-label={product.name}
                                className="absolute inset-0 bg-contain bg-center bg-no-repeat p-5"
                                style={{
                                    backgroundImage: `url("${product.imageUrl}")`,
                                }}
                            />

                            {product.badge && (
                                <span className="absolute left-4 top-4 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground shadow-sm">
                                    {product.badge}
                                </span>
                            )}

                            {!product.inStock && (
                                <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 px-4 py-3 text-center text-sm font-semibold text-white">
                                    Currently unavailable
                                </span>
                            )}
                        </div>

                        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
                            <p className="text-sm font-semibold text-foreground">
                                About this product
                            </p>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {product.description}
                            </p>
                        </div>
                    </section>

                    <section className="min-w-0 lg:py-3">
                        <p className="text-sm font-medium text-accent">
                            {product.category}
                        </p>

                        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                            {product.name}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-1.5">
                                <span
                                    aria-hidden="true"
                                    className="text-lg text-amber-500"
                                >
                                    ★
                                </span>

                                <span className="text-sm font-semibold text-foreground">
                                    {product.rating.toFixed(1)}
                                </span>
                            </div>

                            <span
                                aria-hidden="true"
                                className="text-border"
                            >
                                |
                            </span>

                            <span className="text-sm text-muted-foreground">
                                {product.reviewCount} reviews
                            </span>

                            <span
                                aria-hidden="true"
                                className="text-border"
                            >
                                |
                            </span>

                            <span
                                className={`text-sm font-medium ${
                                    product.inStock
                                        ? 'text-emerald-700'
                                        : 'text-muted-foreground'
                                }`}
                            >
                                {product.inStock
                                    ? 'In stock'
                                    : 'Out of stock'}
                            </span>
                        </div>

                        <div className="mt-7 border-y border-border py-6">
                            <div className="flex flex-wrap items-baseline gap-3">
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {formatPrice(product.price)}
                                </p>

                                {hasDiscount && (
                                    <p className="text-base text-muted-foreground line-through">
                                        {formatPrice(
                                            product.compareAtPrice!,
                                        )}
                                    </p>
                                )}

                                {hasDiscount && (
                                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                                        Save{' '}
                                        {Math.round(
                                            ((product.compareAtPrice! -
                                                    product.price) /
                                                product.compareAtPrice!) *
                                            100,
                                        )}
                                        %
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 text-xs text-muted-foreground">
                                Sample listing price in Moroccan dirhams.
                            </p>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-semibold text-foreground">
                                Sold by
                            </p>

                            <Link
                                href={`/store/${product.storeSlug}`}
                                className="mt-3 flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/50 hover:bg-surface-muted"
                            >
                                <div
                                    className="flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-foreground"
                                    style={{
                                        backgroundColor:
                                            store?.color ?? '#e2e8f0',
                                    }}
                                >
                                    {store?.initials ??
                                        product.store.slice(0, 2).toUpperCase()}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-foreground">
                                        {product.store}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {store?.description ??
                                            'Explore this seller’s storefront.'}
                                    </p>
                                </div>

                                <span
                                    aria-hidden="true"
                                    className="text-lg text-accent"
                                >
                                    →
                                </span>
                            </Link>
                        </div>

                        <div className="mt-7">
                            <label
                                htmlFor="product-quantity"
                                className="text-sm font-semibold text-foreground"
                            >
                                Quantity
                            </label>

                            <div className="mt-3 flex flex-wrap items-center gap-4">
                                <div className="inline-flex h-12 items-center rounded-xl border border-border bg-surface">
                                    <button
                                        type="button"
                                        aria-label="Decrease quantity"
                                        disabled={quantity <= 1}
                                        onClick={() =>
                                            setQuantity((current) =>
                                                Math.max(1, current - 1),
                                            )
                                        }
                                        className="flex size-11 items-center justify-center rounded-l-xl text-lg transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        −
                                    </button>

                                    <input
                                        id="product-quantity"
                                        type="number"
                                        min={1}
                                        max={99}
                                        value={quantity}
                                        onChange={(event) => {
                                            const value = Number(
                                                event.target.value,
                                            );

                                            if (
                                                Number.isInteger(value) &&
                                                value >= 1 &&
                                                value <= 99
                                            ) {
                                                setQuantity(value);
                                            }
                                        }}
                                        className="h-11 w-12 border-x border-border bg-transparent text-center text-sm font-semibold outline-none"
                                    />

                                    <button
                                        type="button"
                                        aria-label="Increase quantity"
                                        disabled={quantity >= 99}
                                        onClick={() =>
                                            setQuantity((current) =>
                                                Math.min(99, current + 1),
                                            )
                                        }
                                        className="flex size-11 items-center justify-center rounded-r-xl text-lg transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="text-sm text-muted-foreground">
                                    Total:{' '}
                                    <span className="font-semibold text-foreground">
                                        {formatPrice(
                                            product.price * quantity,
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto sm:min-w-64"
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

                            {product.inStock
                                ? 'Add to cart'
                                : 'Unavailable'}
                        </button>

                        {cartMessage && (
                            <div
                                role="status"
                                className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                            >
                                <p className="text-sm font-medium text-emerald-800">
                                    {cartMessage}
                                </p>

                                <Link
                                    href="/cart"
                                    className="mt-2 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
                                >
                                    View cart →
                                </Link>
                            </div>
                        )}

                        {cartError && (
                            <p
                                role="alert"
                                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                            >
                                {cartError}
                            </p>
                        )}

                        <div className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-accent">
                                    ✓
                                </span>

                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Independent sellers
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        Discover different stores in one
                                        marketplace.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-accent">
                                    ♡
                                </span>

                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        More to discover
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        Explore more products from this
                                        seller.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-12 border-t border-border pt-7 sm:mt-16">
                    <Link
                        href="/marketplace"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent-hover"
                    >
                        <span aria-hidden="true">←</span>
                        Continue shopping
                    </Link>
                </div>
            </div>
        </main>
    );
}