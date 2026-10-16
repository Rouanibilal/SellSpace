'use client';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useAuth } from '@/components/auth-provider';
import type { RegisterData } from '@/lib/auth';

type ValidationErrors = Record<string, string[]>;

export default function RegisterPage() {
    const router = useRouter();
    const { signUp } = useAuth();

    const [form, setForm] = useState<RegisterData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(field: keyof RegisterData, value: string) {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: [] }));
        setServerError(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrors({});
        setServerError(null);
        setIsSubmitting(true);

        try {
            await signUp(form);
            router.push('/');
            router.refresh();
        } catch (error: unknown) {
            if (isAxiosError<{ message?: string; errors?: ValidationErrors }>(error)) {
                setErrors(error.response?.data.errors ?? {});
                setServerError(
                    error.response?.data.message ??
                    'Unable to create your account. Check your connection and try again.',
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
                    <h1 className="text-3xl font-bold">Create your account</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Join SellSpace to get started.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium">
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            maxLength={255}
                            value={form.name}
                            onChange={(event) => handleChange('name', event.target.value)}
                            aria-invalid={Boolean(errors.name?.length)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                        {errors.name?.map((message) => (
                            <p key={message} className="mt-1 text-sm text-red-600">
                                {message}
                            </p>
                        ))}
                    </div>

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
                            onChange={(event) => handleChange('email', event.target.value)}
                            aria-invalid={Boolean(errors.email?.length)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                        {errors.email?.map((message) => (
                            <p key={message} className="mt-1 text-sm text-red-600">
                                {message}
                            </p>
                        ))}
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
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={form.password}
                            onChange={(event) => handleChange('password', event.target.value)}
                            aria-invalid={Boolean(errors.password?.length)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                        {errors.password?.map((message) => (
                            <p key={message} className="mt-1 text-sm text-red-600">
                                {message}
                            </p>
                        ))}
                    </div>

                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="mb-1 block text-sm font-medium"
                        >
                            Confirm password
                        </label>
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={form.password_confirmation}
                            onChange={(event) =>
                                handleChange('password_confirmation', event.target.value)
                            }
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
                        {isSubmitting ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-black underline">
                        Log in
                    </a>
                </p>
            </div>
        </main>
    );
}