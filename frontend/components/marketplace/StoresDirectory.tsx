'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@/components/auth-provider';
import { marketplaceCategories, mockMarketplaceStores } from '@/data/mock-marketplace';

import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';

export default function StoresDirectory() {
    const { user, isLoading, signOut } = useAuth();

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All stores');
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    const categories = ['All stores', ...marketplaceCategories.filter(
        (category) => category !== 'All products',
    )];

    const visibleStores = useMemo(() => {
        const term = search.trim().toLowerCase();

        return mockMarketplaceStores
            .filter((store) => {
                const matchesSearch =
                    !term ||
                    store.name.toLowerCase().includes(term) ||
                    store.description.toLowerCase().includes(term) ||
                    store.category.toLowerCase().includes(term);

                const matchesCategory =
                    selectedCategory === 'All stores' ||
                    store.category === selectedCategory;

                return matchesSearch && matchesCategory;
            })
            .sort(
                (a, b) =>
                    Number(b.featured) - Number(a.featured) ||
                    a.name.localeCompare(b.name),
            );
    }, [search, selectedCategory]);

    function browseStores() {
        document.getElementById('store-list')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    function clearFilters() {
        setSearch('');
        setSelectedCategory('All stores');
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
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                search={search}
                onSearchChange={setSearch}
                onBrowseProducts={browseStores}
                user={user}
                isLoading={isLoading}
                isSeller={isSeller}
                isSigningOut={isSigningOut}
                onSignOut={() => void handleSignOut()}
            />

            <section className="border-b border-border bg-surface">
                <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                    <nav
                        aria-label="Breadcrumb"
                        className="text-sm text-muted-foreground"
                    >
                        <Link href="/" className="transition hover:text-accent">
                            Home
                        </Link>
                        <span className="mx-2" aria-hidden="true">/</span>
                        <span className="font-medium text-foreground">
                            Stores
                        </span>
                    </nav>

                    <div className="mt-6 max-w-3xl">
                        <p className="text-sm font-semibold text-accent">
                            Meet the sellers
                        </p>

                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            Discover your next favourite store.
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                            Every store has its own identity and collection.
                            Explore independent sellers and find products
                            that fit your style.
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-3">
                        <div className="rounded-xl border border-border bg-background p-4">
                            <p className="text-2xl font-bold text-foreground">
                                {mockMarketplaceStores.length}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                Sample stores
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-background p-4">
                            <p className="text-2xl font-bold text-foreground">
                                {categories.length - 1}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                Categories
                            </p>
                        </div>

                        <div className="col-span-2 rounded-xl border border-border bg-background p-4 sm:col-span-1">
                            <p className="text-2xl font-bold text-foreground">
                                One place
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                Many independent shops
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {message && (
                <p role="alert" className="mx-auto max-w-[1408px] px-4 pt-4 text-sm text-red-600 sm:px-6 lg:px-8">
                    {message}
                </p>
            )}

            <section
                id="store-list"
                aria-labelledby="store-list-heading"
                className="mx-auto max-w-[1440px] scroll-mt-40 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
            >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2
                            id="store-list-heading"
                            className="text-2xl font-bold tracking-tight sm:text-3xl"
                        >
                            Explore stores
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Search shops or browse by category.
                        </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {visibleStores.length}{' '}
                        {visibleStores.length === 1 ? 'store' : 'stores'} found
                    </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {categories.map((category) => {
                        const selected = selectedCategory === category;

                        return (
                            <button
                                key={category}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setSelectedCategory(category)}
                                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                    selected
                                        ? 'bg-accent text-white'
                                        : 'border border-border bg-surface hover:border-accent/50 hover:text-accent'
                                }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>

                {visibleStores.length > 0 ? (
                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {visibleStores.map((store) => (
                            <article
                                key={store.slug}
                                className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5"
                            >
                                <Link
                                    href={`/store/${store.slug}`}
                                    aria-label={`Visit ${store.name}`}
                                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                                >
                                    <div className="relative aspect-[5/3] overflow-hidden bg-surface-muted">
                                        <div
                                            role="img"
                                            aria-label={`${store.name} cover`}
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                            style={{
                                                backgroundColor: store.color,
                                                backgroundImage: `url("${store.coverImageUrl}")`,
                                            }}
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                                        <span className="absolute bottom-3 left-3 flex size-12 items-center justify-center rounded-xl border border-white/70 bg-white/95 text-sm font-bold text-foreground shadow-sm">
                                            {store.initials}
                                        </span>

                                        {store.featured && (
                                            <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-accent">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="truncate text-lg font-semibold text-foreground transition group-hover:text-accent">
                                                    {store.name}
                                                </h3>

                                                <p className="mt-1 text-sm font-medium text-accent">
                                                    {store.category}
                                                </p>
                                            </div>

                                            <span
                                                aria-hidden="true"
                                                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                                            >
                                                →
                                            </span>
                                        </div>

                                        <p className="mt-3 min-h-10 text-sm leading-5 text-muted-foreground">
                                            {store.description}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="text-amber-500" aria-hidden="true">
                                                    ★
                                                </span>
                                                <span className="font-semibold text-foreground">
                                                    {store.rating.toFixed(1)}
                                                </span>
                                                <span>
                                                    ({store.reviewCount})
                                                </span>
                                            </span>

                                            <span>
                                                {store.productCount}{' '}
                                                {store.productCount === 1
                                                    ? 'product'
                                                    : 'products'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface-muted px-5 py-16 text-center">
                        <h3 className="text-lg font-semibold">
                            No stores found
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Try another name or choose a different category.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>

            <MarketplaceFooter />
        </main>
    );
}