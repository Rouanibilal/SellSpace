import Link from 'next/link';

type Props = {
    isLoading: boolean;
    isSeller: boolean;
    isCustomer: boolean;
    isBecomingSeller: boolean;
    onBecomeSeller: () => void;
    message: string | null;
};

export default function BecomeSellerSection({
                                                isLoading,
                                                isSeller,
                                                isCustomer,
                                                isBecomingSeller,
                                                onBecomeSeller,
                                                message,
                                            }: Props) {
    return (
        <section
            aria-labelledby="become-seller-heading"
            className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-muted">
                <div
                    aria-hidden="true"
                    className="absolute -right-20 -top-24 size-72 rounded-full bg-blue-200/40 blur-3xl"
                />

                <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-center md:gap-12 md:p-14">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="size-4"
                            >
                                <path
                                    d="M10 2v16M2 10h16"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />
                            </svg>
                            For independent sellers
                        </div>

                        <h2
                            id="become-seller-heading"
                            className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                        >
                            Have something worth sharing?
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                            Bring your products to SellSpace, create your
                            own storefront, and help customers discover
                            what makes your business different.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="size-4 text-accent"
                                >
                                    <path
                                        d="m4 10 4 4 8-8"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Your own store
                            </span>

                            <span className="inline-flex items-center gap-2">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="size-4 text-accent"
                                >
                                    <path
                                        d="m4 10 4 4 8-8"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Your own products
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:min-w-[210px] md:items-stretch">
                        {isLoading ? (
                            <div
                                role="status"
                                className="inline-flex min-h-12 items-center gap-3 text-sm text-muted-foreground"
                            >
                                <span className="size-4 animate-spin rounded-full border-2 border-border border-t-accent" />
                                Loading your account…
                            </div>
                        ) : isSeller ? (
                            <Link
                                href="/seller"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                            >
                                Seller dashboard
                                <span aria-hidden="true">↗</span>
                            </Link>
                        ) : isCustomer ? (
                            <button
                                type="button"
                                onClick={onBecomeSeller}
                                disabled={isBecomingSeller}
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isBecomingSeller
                                    ? 'Setting up your account…'
                                    : 'Become a seller'}
                                {!isBecomingSeller && (
                                    <span aria-hidden="true">→</span>
                                )}
                            </button>
                        ) : (
                            <Link
                                href="/register"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                            >
                                Start selling
                                <span aria-hidden="true">→</span>
                            </Link>
                        )}

                        <p className="text-xs leading-5 text-muted-foreground md:text-center">
                            Start building your storefront.
                        </p>
                    </div>
                </div>
            </div>

            {message && (
                <p
                    role="alert"
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {message}
                </p>
            )}
        </section>
    );
}