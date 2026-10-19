import type { Metadata } from 'next';

import OrderDetails from '@/components/account/OrderDetails';

type Props = {
    params: Promise<{
        orderNumber: string;
    }>;
};

export async function generateMetadata({
                                           params,
                                       }: Props): Promise<Metadata> {
    const { orderNumber } = await params;

    return {
        title: `Order ${orderNumber} | SellSpace`,
        description: `Review order ${orderNumber}, including its items, delivery details, and payment status.`,
    };
}

export default async function OrderDetailsPage({ params }: Props) {
    const { orderNumber } = await params;

    return <OrderDetails orderNumber={orderNumber} />;
}