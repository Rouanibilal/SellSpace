export type MarketplaceCategory = {
    slug: string;
    name: string;
    description: string;
    imageUrl: string;
    productCount?: number;
};

export type MarketplaceProduct = {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    store: string;
    storeSlug: string;
    imageUrl: string;
    background: string;
    badge?: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    featured: boolean;
};

export type MarketplaceStore = {
    slug: string;
    name: string;
    description: string;
    category: string;
    initials: string;
    color: string;
    coverImageUrl: string;
    rating: number;
    reviewCount: number;
    productCount: number;
    featured: boolean;
};

export type CartItem = {
    productId: string;
    quantity: number;
};

export type ProductSortOption =
    | 'featured'
    | 'price-low'
    | 'price-high'
    | 'rating'
    | 'newest';

export type MarketplaceCategoryTile = {
    name: string;
    detail: string;
    image: string;
};