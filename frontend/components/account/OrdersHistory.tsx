'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth-provider';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';

import { marketplaceCategories } from '@/data/mock-marketplace';
import { mockOrders } from '@/data/mock-orders';
import { formatPrice } from '@/lib/format-price';

import type { OrderStatus } from '@/types/orders';

type StatusFilter = 'all' | OrderStatus;

const statusLabels: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

const statusStyles: Record<OrderStatus, string> = {
    pending: 'border-amber-200 bg-amber-50 text-amber-800',
    confirmed: 'border-blue-200 bg-blue-50 text-blue-800',
    processing: 'border-indigo-200 bg-indigo-50 text-indigo-800',
    shipped: 'border-violet-200 bg-violet-50 text-violet-800',
    delivered: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    cancelled: 'border-red-200 bg-red-50 text-red-800',
};

function formatOrderDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Date unavailable';
    }

    return new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(date);
}

export default function OrdersHistory() {
    const router = useRouter();
    const { user, isLoading, signOut } = useAuth();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>('all');
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    const filteredOrders = useMemo(() => {
        const term = search.trim().toLowerCase();

        return mockOrders.filter((order) => {
            const matchesSearch =
                !term ||
                order.orderNumber.toLowerCase().includes(term) ||
                order.items.some((item) =>
                    item.productName.toLowerCase().includes(term),
                );

            const matchesStatus =
                statusFilter === 'all' ||
                order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

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

                        <Link
                            href="/account"
                            className="hover:text-accent"
                        >
                            My account
                        </Link>

                        <span className="mx-2" aria-hidden="true">
                            /
                        </span>

                        <span className="font-medium text-foreground">
                            Orders
                        </span>
                    </nav>

                    <p className="mt-6 text-sm font-semibold text-accent">
                        Your purchases
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Order history
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Review your orders, check their status, and revisit
                        the products you purchased.
                    </p>
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
                {isLoading ? (
                    <div
                        role="status"
                        className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted-foreground"
                    >
                        Loading your account…
                    </div>
                ) : !user ? (
                    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-7 text-center sm:p-12">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-accent">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-8"
                            >
                                <rect
                                    x="5"
                                    y="3"
                                    width="14"
                                    height="18"
                                    rx="2"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />
                                <path
                                    d="M9 8h6M9 12h6M9 16h3"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            Sign in to view your orders
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Your order history belongs to your account.
                            Sign in to continue.
                        </p>

                        <Link
                            href="/login"
                            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                        >
                            Log in
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <p className="text-sm font-semibold text-blue-900">
                                Design preview — sample orders
                            </p>

                            <p className="mt-1 text-xs leading-5 text-blue-800">
                                These orders are fictional examples used to
                                preview the customer experience. They are not
                                purchases associated with your account.
                            </p>
                        </div>

                        <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Your orders
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {filteredOrders.length}{' '}
                                    {filteredOrders.length === 1
                                        ? 'order'
                                        : 'orders'}{' '}
                                    shown
                                </p>
                            </div>

                            <label className="flex flex-col gap-2 text-sm font-medium lg:w-72">
                                Search orders
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Order number or product"
                                    className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm font-normal outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/10"
                                />
                            </label>
                        </div>

                        <div
                            aria-label="Filter orders by status"
                            className="mt-5 flex gap-2 overflow-x-auto pb-2"
                        >
                            {(
                                [
                                    'all',
                                    'pending',
                                    'shipped',
                                    'delivered',
                                    'cancelled',
                                ] as StatusFilter[]
                            ).map((status) => {
                                const selected = statusFilter === status;

                                const label =
                                    status === 'all'
                                        ? 'All orders'
                                        : statusLabels[status];

                                return (
                                    <button
                                        key={status}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() =>
                                            setStatusFilter(status)
                                        }
                                        className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                            selected
                                                ? 'bg-accent text-white'
                                                : 'border border-border bg-surface text-muted-foreground hover:border-accent/50 hover:text-accent'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {filteredOrders.length > 0 ? (
                            <div className="mt-5 space-y-5">
                                {filteredOrders.map((order) => (
                                    <article
                                        key={order.id}
                                        className="overflow-hidden rounded-2xl border border-border bg-surface"
                                    >
                                        <div className="flex flex-col gap-4 border-b border-border bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-8">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Order number
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold">
                                                        {order.orderNumber}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Date placed
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium">
                                                        {formatOrderDate(
                                                            order.createdAt,
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Total
                                                    </p>

                                                    <p className="mt-1 text-sm font-bold">
                                                        {formatPrice(
                                                            order.total,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                                    statusStyles[order.status]
                                                }`}
                                            >
                                                {statusLabels[order.status]}
                                            </span>
                                        </div>

                                        <div className="p-4 sm:p-6">
                                            <div className="space-y-4">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.productId}
                                                        className="flex items-center gap-4"
                                                    >
                                                        <Link
                                                            href={`/products/${item.productSlug}`}
                                                            aria-label={`View ${item.productName}`}
                                                            className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted sm:size-20"
                                                        >
                                                            <div
                                                                role="img"
                                                                aria-label={item.productName}
                                                                className="absolute inset-0 bg-cover bg-center"
                                                                style={{
                                                                    backgroundImage: `url("${item.productImageUrl}")`,
                                                                }}
                                                            />
                                                        </Link>

                                                        <div className="min-w-0 flex-1">
                                                            <Link
                                                                href={`/products/${item.productSlug}`}
                                                                className="text-sm font-semibold transition hover:text-accent"
                                                            >
                                                                {item.productName}
                                                            </Link>

                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                Sold by{' '}
                                                                {item.storeName}
                                                            </p>

                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                Quantity:{' '}
                                                                {item.quantity}
                                                            </p>
                                                        </div>

                                                        <p className="shrink-0 text-sm font-semibold">
                                                            {formatPrice(
                                                                item.unitPrice *
                                                                item.quantity,
                                                            )}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-xs leading-5 text-muted-foreground">
                                                    Payment:{' '}
                                                    {order.paymentMethod ===
                                                    'card'
                                                        ? 'Bank card'
                                                        : 'Cash on delivery'}
                                                    {' · '}
                                                    {order.paymentStatus ===
                                                    'paid'
                                                        ? 'Paid'
                                                        : order.paymentStatus ===
                                                        'refunded'
                                                            ? 'Refunded'
                                                            : order.paymentStatus ===
                                                            'failed'
                                                                ? 'Failed'
                                                                : 'Awaiting payment'}
                                                </p>

                                                <Link
                                                    href={`/account/orders/${order.orderNumber}`}
                                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent"
                                                >
                                                    View order details
                                                    <span aria-hidden="true">
                                                        →
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface-muted px-5 py-14 text-center">
                                <h3 className="text-lg font-semibold">
                                    No matching orders
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Try another order number or status.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('all');
                                    }}
                                    className="mt-5 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            <MarketplaceFooter />
        </main>
    );
}