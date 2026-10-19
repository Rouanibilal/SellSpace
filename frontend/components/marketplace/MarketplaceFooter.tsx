import Link from 'next/link';

export default function MarketplaceFooter() {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
                <Link
                    href="/"
                    className="text-2xl font-bold tracking-[-0.08em]"
                >
                    sellspace<span className="text-accent">.</span>
                </Link>

                <p className="text-sm text-muted-foreground">
                    One marketplace, many ways to discover.
                </p>

                <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                    <Link href="#products" className="hover:text-black">
                        Shop
                    </Link>
                    <Link href="#stores" className="hover:text-black">
                        Stores
                    </Link>
                    <Link href="/login" className="hover:text-black">
                        Account
                    </Link>
                </div>
            </div>
        </footer>
    );
}