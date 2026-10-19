import Link from 'next/link';

import type { MarketplaceProduct } from '@/types/marketplace';

import ProductCard from './ProductCard';

type Props = {
    products: MarketplaceProduct[];
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    sort: string;
    onSortChange: (sort: string) => void;
    onClearFilters: () => void;
};

export default function ProductGrid({
                                        products,
                                        categories,
                                        selectedCategory,
                                        onSelectCategory,
                                        sort,
                                        onSortChange,
                                        onClearFilters,
                                    }: Props) {
    return (
        <section
            id="products"
            aria-labelledby="products-heading"
            className="mx-auto max-w-[1440px] scroll-mt-40 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-accent">
                        Handpicked for discovery
                    </p>

                    <h2
                        id="products-heading"
                        className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                    >
                        Find something you love
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Explore products from independent stores across
                        SellSpace.
                    </p>
                </div>

                <Link
                    href="/marketplace"
                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent-hover"
                >
                    View all products
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="size-4"
                    >
                        <path
                            d="M4 10h12m-5-5 5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-b border-border pb-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
                <nav
                    aria-label="Filter products by category"
                    className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
                >
                    {categories.map((category) => {
                        const isSelected =
                            selectedCategory === category;

                        return (
                            <button
                                key={category}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() =>
                                    onSelectCategory(category)
                                }
                                className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                                    isSelected
                                        ? 'bg-accent text-white'
                                        : 'border border-border bg-surface text-muted-foreground hover:border-accent/40 hover:text-foreground'
                                }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </nav>

                <label className="flex shrink-0 items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                        Sort by
                    </span>

                    <select
                        aria-label="Sort products"
                        value={sort}
                        onChange={(event) =>
                            onSortChange(event.target.value)
                        }
                        className="min-h-10 max-w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
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

            <div className="mt-6 flex items-center justify-between gap-4">
                <p
                    aria-live="polite"
                    className="text-sm text-muted-foreground"
                >
                    {products.length}{' '}
                    {products.length === 1 ? 'product' : 'products'}
                    {selectedCategory !== 'All products' &&
                        ` in ${selectedCategory}`}
                </p>

                {selectedCategory !== 'All products' && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="text-sm font-medium text-accent underline decoration-accent/30 underline-offset-4 transition hover:text-accent-hover"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {products.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface-muted px-5 py-16 text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-surface text-muted-foreground">
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

                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                        No products found
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                        Try another category or clear your filters to
                        discover more products.
                    </p>

                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="mt-5 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            <p className="mt-8 text-center text-xs text-muted-foreground">
                Product listings currently use sample data for development.
            </p>
        </section>
    );
}