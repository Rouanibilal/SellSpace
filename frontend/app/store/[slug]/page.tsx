import type { Metadata } from 'next';

import Storefront from '@/components/marketplace/Storefront';
import { mockMarketplaceStores } from '@/data/mock-marketplace';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
                                           params,
                                       }: Props): Promise<Metadata> {
    const { slug } = await params;

    const store = mockMarketplaceStores.find(
        (item) => item.slug === slug,
    );

    return {
        title: store
            ? `${store.name} | SellSpace`
            : 'Store Not Found | SellSpace',
        description: store
            ? `${store.description} Explore products from ${store.name} on SellSpace.`
            : 'Explore independent stores on SellSpace.',
    };
}

export default async function StorePage({ params }: Props) {
    const { slug } = await params;

    return <Storefront slug={slug} />;
}