'use client';

import Link from 'next/link';
import {
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
    type ButtonHTMLAttributes,
    type ReactNode,
    type SVGProps,
} from 'react';

import { useSiteSettings } from '@/components/site-settings-provider';
import { useTheme } from '@/components/theme-provider';
import type { User } from '@/lib/auth';
import {
    getCartSnapshot,
    parseCartSnapshot,
    subscribeToCart,
} from '@/lib/cart';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

/* One place to tune every header transition. */
const motion =
    'transition-all duration-200 ease-out motion-reduce:transition-none ' +
    'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

const outlined =
    'border border-border hover:border-accent hover:bg-surface-muted hover:text-accent';

const iconBox =
    'inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground';

const pillBox =
    'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-foreground sm:px-4';

/* -------------------------------------------------------------------------- */
/* Hooks                                                                      */
/* -------------------------------------------------------------------------- */

function useCartQuantity() {
    const snapshot = useSyncExternalStore(
        subscribeToCart,
        getCartSnapshot,
        () => '',
    );

    return useMemo(
        () =>
            parseCartSnapshot(snapshot).reduce(
                (total, item) => total + item.quantity,
                0,
            ),
        [snapshot],
    );
}

function useScrolled(offset = 8) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > offset);

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [offset]);

    return scrolled;
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const;

function Icon({ className = 'size-5 shrink-0', children, ...props }: IconProps) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            {...props}
        >
            {children}
        </svg>
    );
}

function CartIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.5L21 8H6" {...stroke} />
            <circle cx="10" cy="20" r="1" fill="currentColor" />
            <circle cx="18" cy="20" r="1" fill="currentColor" />
        </Icon>
    );
}

function HeartIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path
                d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                {...stroke}
            />
        </Icon>
    );
}

function MarketplaceIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M3 10v10h18V10M2.5 9l2-6h15l2 6" {...stroke} />
            <path d="M2.5 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6" {...stroke} />
        </Icon>
    );
}

function AccountIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={1.7} />
            <path d="M4 21a8 8 0 0 1 16 0" {...stroke} />
        </Icon>
    );
}

const DASHBOARD_TILES = [
    { x: 3, y: 3 },
    { x: 14, y: 3 },
    { x: 3, y: 14 },
    { x: 14, y: 14 },
];

function DashboardIcon(props: IconProps) {
    return (
        <Icon {...props}>
            {DASHBOARD_TILES.map(({ x, y }) => (
                <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth={1.7}
                />
            ))}
        </Icon>
    );
}

function SearchIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={1.8} />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
        </Icon>
    );
}

function SunIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path
                d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
            />
        </Icon>
    );
}

function MoonIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z" {...stroke} />
        </Icon>
    );
}

/* -------------------------------------------------------------------------- */
/* Button / link primitives                                                   */
/* -------------------------------------------------------------------------- */

function HeaderIconLink({href, label, title = label, className, children,}: {
    href: string;
    label: string;
    title?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            aria-label={label}
            title={title}
            className={cx(iconBox, outlined, motion, className)}
        >
            {children}
        </Link>
    );
}

function HeaderIconButton({label, className, children, ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> & { label: string }) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            className={cx(iconBox, outlined, motion, className)}
            {...props}
        >
            {children}
        </button>
    );
}

function HeaderPillLink({href, label, icon,}: {
    href: string;
    label: string;
    icon: ReactNode;
}) {
    return (
        <Link href={href} title={label} className={cx(pillBox, outlined, motion)}>
            {icon}
            <span>{label}</span>
        </Link>
    );
}

