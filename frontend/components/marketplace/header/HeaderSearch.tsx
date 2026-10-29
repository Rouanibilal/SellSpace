'use client';

import { SearchIcon } from '@/components/marketplace/header/HeaderIcons';
import { cn } from '@/lib/cn';

type HeaderSearchProps = {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
};

export default function HeaderSearch({ value, onChange, onSubmit }: HeaderSearchProps) {
    const hasValue = value.length > 0;

    return (
        <form
            role="search"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
            className="group order-3 flex w-full min-w-0 items-center gap-3 rounded-xl border border-border bg-surface px-4 transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 lg:order-none lg:ml-4 lg:w-auto lg:max-w-[520px] lg:flex-1"
        >
            <SearchIcon className="size-5 shrink-0 text-muted-foreground transition-colors duration-200 group-focus-within:text-accent" />

            <input
                aria-label="Search products and stores"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search products, brands and stores"
                className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            <button
                type="button"
                aria-label="Clear search"
                aria-hidden={!hasValue}
                tabIndex={hasValue ? 0 : -1}
                onClick={() => onChange('')}
                className={cn(
                    'shrink-0 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground',
                    'transition-all duration-200 motion-reduce:transition-none hover:bg-surface-muted hover:text-foreground',
                    hasValue
                        ? 'translate-x-0 opacity-100'
                        : 'pointer-events-none translate-x-1 opacity-0',
                )}
            >
                Clear
            </button>
        </form>
    );
}