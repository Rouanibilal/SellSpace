'use client';

import {
    createContext,
    useContext,
    type ReactNode,
} from 'react';

import type { SiteSettings } from '@/lib/settings';

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({children, initialSettings,}: { children: ReactNode; initialSettings: SiteSettings; }) {
    return (
        <SiteSettingsContext.Provider value={initialSettings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    const settings = useContext(SiteSettingsContext);

    if (!settings) {
        throw new Error(
            'useSiteSettings must be used inside SiteSettingsProvider',
        );
    }

    return settings;
}