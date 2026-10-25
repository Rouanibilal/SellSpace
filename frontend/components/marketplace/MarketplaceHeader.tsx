'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

import { useTheme } from '@/components/theme-provider';
import type { User } from '@/lib/auth';

import {
    getCartSnapshot,
    parseCartSnapshot,
    subscribeToCart,
} from '@/lib/cart';

import { useSiteSettings } from '@/components/site-settings-provider';

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

function MarketplaceIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-5"
        >
            <path
                d="M3 10v10h18V10M2.5 9l2-6h15l2 6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.5 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function AccountIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-5 shrink-0"
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
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DashboardIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-5 shrink-0"
        >
            <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
            />
        </svg>
    );
}

function ThemeIcon({ isDark }: { isDark: boolean }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-5"
        >
            {isDark ? (
                <path
                    d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
            ) : (
                <path
                    d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )}
        </svg>
    );
}

export default function MarketplaceHeader({
                                              search,
                                              onSearchChange,
                                              onBrowseProducts,
                                              user,
                                              isLoading,
                                              isSeller,
                                              isSigningOut,
                                              onSignOut,
                                          }: Props) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const settings = useSiteSettings();

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

            {settings.announcement_enabled && (
                <div className="bg-accent px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
                    {settings.announcement_text}
                </div>
            )}

            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-[76px] flex-wrap items-center gap-3 py-4 lg:flex-nowrap lg:gap-5">
                    <Link
                        href="/"
                        aria-label="SellSpace home"
                        className="shrink-0 text-2xl font-bold tracking-[-0.07em] text-foreground sm:text-3xl"
                    >
                        {settings.brand_name_enabled && (
                            <>
                                {settings.brand_name}
                                <span className="text-accent">.</span>
                            </>
                        )}
                    </Link>

                    {/* Search */}
                    <form
                        role="search"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onBrowseProducts();
                        }}
                        className="order-3 flex w-full min-w-0 items-center gap-3 rounded-xl border border-border bg-surface px-4 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 lg:order-none lg:ml-4 lg:w-auto lg:flex-1 lg:max-w-[520px]"
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

                    {/* Wishlist and cart */}
                    <nav
                        aria-label="Shopping actions"
                        className="flex shrink-0 items-center gap-2 sm:gap-3"
                    >
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
                            className="relative inline-flex size-10 items-center justify-center rounded-lg border border-border transition hover:border-accent hover:bg-surface-muted hover:text-accent"
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
                    </nav>

                    {/* Marketplace: icon only */}
                    <Link
                        href="/marketplace"
                        aria-label="Marketplace"
                        title="Marketplace"
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition hover:border-accent hover:bg-surface-muted hover:text-accent lg:ml-auto"
                    >
                        <MarketplaceIcon />
                    </Link>

                    {/* Theme and account actions */}
                    <nav
                        aria-label="Main navigation"
                        className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4"
                    >
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={
                                isDark
                                    ? 'Switch to light mode'
                                    : 'Switch to dark mode'
                            }
                            title={
                                isDark
                                    ? 'Switch to light mode'
                                    : 'Switch to dark mode'
                            }
                            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition hover:border-accent hover:bg-surface-muted hover:text-accent"
                        >
                            <ThemeIcon isDark={isDark} />
                        </button>

                        {isLoading ? (
                            <span
                                aria-label="Loading account"
                                className="size-5 animate-pulse rounded-full bg-surface-muted"
                            />
                        ) : user ? (
                            <>
                                {/* Account: icon + label */}
                                <Link
                                    href="/account"
                                    className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground transition hover:border-accent hover:bg-surface-muted hover:text-accent sm:px-4"
                                >
                                    <AccountIcon />
                                    <span>Account</span>
                                </Link>

                                {/* Dashboard button with icon */}
                                {isSeller && (
                                    <Link
                                        href="/seller"
                                        aria-label="Seller dashboard"
                                        title="Seller dashboard"
                                        className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground transition hover:border-accent hover:bg-surface-muted hover:text-accent sm:px-4"
                                    >
                                        <DashboardIcon />
                                        <span>Dashboard</span>
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
            </div>
        </header>
    );
}