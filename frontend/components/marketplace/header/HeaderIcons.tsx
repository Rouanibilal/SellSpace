import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const;

function Icon({
                  className = 'size-5 shrink-0',
                  children,
                  ...props
              }: IconProps) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            {...props}
        >
            {children}
        </svg>
    );
}

export function CartIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path
                d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.5L21 8H6"
                {...stroke}
            />
            <circle cx="10" cy="20" r="1" fill="currentColor" />
            <circle cx="18" cy="20" r="1" fill="currentColor" />
        </Icon>
    );
}

export function HeartIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path
                d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                {...stroke}
            />
        </Icon>
    );
}

export function MarketplaceIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path
                d="M3 10v10h18V10M2.5 9l2-6h15l2 6"
                {...stroke}
            />
            <path
                d="M2.5 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6"
                {...stroke}
            />
        </Icon>
    );
}

export function AccountIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth={1.7}
            />
            <path
                d="M4 21a8 8 0 0 1 16 0"
                {...stroke}
            />
        </Icon>
    );
}

const DASHBOARD_TILES = [
    { x: 3, y: 3 },
    { x: 14, y: 3 },
    { x: 3, y: 14 },
    { x: 14, y: 14 },
] as const;

export function DashboardIcon(props: IconProps) {
    return (
        <Icon {...props}>
            {DASHBOARD_TILES.map(({ x, y }) => (
                <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth={1.7}
                />
            ))}
        </Icon>
    );
}

export function SearchIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth={1.8}
            />
            <path
                d="m16 16 4 4"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
            />
        </Icon>
    );
}

export function SunIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path
                d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
            />
        </Icon>
    );
}

export function MoonIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path
                d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z"
                {...stroke}
            />
        </Icon>
    );
}