'use client';

import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/cn';

import {
    MoonIcon,
    SunIcon,
} from '@/components/marketplace/header/HeaderIcons';

import { HeaderIconButton } from '@/components/marketplace/header/HeaderPrimitives';

const themeSwap =
    'absolute inset-0 size-5 transition-all duration-300 ease-out motion-reduce:transition-none';

const themeVisible = 'rotate-0 scale-100 opacity-100';

const themeHidden =
    'pointer-events-none -rotate-90 scale-50 opacity-0';

export default function HeaderThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <HeaderIconButton
            label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
        >
            <span className="relative size-5">
                <SunIcon
                    className={cn(
                        themeSwap,
                        isDark ? themeVisible : themeHidden,
                    )}
                />

                <MoonIcon
                    className={cn(
                        themeSwap,
                        isDark ? themeHidden : themeVisible,
                    )}
                />
            </span>
        </HeaderIconButton>
    );
}