import type { Metadata } from 'next';

import ShoppingCart from '@/components/marketplace/ShoppingCart';

export const metadata: Metadata = {
    title: 'Shopping Cart | SellSpace',
    description:
        'Review your selected products and manage your shopping cart on SellSpace.',
};

export default function CartPage() {
    return <ShoppingCart />;
}