'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useAuth } from '@/components/auth-provider';

export default function Home() {
    const { user, isLoading, error, signOut } = useAuth();

    const [isSigningOut, setIsSigningOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);

    async function handleSignOut() {
        setIsSigningOut(true);
        setLogoutError(null);

        try {
            await signOut();
        } catch {
            setLogoutError('Unable to log out. Please try again.');
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg space-y-6 text-center">
                <header>
                    <h1 className="text-4xl font-bold">SellSpace</h1>
                    <p className="mt-3 text-gray-600">
                        Your marketplace starts here.
                    </p>
                </header>

                {isLoading ? (
                    <p role="status" className="text-gray-600">
                        Checking your session...
                    </p>
                ) : user ? (
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Welcome, {user.name}
                        </h2>

                        <p className="text-gray-600">{user.email}</p>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-60"
                        >
                            {isSigningOut ? 'Logging out...' : 'Log out'}
                        </button>
                    </section>
                ) : (
                    <section className="flex justify-center gap-4">
                        <Link
                            href="/login"
                            className="rounded-md border px-5 py-2 font-medium"
                        >
                            Log in
                        </Link>

                        <Link
                            href="/register"
                            className="rounded-md bg-black px-5 py-2 font-medium text-white"
                        >
                            Create account
                        </Link>
                    </section>
                )}

                {(error || logoutError) && (
                    <p role="alert" className="text-sm text-red-600">
                        {logoutError ?? error}
                    </p>
                )}
            </div>
        </main>
    );
}