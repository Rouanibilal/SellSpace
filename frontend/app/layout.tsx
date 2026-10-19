import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';

import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';

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

export default function RootLayout({ children }: LayoutProps<'/'>) {
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
        <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
        </body>
        </html>
    );
}