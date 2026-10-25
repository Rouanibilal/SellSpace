
import 'server-only';

import { cookies } from 'next/headers';

import type { User } from '@/lib/auth';

function getRequiredUrl(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is not configured.`);
    }

    return value.replace(/\/+$/, '');
}

export async function getInitialUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) {
        return null;
    }

    const apiBaseUrl = getRequiredUrl('NEXT_PUBLIC_API_URL');
    const appBaseUrl = getRequiredUrl('NEXT_PUBLIC_APP_URL');

    const response = await fetch(`${apiBaseUrl}/user`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Cookie: cookieHeader,
            Origin: appBaseUrl,
            Referer: `${appBaseUrl}/`,
        },
        cache: 'no-store',
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `Unable to verify the Laravel session (HTTP ${response.status}).`,
        );
    }

    return (await response.json()) as User;
}
