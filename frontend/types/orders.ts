export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

export type OrderPaymentStatus =
    | 'pending'
    | 'paid'
    | 'failed'
    | 'refunded';

export type OrderItem = {
    productId: string;
    productSlug: string;
    productName: string;
    productImageUrl: string;
    storeName: string;
    storeSlug: string;
    unitPrice: number;
    quantity: number;
};

export type MarketplaceOrder = {
    id: string;
    orderNumber: string;
    createdAt: string;
    status: OrderStatus;
    paymentStatus: OrderPaymentStatus;
    paymentMethod: 'cash_on_delivery' | 'card';
    deliveryMethod: 'standard' | 'express';
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    deliveryAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        postalCode?: string;
    };
};

export type OrderStatusInfo = {
    label: string;
    description: string;
};