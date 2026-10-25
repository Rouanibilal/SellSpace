import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';

import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteSettingsProvider } from '@/components/site-settings-provider';
import { getInitialUser } from '@/lib/auth-server';
import { getSiteSettings, type SiteSettings } from '@/lib/settings';
import type { User } from '@/lib/auth';

import './globals.css';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'SellSpace',
    description: 'Discover and sell products on SellSpace.',
};

const defaultSettings: SiteSettings = {
    brand_name: 'SellSpace',
    brand_name_enabled: true,
    brand_logo_path: null,
    brand_logo_enabled: false,
    announcement_text: null,
    announcement_enabled: false,
};

const themeInitScript = `
  try {
    const savedTheme = localStorage.getItem('sellspace-theme');
    const theme = savedTheme === 'dark' ? 'dark' : 'light';

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
  }
`;

export default async function RootLayout({children,}: LayoutProps<'/'>) {
    let settings: SiteSettings;
    try {
        settings = await getSiteSettings();
    } catch (error) {
        console.error('Failed to load site settings:', error);
        settings = defaultSettings;
    }

    let initialUser: User | null | undefined;

    try {
        initialUser = await getInitialUser();
    } catch (error) {
        console.error('Failed to verify the initial user session:', error);

        // Fall back to the existing browser-side session check.
        initialUser = undefined;
    }

    return (
        <html
            lang="en"
            className={`${inter.variable} h-full antialiased`}
            suppressHydrationWarning
        >
        <head>
            <Script id="theme-init" strategy="beforeInteractive">
                {themeInitScript}
            </Script>
        </head>

        <body className="flex min-h-full flex-col font-sans">
        <AuthProvider initialUser={initialUser}>
            <ThemeProvider>
                <SiteSettingsProvider initialSettings={settings}>
                    {children}
                </SiteSettingsProvider>
            </ThemeProvider>
        </AuthProvider>
        </body>
        </html>
    );
}