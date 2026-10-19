import type { Metadata } from 'next';

import Wishlist from '@/components/account/Wishlist';

export const metadata: Metadata = {
    title: 'My Wishlist | SellSpace',
    description:
        'Save your favourite products and find them easily on SellSpace.',
};

export default function WishlistPage() {
    return <Wishlist />;
}