const WISHLIST_STORAGE_KEY = 'sellspace-wishlist';

export const WISHLIST_UPDATED_EVENT = 'sellspace:wishlist-updated';

export function parseWishlistSnapshot(snapshot: string | null): string[] {
    if (!snapshot) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(snapshot);

        if (!Array.isArray(parsed)) {
            return [];
        }

        // Keep unique, non-empty product IDs only.
        return [...new Set(
            parsed.filter(
                (item): item is string =>
                    typeof item === 'string' && item.length > 0,
            ),
        )];
    } catch {
        return [];
    }
}

export function getWishlistSnapshot(): string {
    if (typeof window === 'undefined') {
        return '';
    }

    try {
        return window.localStorage.getItem(WISHLIST_STORAGE_KEY) ?? '';
    } catch {
        return '';
    }
}

export function subscribeToWishlist(
    callback: () => void,
): () => void {
    if (typeof window === 'undefined') {
        return () => {};
    }

    window.addEventListener(WISHLIST_UPDATED_EVENT, callback);
    window.addEventListener('storage', callback);

    return () => {
        window.removeEventListener(WISHLIST_UPDATED_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
}

export function getWishlist(): string[] {
    return parseWishlistSnapshot(getWishlistSnapshot());
}

function notifyWishlistUpdated(): void {
    window.dispatchEvent(new Event(WISHLIST_UPDATED_EVENT));
}

function saveWishlist(productIds: string[]): void {
    if (typeof window === 'undefined') {
        return;
    }

    const uniqueIds = [...new Set(
        productIds.filter(
            (id) => typeof id === 'string' && id.length > 0,
        ),
    )];

    window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(uniqueIds),
    );

    notifyWishlistUpdated();
}

export function addToWishlist(productId: string): void {
    if (!productId) {
        return;
    }

    const wishlist = getWishlist();

    if (!wishlist.includes(productId)) {
        saveWishlist([...wishlist, productId]);
    }
}

export function removeFromWishlist(productId: string): void {
    saveWishlist(
        getWishlist().filter((id) => id !== productId),
    );
}

export function toggleWishlist(productId: string): void {
    const wishlist = getWishlist();

    if (wishlist.includes(productId)) {
        removeFromWishlist(productId);
    } else {
        addToWishlist(productId);
    }
}

export function clearWishlist(): void {
    saveWishlist([]);
}