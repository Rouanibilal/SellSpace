'use client';

import { useMemo, useSyncExternalStore } from 'react';

import {
    getCartSnapshot,
    parseCartSnapshot,
    subscribeToCart,
} from '@/lib/cart';

export function useCartQuantity(): number {
    const snapshot = useSyncExternalStore(
        subscribeToCart,
        getCartSnapshot,
        () => '',
    );

    return useMemo(
        () =>
            parseCartSnapshot(snapshot).reduce(
                (total, item) => total + item.quantity,
                0,
            ),
        [snapshot],
    );
}