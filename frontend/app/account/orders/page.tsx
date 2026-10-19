import type { Metadata } from 'next';

import OrdersHistory from '@/components/account/OrdersHistory';

export const metadata: Metadata = {
    title: 'Order History | SellSpace',
    description:
        'Review your orders, check their status, and revisit products on SellSpace.',
};

export default function OrdersPage() {
    return <OrdersHistory />;
}