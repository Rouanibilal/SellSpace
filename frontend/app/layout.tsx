import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { AuthProvider } from '@/components/auth-provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SellSpace',
  description: 'Discover and sell products on SellSpace.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
      <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
      <AuthProvider>{children}</AuthProvider>
      </body>
      </html>
  );
}