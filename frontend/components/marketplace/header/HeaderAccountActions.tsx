'use client';

import type { User } from '@/lib/auth';

import {
    AccountIcon,
    DashboardIcon,
} from '@/components/marketplace/header/HeaderIcons';

import {
    HeaderPillLink,
    HeaderTextButton,
} from '@/components/marketplace/header/HeaderPrimitives';

type HeaderAccountActionsProps = {
    user: User | null;
    isLoading: boolean;
    isSeller: boolean;
    isSigningOut: boolean;
    onSignOut: () => void;
};

export default function HeaderAccountActions({
                                                 user,
                                                 isLoading,
                                                 isSeller,
                                                 isSigningOut,
                                                 onSignOut,
                                             }: HeaderAccountActionsProps) {
    if (isLoading) {
        return (
            <span
                role="status"
                aria-label="Loading account"
                className="size-5 animate-pulse rounded-full bg-surface-muted"
            />
        );
    }

    if (!user) {
        return (
            <>
                <a
                    href="/login"
                    className="hidden whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-accent motion-reduce:transition-none sm:inline-flex"
                >
                    Log in
                </a>

                <a
                    href="/register"
                    className="whitespace-nowrap rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover active:scale-[0.97] motion-reduce:transition-none sm:px-4"
                >
                    Sign up
                </a>
            </>
        );
    }

    return (
        <>
            <HeaderPillLink
                href="/account"
                label="Account"
                icon={<AccountIcon />}
            />

            {isSeller && (
                <HeaderPillLink
                    href="/seller"
                    label="Dashboard"
                    icon={<DashboardIcon />}
                />
            )}

            <HeaderTextButton
                onClick={onSignOut}
                disabled={isSigningOut}
            >
                {isSigningOut ? 'Logging out…' : 'Log out'}
            </HeaderTextButton>
        </>
    );
}