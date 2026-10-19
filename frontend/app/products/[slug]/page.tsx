import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductDetails from '@/components/marketplace/ProductDetails';
import { mockMarketplaceProducts } from '@/data/mock-marketplace';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
                                           params,
                                       }: Props): Promise<Metadata> {
    const { slug } = await params;

    const product = mockMarketplaceProducts.find(
        (item) => item.slug === slug,
    );

    if (!product) {
        return {
            title: 'Product Not Found | SellSpace',
        };
    }

    return {
        title: `${product.name} | SellSpace`,
        description: product.description,
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;

    const product = mockMarketplaceProducts.find(
        (item) => item.slug === slug,
    );

    if (!product) {
        notFound();
    }

    return <ProductDetails product={product} />;
}