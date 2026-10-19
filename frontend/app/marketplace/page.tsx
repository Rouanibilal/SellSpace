import type { Metadata } from 'next';

import MarketplaceCatalog from '@/components/marketplace/MarketplaceCatalog';

export const metadata: Metadata = {
    title: 'Marketplace | SellSpace',
    description:
        'Discover products across categories and explore independent stores on SellSpace.',
};

type SearchParams = {
    search?: string | string[];
    category?: string | string[];
    sort?: string | string[];
};

type Props = {
    searchParams: Promise<SearchParams>;
};

function getFirstValue(value: string | string[] | undefined): string {
    if (Array.isArray(value)) {
        return value[0] ?? '';
    }

    return value ?? '';
}

export default async function MarketplacePage({ searchParams }: Props) {
    const params = await searchParams;

    return (
        <MarketplaceCatalog
            initialSearch={getFirstValue(params.search)}
            initialCategory={getFirstValue(params.category)}
            initialSort={getFirstValue(params.sort)}
        />
    );
}