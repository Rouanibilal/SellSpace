'use client';

import { useMemo, useState } from 'react';

import { useAuth } from '@/components/auth-provider';

import {
    marketplaceCategories,
    mockMarketplaceProducts,
} from '@/data/mock-marketplace';

import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import ProductGrid from '@/components/marketplace/ProductGrid';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';

type Props = {
    initialSearch: string;
    initialCategory: string;
    initialSort: string;
};

const validSortOptions = [
    'featured',
    'price-low',
    'price-high',
    'name',
];

export default function MarketplaceCatalog({
                                               initialSearch,
                                               initialCategory,
                                               initialSort,
                                           }: Props) {
    const { user, isLoading, signOut } = useAuth();

    const [search, setSearch] = useState(initialSearch);

    const [selectedCategory, setSelectedCategory] = useState(
        marketplaceCategories.includes(initialCategory)
            ? initialCategory
            : 'All products',
    );

    const [sort, setSort] = useState(
        validSortOptions.includes(initialSort)
            ? initialSort
            : 'featured',
    );

    const [priceRange, setPriceRange] = useState('all');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [accountMessage, setAccountMessage] = useState<string | null>(
        null,
    );

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    const visibleProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        const filtered = mockMarketplaceProducts.filter((product) => {
            const matchesSearch =
                !term ||
                product.name.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term) ||
                product.store.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term);

            const matchesCategory =
                selectedCategory === 'All products' ||
                product.category === selectedCategory;

            let matchesPrice = true;

            switch (priceRange) {
                case 'under-200':
                    matchesPrice = product.price < 200;
                    break;

                case '200-500':
                    matchesPrice =
                        product.price >= 200 && product.price <= 500;
                    break;

                case '500-1000':
                    matchesPrice =
                        product.price > 500 && product.price <= 1000;
                    break;

                case 'over-1000':
                    matchesPrice = product.price > 1000;
                    break;
            }

            const matchesStock = !inStockOnly || product.inStock;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice &&
                matchesStock
            );
        });

        switch (sort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;

            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;

            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;

            default:
                filtered.sort(
                    (a, b) => Number(b.featured) - Number(a.featured),
                );
                break;
        }

        return filtered;
    }, [search, selectedCategory, sort, priceRange, inStockOnly]);

    function clearFilters() {
        setSearch('');
        setSelectedCategory('All products');
        setSort('featured');
        setPriceRange('all');
        setInStockOnly(false);
    }

    function browseProducts() {
        document.getElementById('products')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    async function handleSignOut() {
        setAccountMessage(null);
        setIsSigningOut(true);

        try {
            await signOut();
        } catch {
            setAccountMessage('Unable to log out. Please try again.');
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <MarketplaceHeader
                categories={marketplaceCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
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
                        <span>Home</span>
                        <span className="mx-2" aria-hidden="true">
                            /
                        </span>
                        <span className="font-medium text-foreground">
                            Marketplace
                        </span>
                    </nav>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-accent">
                                The SellSpace marketplace
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                                Find your next favourite.
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                Explore products across categories and
                                discover the independent stores behind
                                them.
                            </p>
                        </div>

                        <p className="shrink-0 text-sm text-muted-foreground">
                            {visibleProducts.length}{' '}
                            {visibleProducts.length === 1
                                ? 'product'
                                : 'products'}{' '}
                            found
                        </p>
                    </div>
                </div>
            </section>

            <section
                aria-label="Additional product filters"
                className="border-b border-border bg-background"
            >
                <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:px-6 lg:px-8">
                    <label className="flex items-center gap-3 text-sm">
                        <span className="shrink-0 font-medium text-foreground">
                            Price
                        </span>

                        <select
                            value={priceRange}
                            onChange={(event) =>
                                setPriceRange(event.target.value)
                            }
                            className="min-h-10 min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                        >
                            <option value="all">Any price</option>
                            <option value="under-200">
                                Under 200 MAD
                            </option>
                            <option value="200-500">
                                200–500 MAD
                            </option>
                            <option value="500-1000">
                                501–1,000 MAD
                            </option>
                            <option value="over-1000">
                                Over 1,000 MAD
                            </option>
                        </select>
                    </label>

                    <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm text-foreground">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(event) =>
                                setInStockOnly(event.target.checked)
                            }
                            className="size-4 rounded border-border accent-blue-600 focus:ring-accent"
                        />
                        In-stock products only
                    </label>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex min-h-10 w-fit items-center rounded-lg px-3 text-sm font-medium text-accent transition hover:bg-surface-muted hover:text-accent-hover"
                    >
                        Reset filters
                    </button>
                </div>
            </section>

            {accountMessage && (
                <div
                    role="alert"
                    className="mx-auto mt-4 max-w-[1408px] px-4 text-sm text-red-600 sm:px-6 lg:px-8"
                >
                    {accountMessage}
                </div>
            )}

            <ProductGrid
                products={visibleProducts}
                categories={marketplaceCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                sort={sort}
                onSortChange={setSort}
                onClearFilters={clearFilters}
            />

            <MarketplaceFooter />
        </main>
    );
}