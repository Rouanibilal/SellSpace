'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth-provider';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';

import {
    getCartSnapshot,
    parseCartSnapshot,
    subscribeToCart,
} from '@/lib/cart';

import { formatPrice } from '@/lib/format-price';

import {
    marketplaceCategories,
    mockMarketplaceProducts,
} from '@/data/mock-marketplace';

type DeliveryMethod = 'standard' | 'express';
type PaymentMethod = 'cash' | 'card';

export default function Checkout() {
    const router = useRouter();
    const { user, isLoading, signOut } = useAuth();

    const snapshot = useSyncExternalStore(
        subscribeToCart,
        getCartSnapshot,
        () => '',
    );

    const items = useMemo(
        () => parseCartSnapshot(snapshot),
        [snapshot],
    );

    const cartLines = useMemo(
        () =>
            items.flatMap((item) => {
                const product = mockMarketplaceProducts.find(
                    (candidate) => candidate.id === item.productId,
                );

                return product
                    ? [{
                        ...item,
                        product,
                        total: product.price * item.quantity,
                    }]
                    : [];
            }),
        [items],
    );

    const subtotal = cartLines.reduce(
        (total, item) => total + item.total,
        0,
    );

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [deliveryMethod, setDeliveryMethod] =
        useState<DeliveryMethod>('standard');
    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>('cash');
    const [reviewing, setReviewing] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    const shipping = deliveryMethod === 'standard' ? 35 : 60;
    const total = subtotal + shipping;

    function browseProducts() {
        router.push('/marketplace');
    }

    function handleCategory(category: string) {
        const params = new URLSearchParams();

        if (category !== 'All products') {
            params.set('category', category);
        }

        const query = params.toString();

        router.push(`/marketplace${query ? `?${query}` : ''}`);
    }

    async function handleSignOut() {
        setIsSigningOut(true);

        try {
            await signOut();
        } finally {
            setIsSigningOut(false);
        }
    }

    function handleReviewOrder(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setNotice(null);
        setReviewing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleDemoOrder() {
        setNotice(
            'Design preview only. No order was placed and no personal information was sent or saved.',
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <MarketplaceHeader
                categories={marketplaceCategories}
                selectedCategory="All products"
                onSelectCategory={handleCategory}
                search=""
                onSearchChange={() => {}}
                onBrowseProducts={browseProducts}
                user={user}
                isLoading={isLoading}
                isSeller={isSeller}
                isSigningOut={isSigningOut}
                onSignOut={() => void handleSignOut()}
            />

            <section className="border-b border-border bg-surface">
                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    <nav
                        aria-label="Breadcrumb"
                        className="text-sm text-muted-foreground"
                    >
                        <Link href="/" className="hover:text-accent">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <Link
                            href="/cart"
                            className="hover:text-accent"
                        >
                            Cart
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="font-medium text-foreground">
                            Checkout
                        </span>
                    </nav>

                    <p className="mt-6 text-sm font-semibold text-accent">
                        Almost there
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        {reviewing ? 'Review your order' : 'Checkout'}
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                        {reviewing
                            ? 'Double-check your delivery details and order summary.'
                            : 'Enter your delivery details and choose how you would like to pay.'}
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {cartLines.length === 0 ? (
                    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
                        <h2 className="text-xl font-bold">
                            Your cart is empty
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Add some products before proceeding to checkout.
                        </p>

                        <Link
                            href="/marketplace"
                            className="mt-6 inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
                        >
                            Browse products
                        </Link>
                    </div>
                ) : (
                    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
                        <div className="min-w-0">
                            {reviewing ? (
                                <section className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
                                    <div className="flex items-center justify-between gap-4">
                                        <h2 className="text-xl font-bold">
                                            Delivery details
                                        </h2>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReviewing(false);
                                                setNotice(null);
                                            }}
                                            className="text-sm font-semibold text-accent hover:text-accent-hover"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <dl className="mt-6 space-y-4 text-sm">
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Full name
                                            </dt>
                                            <dd className="mt-1 font-medium">
                                                {fullName}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-muted-foreground">
                                                Email
                                            </dt>
                                            <dd className="mt-1 font-medium">
                                                {email}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-muted-foreground">
                                                Phone
                                            </dt>
                                            <dd className="mt-1 font-medium">
                                                {phone}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-muted-foreground">
                                                Delivery address
                                            </dt>
                                            <dd className="mt-1 font-medium leading-6">
                                                {address}
                                                <br />
                                                {city}
                                                {postalCode
                                                    ? `, ${postalCode}`
                                                    : ''}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-muted-foreground">
                                                Delivery method
                                            </dt>
                                            <dd className="mt-1 font-medium">
                                                {deliveryMethod === 'standard'
                                                    ? 'Standard delivery'
                                                    : 'Express delivery'}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-muted-foreground">
                                                Payment method
                                            </dt>
                                            <dd className="mt-1 font-medium">
                                                {paymentMethod === 'cash'
                                                    ? 'Cash on delivery'
                                                    : 'Bank card'}
                                            </dd>
                                        </div>
                                    </dl>

                                    <div className="mt-8 border-t border-border pt-6">
                                        <h3 className="font-semibold">
                                            Items in your order
                                        </h3>

                                        <div className="mt-4 space-y-4">
                                            {cartLines.map((item) => (
                                                <div
                                                    key={item.productId}
                                                    className="flex justify-between gap-4 text-sm"
                                                >
                                                    <span className="text-muted-foreground">
                                                        {item.product.name} ×{' '}
                                                        {item.quantity}
                                                    </span>
                                                    <span className="shrink-0 font-semibold">
                                                        {formatPrice(item.total)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleDemoOrder}
                                        className="mt-8 min-h-12 w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                                    >
                                        Preview place order
                                    </button>

                                    {notice && (
                                        <p
                                            role="status"
                                            className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800"
                                        >
                                            {notice}
                                        </p>
                                    )}
                                </section>
                            ) : (
                                <form
                                    onSubmit={handleReviewOrder}
                                    className="space-y-6"
                                >
                                    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-accent">
                                                1
                                            </span>
                                            <div>
                                                <h2 className="text-xl font-bold">
                                                    Contact information
                                                </h2>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    How can we reach you about your order?
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                            <label className="text-sm font-medium">
                                                Full name
                                                <input
                                                    required
                                                    autoComplete="name"
                                                    value={fullName}
                                                    onChange={(event) =>
                                                        setFullName(event.target.value)
                                                    }
                                                    placeholder="Your full name"
                                                    className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                                                />
                                            </label>

                                            <label className="text-sm font-medium">
                                                Email address
                                                <input
                                                    required
                                                    type="email"
                                                    autoComplete="email"
                                                    value={email}
                                                    onChange={(event) =>
                                                        setEmail(event.target.value)
                                                    }
                                                    placeholder="you@example.com"
                                                    className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                                                />
                                            </label>

                                            <label className="text-sm font-medium sm:col-span-2">
                                                Phone number
                                                <input
                                                    required
                                                    type="tel"
                                                    autoComplete="tel"
                                                    value={phone}
                                                    onChange={(event) =>
                                                        setPhone(event.target.value)
                                                    }
                                                    placeholder="+212 6XX-XXXXXX"
                                                    className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                                                />
                                            </label>
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-accent">
                                                2
                                            </span>
                                            <div>
                                                <h2 className="text-xl font-bold">
                                                    Delivery address
                                                </h2>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Where should your products be delivered?
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-5">
                                            <label className="block text-sm font-medium">
                                                Street address
                                                <input
                                                    required
                                                    autoComplete="street-address"
                                                    value={address}
                                                    onChange={(event) =>
                                                        setAddress(event.target.value)
                                                    }
                                                    placeholder="Street, building, apartment"
                                                    className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                                                />
                                            </label>

                                            <div className="grid gap-5 sm:grid-cols-2">
                                                <label className="text-sm font-medium">
                                                    City
                                                    <input
                                                        required
                                                        autoComplete="address-level2"
                                                        value={city}
                                                        onChange={(event) =>
                                                            setCity(event.target.value)
                                                        }
                                                        placeholder="Your city"
                                                        className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                                                    />
                                                </label>

                                                <label className="text-sm font-medium">
                                                    Postal code
                                                    <input
                                                        autoComplete="postal-code"
                                                        value={postalCode}
                                                        onChange={(event) =>
                                                            setPostalCode(event.target.value)
                                                        }
                                                        placeholder="Optional"
                                                        className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-accent">
                                                3
                                            </span>
                                            <div>
                                                <h2 className="text-xl font-bold">
                                                    Delivery method
                                                </h2>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Choose a delivery option.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition has-[:checked]:border-accent has-[:checked]:bg-blue-50/50">
                                                <input
                                                    type="radio"
                                                    name="delivery"
                                                    value="standard"
                                                    checked={deliveryMethod === 'standard'}
                                                    onChange={() =>
                                                        setDeliveryMethod('standard')
                                                    }
                                                    className="mt-1 accent-blue-600"
                                                />
                                                <span className="flex-1">
                                                    <span className="flex flex-wrap justify-between gap-2 text-sm font-semibold">
                                                        Standard delivery
                                                        <span>{formatPrice(35)}</span>
                                                    </span>
                                                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                                        Estimated delivery option for this design preview.
                                                    </span>
                                                </span>
                                            </label>

                                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition has-[:checked]:border-accent has-[:checked]:bg-blue-50/50">
                                                <input
                                                    type="radio"
                                                    name="delivery"
                                                    value="express"
                                                    checked={deliveryMethod === 'express'}
                                                    onChange={() =>
                                                        setDeliveryMethod('express')
                                                    }
                                                    className="mt-1 accent-blue-600"
                                                />
                                                <span className="flex-1">
                                                    <span className="flex flex-wrap justify-between gap-2 text-sm font-semibold">
                                                        Express delivery
                                                        <span>{formatPrice(60)}</span>
                                                    </span>
                                                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                                        An alternative delivery option for the UI preview.
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-accent">
                                                4
                                            </span>
                                            <div>
                                                <h2 className="text-xl font-bold">
                                                    Payment method
                                                </h2>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Choose your preferred option.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition has-[:checked]:border-accent has-[:checked]:bg-blue-50/50">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={paymentMethod === 'cash'}
                                                    onChange={() =>
                                                        setPaymentMethod('cash')
                                                    }
                                                    className="mt-1 accent-blue-600"
                                                />
                                                <span>
                                                    <span className="block text-sm font-semibold">
                                                        Cash on delivery
                                                    </span>
                                                    <span className="mt-1 block text-xs text-muted-foreground">
                                                        Payment option shown for design purposes only.
                                                    </span>
                                                </span>
                                            </label>

                                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition has-[:checked]:border-accent has-[:checked]:bg-blue-50/50">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={paymentMethod === 'card'}
                                                    onChange={() =>
                                                        setPaymentMethod('card')
                                                    }
                                                    className="mt-1 accent-blue-600"
                                                />
                                                <span>
                                                    <span className="block text-sm font-semibold">
                                                        Bank card
                                                    </span>
                                                    <span className="mt-1 block text-xs text-muted-foreground">
                                                        No card information is requested or processed in this preview.
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </section>

                                    <button
                                        type="submit"
                                        className="min-h-12 w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                                    >
                                        Review your order
                                    </button>
                                </form>
                            )}
                        </div>

                        <aside className="rounded-2xl border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-40">
                            <h2 className="text-lg font-bold">
                                Order summary
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {cartLines.length}{' '}
                                {cartLines.length === 1 ? 'product' : 'products'}
                            </p>

                            <div className="mt-5 divide-y divide-border">
                                {cartLines.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex gap-3 py-4 first:pt-0 last:pb-0"
                                    >
                                        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-muted">
                                            <div
                                                role="img"
                                                aria-label={item.product.name}
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{
                                                    backgroundColor: item.product.background,
                                                    backgroundImage: `url("${item.product.imageUrl}")`,
                                                }}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold leading-5">
                                                {item.product.name}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-sm font-semibold">
                                            {formatPrice(item.total)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                                <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span className="font-medium">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground">
                                        Delivery
                                    </span>
                                    <span className="font-medium">
                                        {formatPrice(shipping)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3 border-t border-border pt-4">
                                    <span className="font-bold">
                                        Estimated total
                                    </span>
                                    <span className="text-xl font-bold">
                                        {formatPrice(total)}
                                    </span>
                                </div>

                                <p className="text-xs leading-5 text-muted-foreground">
                                    Shipping charges are illustrative and
                                    will need to be confirmed before launch.
                                </p>
                            </div>

                            <Link
                                href="/cart"
                                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold transition hover:border-accent hover:bg-surface-muted"
                            >
                                Return to cart
                            </Link>
                        </aside>
                    </div>
                )}
            </div>

            <MarketplaceFooter />
        </main>
    );
}