function HeaderTextButton({className, ...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            className={cx(
                'whitespace-nowrap rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-surface-muted sm:px-4',
                'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
                motion,
                className,
            )}
            {...props}
        />
    );
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */

function AnnouncementBar() {
    const settings = useSiteSettings();

    if (!settings.announcement_enabled || !settings.announcement_text) {
        return null;
    }

    return (
        <div className="bg-accent px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
            {settings.announcement_text}
        </div>
    );
}

function BrandLink() {
    const settings = useSiteSettings();

    if (!settings.brand_name_enabled) {
        return null;
    }

    return (
        <Link
            href="/"
            aria-label={`${settings.brand_name} home`}
            className="shrink-0 text-2xl font-bold tracking-[-0.07em] text-foreground transition-opacity duration-200 hover:opacity-80 motion-reduce:transition-none sm:text-3xl"
        >
            {settings.brand_name}
            <span className="text-accent">.</span>
        </Link>
    );
}

function SearchBar({
                       value,
                       onChange,
                       onSubmit,
                   }: {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}) {
    const hasValue = value.length > 0;

    return (
        <form
            role="search"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
            className="group order-3 flex w-full min-w-0 items-center gap-3 rounded-xl border border-border bg-surface px-4 transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 lg:order-none lg:ml-4 lg:w-auto lg:max-w-[520px] lg:flex-1"
        >
            <SearchIcon className="size-5 shrink-0 text-muted-foreground transition-colors duration-200 group-focus-within:text-accent" />

            <input
                aria-label="Search products and stores"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search products, brands and stores"
                className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            {/* Always mounted so it can fade in and out instead of popping */}
            <button
                type="button"
                aria-label="Clear search"
                aria-hidden={!hasValue}
                tabIndex={hasValue ? 0 : -1}
                onClick={() => onChange('')}
                className={cx(
                    'shrink-0 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground',
                    'transition-all duration-200 motion-reduce:transition-none hover:bg-surface-muted hover:text-foreground',
                    hasValue
                        ? 'translate-x-0 opacity-100'
                        : 'pointer-events-none translate-x-1 opacity-0',
                )}
            >
                Clear
            </button>
        </form>
    );
}

function CartBadge({ quantity }: { quantity: number }) {
    return (
        <span
            aria-hidden="true"
            className={cx(
                'absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-background',
                'transition-all duration-200 ease-out motion-reduce:transition-none',
                quantity > 0 ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
            )}
        >
            {quantity > 99 ? '99+' : quantity}
        </span>
    );
}

function ShoppingActions() {
    const quantity = useCartQuantity();

    return (
        <nav
            aria-label="Shopping actions"
            className="flex shrink-0 items-center gap-2 sm:gap-3"
        >
            <HeaderIconLink href="/wishlist" label="Wishlist">
                <HeartIcon />
            </HeaderIconLink>

            <HeaderIconLink
                href="/cart"
                label={`Shopping cart, ${quantity} ${quantity === 1 ? 'item' : 'items'}`}
                title={`Shopping cart (${quantity})`}
                className="relative"
            >
                <CartIcon />
                <CartBadge quantity={quantity} />
            </HeaderIconLink>
        </nav>
    );
}

const themeSwap =
    'absolute inset-0 size-5 transition-all duration-300 ease-out motion-reduce:transition-none';
const themeVisible = 'rotate-0 scale-100 opacity-100';
const themeHidden = 'pointer-events-none -rotate-90 scale-50 opacity-0';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <HeaderIconButton
            label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
        >
            <span className="relative size-5">
                {/* In dark mode we show the sun (switch to light) */}
                <SunIcon className={cx(themeSwap, isDark ? themeVisible : themeHidden)} />
                <MoonIcon className={cx(themeSwap, isDark ? themeHidden : themeVisible)} />
            </span>
        </HeaderIconButton>
    );
}

function AccountActions({
                            user,
                            isLoading,
                            isSeller,
                            isSigningOut,
                            onSignOut,
                        }: {
    user: User | null;
    isLoading: boolean;
    isSeller: boolean;
    isSigningOut: boolean;
    onSignOut: () => void;
}) {
    if (isLoading) {
        return (
            <span
                role="status"
                aria-label="Loading account"
                className="size-5 animate-pulse rounded-full bg-surface-muted"
            />
        );
    }

    if (!user) {
        return (
            <>
                <Link
                    href="/login"
                    className="hidden whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-accent motion-reduce:transition-none sm:inline-flex"
                >
                    Log in
                </Link>

                <Link
                    href="/register"
                    className="whitespace-nowrap rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover active:scale-[0.97] motion-reduce:transition-none sm:px-4"
                >
                    Sign up
                </Link>
            </>
        );
    }

    return (
        <>
            <HeaderPillLink href="/account" label="Account" icon={<AccountIcon />} />

            {isSeller && (
                <HeaderPillLink
                    href="/seller"
                    label="Dashboard"
                    icon={<DashboardIcon />}
                />
            )}

            <HeaderTextButton onClick={onSignOut} disabled={isSigningOut}>
                {isSigningOut ? 'Logging out…' : 'Log out'}
            </HeaderTextButton>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

type Props = {
    search: string;
    onSearchChange: (value: string) => void;
    onBrowseProducts: () => void;
    user: User | null;
    isLoading: boolean;
    isSeller: boolean;
    isSigningOut: boolean;
    onSignOut: () => void;
};

export default function MarketplaceHeader({
                                              search,
                                              onSearchChange,
                                              onBrowseProducts,
                                              user,
                                              isLoading,
                                              isSeller,
                                              isSigningOut,
                                              onSignOut,
                                          }: Props) {
    const scrolled = useScrolled();

    return (
        <header
            className={cx(
                'sticky top-0 z-50 border-b border-border bg-background',
                'transition-shadow duration-300 motion-reduce:transition-none',
                scrolled && 'shadow-sm',
            )}
        >
            <AnnouncementBar />

            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-[76px] flex-wrap items-center gap-3 py-4 lg:flex-nowrap lg:gap-5">
                    <BrandLink />

                    <SearchBar
                        value={search}
                        onChange={onSearchChange}
                        onSubmit={onBrowseProducts}
                    />

                    <ShoppingActions />

                    <HeaderIconLink
                        href="/marketplace"
                        label="Marketplace"
                        className="lg:ml-auto"
                    >
                        <MarketplaceIcon />
                    </HeaderIconLink>

                    <nav
                        aria-label="Main navigation"
                        className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4"
                    >
                        <ThemeToggle />

                        <AccountActions
                            user={user}
                            isLoading={isLoading}
                            isSeller={isSeller}
                            isSigningOut={isSigningOut}
                            onSignOut={onSignOut}
                        />
                    </nav>
                </div>
            </div>
        </header>
    );
}