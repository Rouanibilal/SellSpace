'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/cn';
import { useScrolled } from '@/hooks/use-scrolled';

import { MarketplaceIcon } from '@/components/marketplace/header/HeaderIcons';

import { HeaderIconLink } from '@/components/marketplace/header/HeaderPrimitives';

import {
    AnnouncementBar,
    BrandLink,
} from '@/components/marketplace/header/HeaderBranding';

import HeaderSearch from '@/components/marketplace/header/HeaderSearch';
import HeaderShoppingActions from '@/components/marketplace/header/HeaderShoppingActions';
import HeaderThemeToggle from '@/components/marketplace/header/HeaderThemeToggle';
import HeaderAccountActions from '@/components/marketplace/header/HeaderAccountActions';

export default function MarketplaceHeader() {
    const { user, isLoading, signOut } = useAuth();
    const router = useRouter();
    const scrolled = useScrolled();

    const [search, setSearch] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const isSeller = user?.roles.some((role) => role.slug === 'seller') ?? false;

    function getMarketplaceUrl(
        term = search,
        sort = 'featured',
    ): string {
        const params = new URLSearchParams();
        const normalizedTerm = term.trim();

        if (normalizedTerm) {
            params.set('search', normalizedTerm);
        }

        if (sort !== 'featured') {
            params.set('sort', sort);
        }

        const query = params.toString();

        return `/marketplace${query ? `?${query}` : ''}`;
    }

    function browseProducts() {
        router.push(getMarketplaceUrl());
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
        <header
            className={cn(
                'sticky top-0 z-50 border-b border-border bg-background',
                'transition-shadow duration-300 motion-reduce:transition-none',
                scrolled && 'shadow-sm',
            )}
        >
            <AnnouncementBar />

            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-[76px] flex-wrap items-center gap-3 py-4 lg:flex-nowrap lg:gap-5">
                    <BrandLink />

                    <HeaderSearch
                        value={search}
                        onChange={setSearch}
                        onSubmit={browseProducts}
                    />

                    <HeaderShoppingActions />

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
                        <HeaderThemeToggle />

                        <HeaderAccountActions
                            user={user}
                            isLoading={isLoading}
                            isSeller={isSeller}
                            isSigningOut={isSigningOut}
                            onSignOut={() => void handleSignOut()}
                        />
                    </nav>
                </div>

                {message && (
                    <p
                        role="alert"
                        className="pb-3 text-sm text-red-600"
                    >
                        {message}
                    </p>
                )}
            </div>
        </header>
    );
}