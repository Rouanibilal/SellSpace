'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

import { formatPrice } from '@/lib/format-price';
import {
    getWishlistSnapshot,
    parseWishlistSnapshot,
    subscribeToWishlist,
    toggleWishlist,
} from '@/lib/wishlist';

import type { MarketplaceProduct } from '@/types/marketplace';

type Props = {
    product: MarketplaceProduct;
};

function getEmptyWishlistSnapshot(): string {
    return '';
}

export default function ProductCard({ product }: Props) {
    const wishlistSnapshot = useSyncExternalStore(
        subscribeToWishlist,
        getWishlistSnapshot,
        getEmptyWishlistSnapshot,
    );

    const isSaved = parseWishlistSnapshot(wishlistSnapshot).includes(
        product.id,
    );

    const hasDiscount =
        product.compareAtPrice !== undefined &&
        product.compareAtPrice > product.price;

    return (
        <article className="group min-w-0">
            <div className="relative">
                <Link
                    href={`/products/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="relative block aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                    <div
                        role="img"
                        aria-label={product.name}
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                            backgroundColor: product.background,
                            backgroundImage: `url("${product.imageUrl}")`,
                        }}
                    />

                    {product.badge && (
                        <span className="absolute left-3 top-3 max-w-[calc(100%-68px)] rounded-md border border-border/50 bg-surface/95 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground backdrop-blur-sm sm:text-xs">
                            {product.badge}
                        </span>
                    )}

                    {!product.inStock && (
                        <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 px-3 py-3 text-center text-xs font-semibold text-white">
                            Currently unavailable
                        </span>
                    )}

                    <span
                        aria-hidden="true"
                        className="absolute bottom-3 right-3 flex size-10 translate-y-2 items-center justify-center rounded-full bg-white text-foreground opacity-0 shadow-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-5"
                        >
                            <path
                                d="M7 17 17 7M7 7h10v10"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </Link>

                <button
                    type="button"
                    aria-label={
                        isSaved
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                    }
                    aria-pressed={isSaved}
                    title={
                        isSaved ? 'Remove from wishlist' : 'Save to wishlist'
                    }
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full border border-border/70 bg-white/95 text-foreground shadow-sm backdrop-blur-sm transition hover:scale-105 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill={isSaved ? 'currentColor' : 'none'}
                        className={`size-5 transition ${
                            isSaved ? 'text-accent' : ''
                        }`}
                    >
                        <path
                            d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <div className="pt-3">
                <div className="flex items-start justify-between gap-3">
                    <Link
                        href={`/products/${product.slug}`}
                        className="min-w-0 text-sm font-semibold leading-5 text-foreground transition hover:text-accent sm:text-base"
                    >
                        {product.name}
                    </Link>

                    <div className="shrink-0 text-right">
                        <p className="text-sm font-bold tabular-nums text-foreground sm:text-base">
                            {formatPrice(product.price)}
                        </p>

                        {hasDiscount && (
                            <p className="mt-0.5 text-xs tabular-nums text-muted-foreground line-through">
                                {formatPrice(product.compareAtPrice!)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span>{product.category}</span>
                    <span aria-hidden="true">·</span>

                    <span
                        className={
                            product.inStock
                                ? 'text-emerald-700'
                                : 'text-muted-foreground'
                        }
                    >
                        {product.inStock ? 'In stock' : 'Out of stock'}
                    </span>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <svg
                        aria-label={`${product.rating} out of 5 stars`}
                        role="img"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-4 text-amber-500"
                    >
                        <path d="m10 1.5 2.55 5.17 5.7.83-4.12 4.02.97 5.68L10 14.52l-5.1 2.68.97-5.68L1.75 7.5l5.7-.83L10 1.5Z" />
                    </svg>

                    <span className="font-medium text-foreground">
                        {product.rating.toFixed(1)}
                    </span>

                    <span>({product.reviewCount} reviews)</span>
                </div>

                <Link
                    href={`/store/${product.storeSlug}`}
                    className="mt-2 inline-block text-xs text-muted-foreground underline decoration-border underline-offset-4 transition hover:text-accent"
                >
                    Sold by {product.store}
                </Link>
            </div>
        </article>
    );
}