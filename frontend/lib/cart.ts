import type { CartItem } from '@/types/marketplace';

const CART_STORAGE_KEY = 'sellspace-cart';

export const CART_UPDATED_EVENT = 'sellspace:cart-updated';

export function parseCartSnapshot(snapshot: string | null): CartItem[] {
    if (!snapshot) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(snapshot);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(
            (item): item is CartItem =>
                typeof item === 'object' &&
                item !== null &&
                'productId' in item &&
                typeof item.productId === 'string' &&
                'quantity' in item &&
                typeof item.quantity === 'number' &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0,
        );
    } catch {
        return [];
    }
}

export function getCartSnapshot(): string {
    if (typeof window === 'undefined') {
        return '';
    }

    try {
        return window.localStorage.getItem(CART_STORAGE_KEY) ?? '';
    } catch {
        return '';
    }
}

export function subscribeToCart(callback: () => void): () => void {
    if (typeof window === 'undefined') {
        return () => {};
    }

    window.addEventListener(CART_UPDATED_EVENT, callback);
    window.addEventListener('storage', callback);

    return () => {
        window.removeEventListener(CART_UPDATED_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
}

export function getCart(): CartItem[] {
    return parseCartSnapshot(getCartSnapshot());
}

function notifyCartUpdated(): void {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function saveCart(items: CartItem[]): void {
    if (typeof window === 'undefined') {
        return;
    }

    const validItems = items.filter(
        (item) =>
            typeof item.productId === 'string' &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0,
    );

    window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(validItems),
    );

    notifyCartUpdated();
}

export function addToCart(productId: string, quantity = 1): void {
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(
        (item) => item.productId === productId,
    );

    if (existingItem) {
        saveCart(
            cart.map((item) =>
                item.productId === productId
                    ? {
                        ...item,
                        quantity: item.quantity + quantity,
                    }
                    : item,
            ),
        );

        return;
    }

    saveCart([...cart, { productId, quantity }]);
}

export function updateCartQuantity(
    productId: string,
    quantity: number,
): void {
    const cart = getCart();

    if (!Number.isInteger(quantity) || quantity < 1) {
        saveCart(
            cart.filter((item) => item.productId !== productId),
        );

        return;
    }

    saveCart(
        cart.map((item) =>
            item.productId === productId
                ? { ...item, quantity }
                : item,
        ),
    );
}

export function removeFromCart(productId: string): void {
    saveCart(
        getCart().filter((item) => item.productId !== productId),
    );
}

export function clearCart(): void {
    saveCart([]);
}