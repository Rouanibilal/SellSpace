import type { Metadata } from 'next';

import Checkout from '@/components/marketplace/Checkout';

export const metadata: Metadata = {
    title: 'Checkout | SellSpace',
    description:
        'Review your shopping cart, enter delivery details, and review your order on SellSpace.',
};

export default function CheckoutPage() {
    return <Checkout />;
}