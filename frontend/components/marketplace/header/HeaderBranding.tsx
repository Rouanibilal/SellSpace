'use client';

import Link from 'next/link';

import { useSiteSettings } from '@/components/site-settings-provider';

export function AnnouncementBar() {
    const settings = useSiteSettings();

    if (!settings.announcement_enabled || !settings.announcement_text) {
        return null;
    }

    return (
        <div className="bg-accent px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
            {settings.announcement_text}
        </div>
    );
}

export function BrandLink() {
    const settings = useSiteSettings();

    if (!settings.brand_name_enabled) {
        return null;
    }

    return (
        <Link
            href="/"
            aria-label={`${settings.brand_name} home`}
            className="shrink-0 text-2xl font-bold tracking-[-0.07em] text-foreground transition-opacity duration-200 hover:opacity-80 motion-reduce:transition-none sm:text-3xl"
        >
            {settings.brand_name}
            <span className="text-accent">.</span>
        </Link>
    );
}