'use client';

import { useCartQuantity } from '@/hooks/use-cart-quantity';
import { cn } from '@/lib/cn';

import {
    CartIcon,
    HeartIcon,
} from '@/components/marketplace/header/HeaderIcons';

import { HeaderIconLink } from '@/components/marketplace/header/HeaderPrimitives';

function CartBadge({ quantity }: { quantity: number }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-background',
                'transition-all duration-200 ease-out motion-reduce:transition-none',
                quantity > 0
                    ? 'scale-100 opacity-100'
                    : 'scale-0 opacity-0',
            )}
        >
            {quantity > 99 ? '99+' : quantity}
        </span>
    );
}

export default function HeaderShoppingActions() {
    const quantity = useCartQuantity();

    return (
        <nav
            aria-label="Shopping actions"
            className="flex shrink-0 items-center gap-2 sm:gap-3"
        >
            <HeaderIconLink href="/wishlist" label="Wishlist">
                <HeartIcon />
            </HeaderIconLink>

            <HeaderIconLink
                href="/cart"
                label={`Shopping cart, ${quantity} ${quantity === 1 ? 'item' : 'items'}`}
                title={`Shopping cart (${quantity})`}
                className="relative"
            >
                <CartIcon />
                <CartBadge quantity={quantity} />
            </HeaderIconLink>
        </nav>
    );
}