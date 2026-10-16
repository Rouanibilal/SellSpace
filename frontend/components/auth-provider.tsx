'use client';

import axios, { isAxiosError } from 'axios';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

import {
    getCurrentUser,
    login,
    logout,
    register,
    type LoginData,
    type RegisterData,
    type User,
} from '@/lib/auth';

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    signUp: (data: RegisterData) => Promise<User>;
    signIn: (data: LoginData) => Promise<User>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshUser = useCallback(async (): Promise<User | null> => {
        try {
            const currentUser = await getCurrentUser();

            setUser(currentUser);
            setError(null);

            return currentUser;
        } catch (err: unknown) {
            if (isAxiosError(err) && err.response?.status === 401) {
                setUser(null);
                setError(null);

                return null;
            }

            setError('Unable to verify your session. Check that Laravel is running.');
            throw err;
        }
    }, []);

    useEffect(() => {
        let active = true;

        getCurrentUser()
            .then((currentUser) => {
                if (!active) return;

                setUser(currentUser);
                setError(null);
            })
            .catch((err: unknown) => {
                if (!active) return;

                if (isAxiosError(err) && err.response?.status === 401) {
                    setUser(null);
                    setError(null);
                    return;
                }

                setError(
                    'Unable to verify your session. Check that Laravel is running.',
                );
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    async function signUp(data: RegisterData): Promise<User> {
        setError(null);

        try {
            const newUser = await register(data);
            setUser(newUser);
            return newUser;
        } catch (err: unknown) {
            setError('Registration failed. Check the submitted information.');
            throw err;
        }
    }

    async function signIn(data: LoginData): Promise<User> {
        setError(null);

        try {
            const authenticatedUser = await login(data);
            setUser(authenticatedUser);
            return authenticatedUser;
        } catch (err: unknown) {
            setError('Login failed. Check your credentials.');
            throw err;
        }
    }

    async function signOut(): Promise<void> {
        try {
            await logout();
            setUser(null);
            setError(null);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setUser(null);
                setError(null);
                return;
            }

            setError('Logout failed. Please try again.');
            throw err;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                signUp,
                signIn,
                signOut,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }

    return context;
}