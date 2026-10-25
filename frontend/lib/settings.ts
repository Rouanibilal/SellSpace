import { api } from './api';

export interface SiteSettings {
    brand_name: string;
    brand_name_enabled: boolean;
    brand_logo_path: string | null;
    brand_logo_enabled: boolean;
    announcement_text: string | null;
    announcement_enabled: boolean;
}

/**
 * Fetches public site settings from Laravel.
 * Next.js revalidates the cached response every 60 seconds.
 */
export async function getSiteSettings(): Promise<SiteSettings> {

    const response = await api.get<SiteSettings>('/settings');

    return response.data;
}

