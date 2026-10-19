import type { MarketplaceCategoryTile } from '@/types/marketplace';

type Props = {
    categories: MarketplaceCategoryTile[];
    onSelectCategory: (category: string) => void;
};

export default function CategorySection({
                                            categories,
                                            onSelectCategory,
                                        }: Props) {
    return (
        <section
            aria-labelledby="category-heading"
            className="border-y border-border bg-surface-muted"
        >
            <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-accent">
                            Explore the marketplace
                        </p>

                        <h2
                            id="category-heading"
                            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                        >
                            Shop by category
                        </h2>
                    </div>

                    <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                        Discover products for your everyday life, from
                        technology and fashion to the things that make a
                        house feel like home.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-4">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            type="button"
                            onClick={() =>
                                onSelectCategory(category.name)
                            }
                            aria-label={`Explore ${category.name} products`}
                            className="group min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
                                <div
                                    role="img"
                                    aria-label={category.name}
                                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                                    style={{
                                        backgroundImage: `url('https://images.unsplash.com/${category.image}?auto=format&fit=crop&w=800&q=85')`,
                                    }}
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

                                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                                    <span className="text-sm font-semibold text-white sm:text-base">
                                        {category.name}
                                    </span>

                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-accent transition duration-200 group-hover:bg-accent group-hover:text-white">
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            className="size-4 transition-transform group-hover:translate-x-0.5"
                                        >
                                            <path
                                                d="M4 10h12m-5-5 5 5-5 5"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <p className="mt-3 text-sm leading-5 text-muted-foreground">
                                {category.detail}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}