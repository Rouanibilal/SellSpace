'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth-provider';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';

import { mockOrders } from '@/data/mock-orders';
import { marketplaceCategories } from '@/data/mock-marketplace';
import { addToCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format-price';

import type {
    OrderPaymentStatus,
    OrderStatus,
} from '@/types/orders';

type Props = {
    orderNumber: string;
};

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

const paymentLabels: Record<OrderPaymentStatus, string> = {
    pending: 'Awaiting payment',
    paid: 'Paid',
    failed: 'Payment failed',
    refunded: 'Refunded',
};

const progressSteps: {
    status: OrderStatus;
    title: string;
    description: string;
}[] = [
    {
        status: 'pending',
        title: 'Order placed',
        description: 'The order has been submitted.',
    },
    {
        status: 'confirmed',
        title: 'Order confirmed',
        description: 'The order has been confirmed by the seller.',
    },
    {
        status: 'processing',
        title: 'Preparing your order',
        description: 'The items are being prepared.',
    },
    {
        status: 'shipped',
        title: 'On its way',
        description: 'The order has been marked as shipped.',
    },
    {
        status: 'delivered',
        title: 'Delivered',
        description: 'The order has been marked as delivered.',
    },
];

function formatOrderDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Date unavailable';
    }

    return new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(date);
}

