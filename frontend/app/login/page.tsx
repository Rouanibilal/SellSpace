'use client';

import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useAuth } from '@/components/auth-provider';
import type { LoginData } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();

    const [form, setForm] = useState<LoginData>({
        email: '',
        password: '',
    });
    const [emailError, setEmailError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setEmailError(null);
        setServerError(null);
        setIsSubmitting(true);

        try {
            await signIn(form);

            router.push('/');
            router.refresh();
        } catch (error: unknown) {
            if (isAxiosError<{
                message?: string;
                errors?: Record<string, string[]>;
            }>(error)) {
                const errors = error.response?.data.errors;

                setEmailError(errors?.email?.[0] ?? null);
                setServerError(
                    errors
                        ? null
                        : error.response?.data.message ??
                        'Unable to log in. Check your connection and try again.',
                );
            } else {
                setServerError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                <header className="text-center">
                    <h1 className="text-3xl font-bold">Welcome back</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Log in to your SellSpace account.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium">
                            Email address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            maxLength={255}
                            value={form.email}
                            onChange={(event) => {
                                setForm((current) => ({
                                    ...current,
                                    email: event.target.value,
                                }));
                                setEmailError(null);
                                setServerError(null);
                            }}
                            aria-invalid={Boolean(emailError)}
                            className="w-full rounded-md border px-3 py-2"
                        />

                        {emailError && (
                            <p className="mt-1 text-sm text-red-600">{emailError}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={form.password}
                            onChange={(event) => {
                                setForm((current) => ({
                                    ...current,
                                    password: event.target.value,
                                }));
                                setServerError(null);
                            }}
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    {serverError && (
                        <p role="alert" className="text-sm text-red-600">
                            {serverError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-black px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Logging in…' : 'Log in'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-medium text-black underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </main>
    );
}