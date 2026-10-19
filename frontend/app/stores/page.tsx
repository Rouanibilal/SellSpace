import type { Metadata } from 'next';

import StoresDirectory from '@/components/marketplace/StoresDirectory';

export const metadata: Metadata = {
    title: 'Discover Stores | SellSpace',
    description:
        'Explore independent sellers, discover their collections, and find your favourite stores on SellSpace.',
};

export default function StoresPage() {
    return <StoresDirectory />;
}