import Link from 'next/link';

type Props = {
    onBrowseProducts: () => void;
};

export default function MarketplaceHero({ onBrowseProducts }: Props) {
    return (
        <section className="overflow-hidden">
            <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 sm:text-sm">
                        <span
                            aria-hidden="true"
                            className="size-2 rounded-full bg-blue-600"
                        />
                        One marketplace, many independent stores
                    </div>

                    <h1 className="mt-7 text-5xl font-bold leading-[1.06] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
                        Find your next
                        <span className="block text-accent">
                            favourite thing.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                        Explore products from independent stores, discover
                        new brands, and find things that fit your life — all
                        in one place.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={onBrowseProducts}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                            Explore products
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
                        </button>

                        <Link
                            href="/stores"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                            Discover stores
                        </Link>
                    </div>

                    <div className="mt-10 grid max-w-lg grid-cols-2 gap-5 border-t border-border pt-6">
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="size-5 text-accent"
                                >
                                    <path
                                        d="m5 12 4 4L19 6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Discover more
                            </div>
                            <p className="mt-1 pl-7 text-xs leading-5 text-muted-foreground sm:text-sm">
                                Products across different categories
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="size-5 text-accent"
                                >
                                    <path
                                        d="M3 10.5 12 4l9 6.5V20H3v-9.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9 20v-6h6v6"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Shop independent
                            </div>
                            <p className="mt-1 pl-7 text-xs leading-5 text-muted-foreground sm:text-sm">
                                Explore stores with their own identity
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
                    <div
                        aria-hidden="true"
                        className="absolute -right-8 -top-8 size-40 rounded-full bg-blue-100/70 blur-3xl sm:size-56"
                    />

                    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-muted p-2 shadow-sm sm:p-3">
                        <div className="relative aspect-[4/4.3] overflow-hidden rounded-2xl bg-slate-200 sm:aspect-[5/4.2]">
                            <div
                                role="img"
                                aria-label="A curated collection of contemporary lifestyle products"
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.03]"
                                style={{
                                    backgroundImage:
                                        "url('https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1400&q=85')",
                                }}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/5 to-slate-950/10" />

                            <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3 sm:left-6 sm:right-6 sm:top-6">
                                <div className="rounded-xl border border-white/30 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                                        The SellSpace edit
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        Made for discovery
                                    </p>
                                </div>

                                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-sm">
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="size-5"
                                    >
                                        <path
                                            d="M7 17 17 7M7 7h10v10"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-8 sm:left-8 sm:right-8">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                                    One destination
                                </p>
                                <h2 className="mt-2 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                                    A little something for everyone.
                                </h2>
                                <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
                                    Browse different products and meet the
                                    stores behind them.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-5 right-4 hidden rounded-2xl border border-border bg-surface p-4 shadow-lg sm:block lg:-right-5">
                        <p className="text-xs font-medium text-muted-foreground">
                            Your next discovery
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                            Starts right here.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}