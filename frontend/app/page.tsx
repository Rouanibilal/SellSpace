'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth-provider';

import {
    marketplaceCategories,
    marketplaceCategoryTiles,
    mockMarketplaceProducts,
    mockMarketplaceStores,
} from '@/data/mock-marketplace';

import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceHero from '@/components/marketplace/MarketplaceHero';
import CategorySection from '@/components/marketplace/CategorySection';
import ProductGrid from '@/components/marketplace/ProductGrid';
import StoreSection from '@/components/marketplace/StoreSection';
import BecomeSellerSection from '@/components/marketplace/BecomeSellerSection';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';

export default function Home() {
    const router = useRouter();

    const { user, isLoading, signOut, becomeSeller } = useAuth();

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] =
        useState('All products');

    const [isBecomingSeller, setIsBecomingSeller] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const isSeller =
        user?.roles.some((role) => role.slug === 'seller') ?? false;

    const isCustomer =
        user?.roles.some((role) => role.slug === 'customer') ?? false;

    const featuredProducts = mockMarketplaceProducts
        .filter((product) => product.featured)
        .slice(0, 8);

    function getMarketplaceUrl(
        category = selectedCategory,
        term = search,
        sort = 'featured',
    ) {
        const params = new URLSearchParams();
        const normalizedTerm = term.trim();

        if (normalizedTerm) {
            params.set('search', normalizedTerm);
        }

        if (category !== 'All products') {
            params.set('category', category);
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

    function handleSelectCategory(category: string) {
        setSelectedCategory(category);
        router.push(getMarketplaceUrl(category));
    }

    function handleSortChange(sort: string) {
        router.push(getMarketplaceUrl(selectedCategory, search, sort));
    }

    function clearFilters() {
        setSearch('');
        setSelectedCategory('All products');
        router.push('/marketplace');
    }

    async function handleBecomeSeller() {
        setMessage(null);
        setIsBecomingSeller(true);

        try {
            await becomeSeller();
            router.push('/seller/stores/create');
        } catch {
            setMessage(
                'Unable to enable seller access. Please try again.',
            );
        } finally {
            setIsBecomingSeller(false);
        }
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
                categories={marketplaceCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                search={search}
                onSearchChange={setSearch}
                onBrowseProducts={browseProducts}
                user={user}
                isLoading={isLoading}
                isSeller={isSeller}
                isSigningOut={isSigningOut}
                onSignOut={() => void handleSignOut()}
            />

            <MarketplaceHero onBrowseProducts={browseProducts} />

            <CategorySection
                categories={marketplaceCategoryTiles}
                onSelectCategory={handleSelectCategory}
            />

            <ProductGrid
                products={featuredProducts}
                categories={marketplaceCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                sort="featured"
                onSortChange={handleSortChange}
                onClearFilters={clearFilters}
            />

            <StoreSection stores={mockMarketplaceStores} />

            <BecomeSellerSection
                isLoading={isLoading}
                isSeller={isSeller}
                isCustomer={isCustomer}
                isBecomingSeller={isBecomingSeller}
                onBecomeSeller={() => void handleBecomeSeller()}
                message={message}
            />

            <MarketplaceFooter />
        </main>
    );
}