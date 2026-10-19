import Link from 'next/link';

import type { MarketplaceStore } from '@/types/marketplace';

type Props = {
    stores: MarketplaceStore[];
};

export default function StoreSection({ stores }: Props) {
    const featuredStores = stores.filter((store) => store.featured);

    return (
        <section
            id="stores"
            aria-labelledby="stores-heading"
            className="border-y border-border bg-surface-muted"
        >
            <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-accent">
                            Meet the sellers
                        </p>

                        <h2
                            id="stores-heading"
                            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                        >
                            Stores worth discovering
                        </h2>
                    </div>

                    <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                        Explore independent stores, discover their
                        collections, and find sellers whose style matches
                        yours.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredStores.map((store) => (
                        <article
                            key={store.slug}
                            className="group min-w-0 overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5"
                        >
                            <Link
                                href={`/store/${store.slug}`}
                                aria-label={`Visit ${store.name}`}
                                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                            >
                                <div className="relative aspect-[5/3] overflow-hidden">
                                    <div
                                        role="img"
                                        aria-label={`${store.name} store cover`}
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                        style={{
                                            backgroundColor: store.color,
                                            backgroundImage: `url("${store.coverImageUrl}")`,
                                        }}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

                                    <div className="absolute bottom-3 left-3 flex size-12 items-center justify-center rounded-xl border border-white/70 bg-white/95 text-sm font-bold tracking-tight text-foreground shadow-sm">
                                        {store.initials}
                                    </div>

                                    {store.featured && (
                                        <span className="absolute right-3 top-3 rounded-full border border-white/60 bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-base font-semibold text-foreground transition group-hover:text-accent">
                                                {store.name}
                                            </h3>

                                            <p className="mt-1 text-xs font-medium text-accent">
                                                {store.category}
                                            </p>
                                        </div>

                                        <span
                                            aria-hidden="true"
                                            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                                        >
                                            <svg
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
                                        </span>
                                    </div>

                                    <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                                        {store.description}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                                        <span className="inline-flex items-center gap-1.5">
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="size-4 text-amber-500"
                                            >
                                                <path d="m10 1.5 2.55 5.17 5.7.83-4.12 4.02.97 5.68L10 14.52l-5.1 2.68.97-5.68L1.75 7.5l5.7-.83L10 1.5Z" />
                                            </svg>

                                            <span className="font-semibold text-foreground">
                                                {store.rating.toFixed(1)}
                                            </span>

                                            <span>
                                                ({store.reviewCount})
                                            </span>
                                        </span>

                                        <span className="whitespace-nowrap">
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

                <div className="mt-8 flex justify-center">
                    <Link
                        href="/stores"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
                    >
                        Explore all stores
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
            </div>
        </section>
    );
}