'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth-provider';

import {
    marketplaceCategories,
    mockMarketplaceProducts,
    mockMarketplaceStores,
} from '@/data/mock-marketplace';

import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';
import ProductCard from '@/components/marketplace/ProductCard';

type Props = {
    slug: string;
};

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name';

export default function Storefront({ slug }: Props) {
    const router = useRouter();
    const { user, isLoading, signOut } = useAuth();

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] =
        useState('All products');
    const [sort, setSort] = useState<SortOption>('featured');
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const store = mockMarketplaceStores.find(
        (item) => item.slug === slug,
    );

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    const storeProducts = useMemo(
        () =>
            mockMarketplaceProducts.filter(
                (product) => product.storeSlug === slug,
            ),
        [slug],
    );

    const storeCategories = useMemo(
        () => [
            'All products',
            ...Array.from(
                new Set(storeProducts.map((product) => product.category)),
            ).sort(),
        ],
        [storeProducts],
    );

    const visibleProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        const filtered = storeProducts.filter((product) => {
            const matchesSearch =
                !term ||
                product.name.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term);

            const matchesCategory =
                selectedCategory === 'All products' ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        switch (sort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;

            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;

            case 'name':
                filtered.sort((a, b) =>
                    a.name.localeCompare(b.name),
                );
                break;

            default:
                filtered.sort(
                    (a, b) => Number(b.featured) - Number(a.featured),
                );
                break;
        }

        return filtered;
    }, [storeProducts, search, selectedCategory, sort]);

    function browseProducts() {
        document.getElementById('store-products')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    function handleHeaderCategory(category: string) {
        if (storeCategories.includes(category)) {
            setSelectedCategory(category);
            browseProducts();
        } else {
            router.push(
                `/marketplace?category=${encodeURIComponent(category)}`,
            );
        }
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

    if (!store) {
        return (
            <main className="flex min-h-screen flex-col bg-background text-foreground">
                <section className="mx-auto flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold">
                        We couldn&apos;t find this store.
                    </h1>

                    <p className="mt-3 text-sm text-muted-foreground">
                        The store may have moved or the address may be incorrect.
                    </p>

                    <Link
                        href="/stores"
                        className="mt-6 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
                    >
                        Browse all stores
                    </Link>
                </section>

                <MarketplaceFooter />
            </main>
        );
    }

    const featuredCount = storeProducts.filter(
        (product) => product.featured,
    ).length;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <MarketplaceHeader
                categories={marketplaceCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleHeaderCategory}
                search={search}
                onSearchChange={setSearch}
                onBrowseProducts={browseProducts}
                user={user}
                isLoading={isLoading}
                isSeller={isSeller}
                isSigningOut={isSigningOut}
                onSignOut={() => void handleSignOut()}
            />

            <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
                <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
                >
                    <Link href="/" className="hover:text-accent">
                        Home
                    </Link>

                    <span aria-hidden="true">/</span>

                    <Link href="/stores" className="hover:text-accent">
                        Stores
                    </Link>

                    <span aria-hidden="true">/</span>

                    <span className="font-medium text-foreground">
                        {store.name}
                    </span>
                </nav>
            </div>

            <section className="mx-auto max-w-[1440px] px-4 pb-8 pt-5 sm:px-6 lg:px-8">
                <div className="relative isolate min-h-[230px] overflow-hidden rounded-2xl border border-border bg-surface-muted sm:min-h-[300px]">
                    <div
                        role="img"
                        aria-label={`${store.name} storefront cover`}
                        className="absolute inset-0 -z-20 bg-cover bg-center"
                        style={{
                            backgroundColor: store.color,
                            backgroundImage: `url("${store.coverImageUrl}")`,
                        }}
                    />

                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/75 via-slate-950/45 to-slate-950/10" />

                    <div className="flex min-h-[230px] flex-col justify-end p-5 text-white sm:min-h-[300px] sm:p-9 lg:p-12">
                        {store.featured && (
                            <span className="mb-4 inline-flex w-fit rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                                Featured store
                            </span>
                        )}

                        <div className="flex flex-wrap items-end justify-between gap-5">
                            <div className="max-w-2xl">
                                <p className="text-sm font-semibold text-white/80">
                                    {store.category}
                                </p>

                                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                    {store.name}
                                </h1>

                                <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
                                    {store.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/15 px-4 py-3 backdrop-blur-sm">
                                <span
                                    className="text-xl text-amber-300"
                                    aria-hidden="true"
                                >
                                    ★
                                </span>

                                <div>
                                    <p className="text-sm font-bold">
                                        {store.rating.toFixed(1)} / 5
                                    </p>

                                    <p className="text-xs text-white/75">
                                        {store.reviewCount} sample reviews
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-surface p-4">
                        <p className="text-xl font-bold">
                            {storeProducts.length}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                            Products in this demo
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface p-4">
                        <p className="text-xl font-bold">
                            {storeCategories.length - 1}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                            Product categories
                        </p>
                    </div>

                    <div className="col-span-2 rounded-xl border border-border bg-surface p-4 sm:col-span-1">
                        <p className="text-xl font-bold">
                            {featuredCount}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                            Featured products
                        </p>
                    </div>
                </div>
            </section>

            {message && (
                <p
                    role="alert"
                    className="mx-auto max-w-[1408px] px-4 text-sm text-red-600 sm:px-6 lg:px-8"
                >
                    {message}
                </p>
            )}

            <section
                id="store-products"
                aria-labelledby="store-products-heading"
                className="mx-auto max-w-[1440px] scroll-mt-40 px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-accent">
                            Explore the collection
                        </p>

                        <h2
                            id="store-products-heading"
                            className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
                        >
                            Shop {store.name}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Browse products selected from this store.
                        </p>
                    </div>

                    <label className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">
                            Sort by
                        </span>

                        <select
                            value={sort}
                            onChange={(event) =>
                                setSort(event.target.value as SortOption)
                            }
                            className="min-h-10 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                        >
                            <option value="featured">Recommended</option>
                            <option value="price-low">
                                Price: low to high
                            </option>
                            <option value="price-high">
                                Price: high to low
                            </option>
                            <option value="name">Name: A to Z</option>
                        </select>
                    </label>
                </div>

                {storeCategories.length > 2 && (
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                        {storeCategories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                aria-pressed={selectedCategory === category}
                                onClick={() => setSelectedCategory(category)}
                                className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                    selectedCategory === category
                                        ? 'bg-accent text-white'
                                        : 'border border-border bg-surface text-muted-foreground hover:border-accent/50 hover:text-accent'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                <p
                    aria-live="polite"
                    className="mt-5 text-sm text-muted-foreground"
                >
                    {visibleProducts.length}{' '}
                    {visibleProducts.length === 1 ? 'product' : 'products'} found
                </p>

                {visibleProducts.length > 0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
                        {visibleProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-border bg-surface-muted px-5 py-14 text-center">
                        <h3 className="text-lg font-semibold">
                            No products found
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Try a different search or category.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSelectedCategory('All products');
                                setSort('featured');
                            }}
                            className="mt-5 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                <div className="mt-12 border-t border-border pt-6">
                    <Link
                        href="/stores"
                        className="text-sm font-semibold text-accent hover:text-accent-hover"
                    >
                        ← Explore other stores
                    </Link>

                    <span
                        className="mx-3 text-border"
                        aria-hidden="true"
                    >
                        |
                    </span>

                    <Link
                        href="/marketplace"
                        className="text-sm font-semibold text-accent hover:text-accent-hover"
                    >
                        Browse all products →
                    </Link>
                </div>
            </section>

            <MarketplaceFooter />
        </main>
    );
}