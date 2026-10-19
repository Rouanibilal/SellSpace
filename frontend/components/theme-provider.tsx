'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useSyncExternalStore,
    type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = 'sellspace-theme';
const THEME_UPDATED_EVENT = 'sellspace:theme-updated';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getThemeSnapshot(): Theme {
    if (typeof window === 'undefined') {
        return 'light';
    }

    try {
        return window.localStorage.getItem(STORAGE_KEY) === 'dark'
            ? 'dark'
            : 'light';
    } catch {
        return 'light';
    }
}

function getServerThemeSnapshot(): Theme {
    return 'light';
}

function subscribeToTheme(callback: () => void): () => void {
    if (typeof window === 'undefined') {
        return () => {};
    }

    window.addEventListener(THEME_UPDATED_EVENT, callback);
    window.addEventListener('storage', callback);

    return () => {
        window.removeEventListener(THEME_UPDATED_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
}

function applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({
                                  children,
                              }: {
    children: ReactNode;
}) {
    const theme = useSyncExternalStore(
        subscribeToTheme,
        getThemeSnapshot,
        getServerThemeSnapshot,
    );

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const setTheme = useCallback((nextTheme: Theme) => {
        applyTheme(nextTheme);

        try {
            window.localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {
            // Keep the theme applied for this page if storage is unavailable.
        }

        window.dispatchEvent(new Event(THEME_UPDATED_EVENT));
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [setTheme, theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useTheme must be used inside a ThemeProvider.',
        );
    }

    return context;
}