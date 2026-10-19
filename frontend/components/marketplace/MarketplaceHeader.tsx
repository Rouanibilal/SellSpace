'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

import type { User } from '@/lib/auth';

import {
    getCartSnapshot,
    parseCartSnapshot,
    subscribeToCart,
} from '@/lib/cart';

type Props = {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    search: string;
    onSearchChange: (value: string) => void;
    onBrowseProducts: () => void;
    user: User | null;
    isLoading: boolean;
    isSeller: boolean;
    isSigningOut: boolean;
    onSignOut: () => void;
};

function CartIcon() {
    return (
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
            <circle cx="10" cy="20" r="1" fill="currentColor" />
            <circle cx="18" cy="20" r="1" fill="currentColor" />
        </svg>
    );
}

function HeartIcon() {
    return (
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
    );
}

export default function MarketplaceHeader({
                                              categories,
                                              selectedCategory,
                                              onSelectCategory,
                                              search,
                                              onSearchChange,
                                              onBrowseProducts,
                                              user,
                                              isLoading,
                                              isSeller,
                                              isSigningOut,
                                              onSignOut,
                                          }: Props) {
    const cartSnapshot = useSyncExternalStore(
        subscribeToCart,
        getCartSnapshot,
        () => '',
    );

    const cartQuantity = parseCartSnapshot(cartSnapshot).reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background">
            <div className="bg-accent px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
                Discover independent stores. Find something you love.
            </div>

            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-[76px] flex-wrap items-center gap-4 py-4 lg:flex-nowrap">
                    <Link
                        href="/"
                        aria-label="SellSpace home"
                        className="shrink-0 text-2xl font-bold tracking-[-0.07em] text-foreground sm:text-3xl"
                    >
                        sellspace<span className="text-accent">.</span>
                    </Link>

                    <form
                        role="search"
                        className="order-3 flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-4 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 lg:order-none lg:ml-6 lg:max-w-xl"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onBrowseProducts();
                        }}
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-5 shrink-0 text-muted-foreground"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                            <path
                                d="m16 16 4 4"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>

                        <input
                            aria-label="Search products and stores"
                            value={search}
                            onChange={(event) =>
                                onSearchChange(event.target.value)
                            }
                            placeholder="Search products, brands and stores"
                            className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                        />

                        {search && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => onSearchChange('')}
                                className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <nav
                        aria-label="Main navigation"
                        className="ml-auto flex items-center gap-2 sm:gap-3 lg:gap-4"
                    >
                        <Link
                            href="/marketplace"
                            className="hidden whitespace-nowrap text-sm font-medium text-muted-foreground transition hover:text-accent sm:inline-flex"
                        >
                            Shop
                        </Link>

                        <Link
                            href="/stores"
                            className="hidden whitespace-nowrap text-sm font-medium text-muted-foreground transition hover:text-accent md:inline-flex"
                        >
                            Stores
                        </Link>

                        <Link
                            href="/wishlist"
                            aria-label="Wishlist"
                            title="Wishlist"
                            className="inline-flex size-10 items-center justify-center rounded-lg border border-border transition hover:border-accent hover:bg-surface-muted hover:text-accent"
                        >
                            <HeartIcon />
                        </Link>

                        <Link
                            href="/cart"
                            aria-label={`Shopping cart, ${cartQuantity} ${
                                cartQuantity === 1 ? 'item' : 'items'
                            }`}
                            title={`Shopping cart (${cartQuantity})`}
                            className="relative inline-flex size-10 items-center justify-center rounded-lg border border-border transition hover:border-accent hover:bg-surface-muted"
                        >
                            <CartIcon />

                            {cartQuantity > 0 && (
                                <span
                                    aria-hidden="true"
                                    className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-background"
                                >
                                    {cartQuantity > 99 ? '99+' : cartQuantity}
                                </span>
                            )}
                        </Link>

                        {isLoading ? (
                            <span
                                aria-label="Loading account"
                                className="size-5 animate-pulse rounded-full bg-surface-muted"
                            />
                        ) : user ? (
                            <>
                                <Link
                                    href="/account"
                                    className="hidden whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-foreground transition hover:text-accent sm:inline-flex"
                                >
                                    My account
                                </Link>

                                <Link
                                    href="/account/orders"
                                    className="hidden whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition hover:text-accent lg:inline-flex"
                                >
                                    Orders
                                </Link>

                                {isSeller && (
                                    <Link
                                        href="/seller"
                                        className="hidden whitespace-nowrap text-sm font-medium text-muted-foreground transition hover:text-accent xl:inline-flex"
                                    >
                                        Seller dashboard
                                    </Link>
                                )}

                                <button
                                    type="button"
                                    onClick={onSignOut}
                                    disabled={isSigningOut}
                                    className="whitespace-nowrap rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                                >
                                    {isSigningOut
                                        ? 'Logging out…'
                                        : 'Log out'}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-foreground transition hover:text-accent sm:inline-flex"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href="/register"
                                    className="whitespace-nowrap rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover sm:px-4"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                    <nav
                        aria-label="Shop by category"
                        className="flex min-w-max items-center gap-6 sm:gap-8"
                    >
                        {categories.map((category) => {
                            const isSelected =
                                selectedCategory === category;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => onSelectCategory(category)}
                                    className={`border-b-2 py-3 text-sm transition ${
                                        isSelected
                                            ? 'border-accent font-semibold text-accent'
                                            : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                                    }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
}