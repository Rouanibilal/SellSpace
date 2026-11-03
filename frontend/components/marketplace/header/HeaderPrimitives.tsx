import Link from 'next/link';
import type {
    ButtonHTMLAttributes,
    ReactNode,
} from 'react';

import { cn } from '@/lib/cn';

const motion =
    'transition-all duration-200 ease-out motion-reduce:transition-none ' +
    'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

const outlined =
    'border border-border hover:border-accent hover:bg-surface-muted hover:text-accent';

const iconBox =
    'inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground';

const pillBox =
    'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-foreground sm:px-4';

type HeaderIconLinkProps = {
    href: string;
    label: string;
    title?: string;
    className?: string;
    children: ReactNode;
};

export function HeaderIconLink({href, label, title = label, className, children }: HeaderIconLinkProps) {
    return (
        <Link
            href={href}
            aria-label={label}
            title={title}
            className={cn(iconBox, outlined, motion, className)}
        >
            {children}
        </Link>
    );
}

type HeaderIconButtonProps =
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> & {
    label: string;
};

export function HeaderIconButton({ label, className, children, ...props }: HeaderIconButtonProps) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            className={cn(iconBox, outlined, motion, className)}
            {...props}
        >
            {children}
        </button>
    );
}

type HeaderPillLinkProps = {
    href: string;
    label: string;
    icon: ReactNode;
};

export function HeaderPillLink({ href, label, icon }: HeaderPillLinkProps) {
    return (
        <Link
            href={href}
            title={label}
            className={cn(pillBox, outlined, motion)}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

export function HeaderTextButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            className={cn(
                'whitespace-nowrap rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-surface-muted sm:px-4',
                'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
                motion,
                className,
            )}
            {...props}
        />
    );
}