export default function OrderDetails({ orderNumber }: Props) {
    const router = useRouter();
    const { user, isLoading, signOut } = useAuth();

    const [search, setSearch] = useState('');
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [isAddingItems, setIsAddingItems] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const order = mockOrders.find(
        (item) => item.orderNumber === orderNumber,
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

    function handleAddItemsToCart() {
        if (!order) {
            return;
        }

        setMessage(null);
        setIsAddingItems(true);

        try {
            for (const item of order.items) {
                addToCart(item.productId, item.quantity);
            }

            router.push('/cart');
        } catch {
            setMessage(
                'Unable to add the order items to your cart. Please try again.',
            );
        } finally {
            setIsAddingItems(false);
        }
    }

    const currentProgressIndex = order
        ? progressSteps.findIndex(
            (step) => step.status === order.status,
        )
        : -1;

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
                        className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
                    >
                        <Link href="/" className="hover:text-accent">
                            Home
                        </Link>

                        <span aria-hidden="true">/</span>

                        <Link
                            href="/account"
                            className="hover:text-accent"
                        >
                            My account
                        </Link>

                        <span aria-hidden="true">/</span>

                        <Link
                            href="/account/orders"
                            className="hover:text-accent"
                        >
                            Orders
                        </Link>

                        <span aria-hidden="true">/</span>

                        <span className="font-medium text-foreground">
                            {orderNumber}
                        </span>
                    </nav>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-accent">
                                Order details
                            </p>

                            <h1 className="mt-2 break-words text-3xl font-bold tracking-tight sm:text-4xl">
                                {order ? order.orderNumber : 'Order not found'}
                            </h1>

                            {order && (
                                <p className="mt-3 text-sm text-muted-foreground">
                                    Placed on {formatOrderDate(order.createdAt)}
                                </p>
                            )}
                        </div>

                        {order && (
                            <span
                                className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${statusStyles[order.status]}`}
                            >
                                {statusLabels[order.status]}
                            </span>
                        )}
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

            <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {isLoading ? (
                    <div
                        role="status"
                        className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted-foreground"
                    >
                        Loading your account…
                    </div>
                ) : !user ? (
                    <section className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-8 text-center">
                        <h2 className="text-xl font-bold">
                            Sign in to view your order
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Sign in to access your customer order experience.
                        </p>

                        <Link
                            href="/login"
                            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                        >
                            Log in
                        </Link>
                    </section>
                ) : !order ? (
                    <section className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-8 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-7"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="7"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />
                                <path
                                    d="m16 16 4 4"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            We couldn&apos;t find this order.
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Check the order number or return to the order history.
                        </p>

                        <Link
                            href="/account/orders"
                            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                        >
                            View order history
                        </Link>
                    </section>
                ) : (
                    <>
                        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <p className="text-sm font-semibold text-blue-900">
                                Design preview — sample order
                            </p>

                            <p className="mt-1 text-xs leading-5 text-blue-800">
                                This order and its delivery information are
                                fictional preview data. They do not represent
                                a real purchase or live tracking information.
                            </p>
                        </div>

                        {order.status === 'cancelled' ? (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                                <p className="text-sm font-semibold text-red-800">
                                    This order has been cancelled.
                                </p>

                                <p className="mt-1 text-xs leading-5 text-red-700">
                                    Any cancellation or refund processing shown
                                    in a future live system will depend on its
                                    confirmed order and payment status.
                                </p>
                            </div>
                        ) : (
                            <section
                                aria-labelledby="order-progress-heading"
                                className="rounded-2xl border border-border bg-surface p-5 sm:p-8"
                            >
                                <h2
                                    id="order-progress-heading"
                                    className="text-xl font-bold"
                                >
                                    Order progress
                                </h2>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Example status progression for this order.
                                </p>

                                <ol className="mt-7 space-y-6">
                                    {progressSteps.map((step, index) => {
                                        const isComplete =
                                            currentProgressIndex >= index;
                                        const isCurrent =
                                            currentProgressIndex === index;

                                        return (
                                            <li
                                                key={step.status}
                                                className="relative flex gap-4"
                                            >
                                                {index <
                                                    progressSteps.length - 1 && (
                                                        <span
                                                            aria-hidden="true"
                                                            className={`absolute left-4 top-9 h-[calc(100%+8px)] w-px ${
                                                                currentProgressIndex > index
                                                                    ? 'bg-accent'
                                                                    : 'bg-border'
                                                            }`}
                                                        />
                                                    )}

                                                <span
                                                    className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                                                        isComplete
                                                            ? 'border-accent bg-accent text-white'
                                                            : 'border-border bg-surface text-muted-foreground'
                                                    }`}
                                                >
                                                    {isComplete
                                                        ? '✓'
                                                        : index + 1}
                                                </span>

                                                <div className="min-w-0 flex-1 pb-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3
                                                            className={`text-sm font-semibold ${
                                                                isComplete
                                                                    ? 'text-foreground'
                                                                    : 'text-muted-foreground'
                                                            }`}
                                                        >
                                                            {step.title}
                                                        </h3>

                                                        {isCurrent && (
                                                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                                                Current status
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </section>
                        )}

                        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
                            <div className="min-w-0 space-y-6">
                                <section
                                    aria-labelledby="ordered-items-heading"
                                    className="rounded-2xl border border-border bg-surface p-5 sm:p-7"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h2
                                            id="ordered-items-heading"
                                            className="text-xl font-bold"
                                        >
                                            Items in this order
                                        </h2>

                                        <span className="text-sm text-muted-foreground">
                                            {order.items.length}{' '}
                                            {order.items.length === 1
                                                ? 'product'
                                                : 'products'}
                                        </span>
                                    </div>

                                    <div className="mt-5 divide-y divide-border">
                                        {order.items.map((item) => (
                                            <article
                                                key={item.productId}
                                                className="flex gap-4 py-5 first:pt-0 last:pb-0"
                                            >
                                                <Link
                                                    href={`/products/${item.productSlug}`}
                                                    aria-label={`View ${item.productName}`}
                                                    className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted sm:size-24"
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
                                                        className="text-sm font-semibold hover:text-accent sm:text-base"
                                                    >
                                                        {item.productName}
                                                    </Link>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Sold by{' '}
                                                        <Link
                                                            href={`/store/${item.storeSlug}`}
                                                            className="underline underline-offset-4 hover:text-accent"
                                                        >
                                                            {item.storeName}
                                                        </Link>
                                                    </p>

                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <p className="text-sm font-bold tabular-nums">
                                                        {formatPrice(
                                                            item.unitPrice *
                                                            item.quantity,
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {formatPrice(item.unitPrice)} each
                                                    </p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddItemsToCart}
                                        disabled={isAddingItems}
                                        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                    >
                                        {isAddingItems
                                            ? 'Adding items…'
                                            : 'Add these items to cart'}
                                    </button>
                                </section>

                                <section
                                    aria-labelledby="delivery-details-heading"
                                    className="rounded-2xl border border-border bg-surface p-5 sm:p-7"
                                >
                                    <h2
                                        id="delivery-details-heading"
                                        className="text-xl font-bold"
                                    >
                                        Delivery details
                                    </h2>

                                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Recipient
                                            </p>

                                            <p className="mt-2 text-sm font-semibold">
                                                {order.deliveryAddress.fullName}
                                            </p>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {order.deliveryAddress.phone}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Delivery address
                                            </p>

                                            <p className="mt-2 text-sm font-semibold">
                                                {order.deliveryAddress.address}
                                            </p>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {order.deliveryAddress.city}
                                                {order.deliveryAddress.postalCode
                                                    ? `, ${order.deliveryAddress.postalCode}`
                                                    : ''}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Delivery option
                                            </p>

                                            <p className="mt-2 text-sm font-semibold">
                                                {order.deliveryMethod === 'express'
                                                    ? 'Express delivery'
                                                    : 'Standard delivery'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Payment method
                                            </p>

                                            <p className="mt-2 text-sm font-semibold">
                                                {order.paymentMethod === 'card'
                                                    ? 'Bank card'
                                                    : 'Cash on delivery'}
                                            </p>

                                            <span
                                                className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                                    order.paymentStatus === 'paid'
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                                        : order.paymentStatus === 'failed'
                                                            ? 'border-red-200 bg-red-50 text-red-800'
                                                            : order.paymentStatus === 'refunded'
                                                                ? 'border-violet-200 bg-violet-50 text-violet-800'
                                                                : 'border-amber-200 bg-amber-50 text-amber-800'
                                                }`}
                                            >
                                                {paymentLabels[order.paymentStatus]}
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <aside className="rounded-2xl border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-40">
                                <h2 className="text-lg font-bold">
                                    Order summary
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Order {order.orderNumber}
                                </p>

                                <div className="mt-5 space-y-4 border-b border-border pb-5 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-muted-foreground">
                                            Subtotal
                                        </span>

                                        <span className="font-medium tabular-nums">
                                            {formatPrice(order.subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-muted-foreground">
                                            Shipping
                                        </span>

                                        <span className="font-medium tabular-nums">
                                            {formatPrice(order.shipping)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between gap-4">
                                    <span className="font-semibold">
                                        Total
                                    </span>

                                    <span className="text-xl font-bold tabular-nums">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>

                                <div className="mt-6 rounded-xl bg-surface-muted p-4">
                                    <p className="text-xs font-semibold text-foreground">
                                        Order date
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {formatOrderDate(order.createdAt)}
                                    </p>
                                </div>

                                <Link
                                    href="/account/orders"
                                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                                >
                                    Back to order history
                                </Link>

                                <Link
                                    href="/marketplace"
                                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:border-accent hover:bg-surface-muted"
                                >
                                    Continue shopping
                                </Link>
                            </aside>
                        </div>
                    </>
                )}
            </div>

            <MarketplaceFooter />
        </main>
    );
}