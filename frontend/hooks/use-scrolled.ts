'use client';

import { useEffect, useState } from 'react';

export function useScrolled(offset = 8): boolean {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > offset);
        };

        window.addEventListener('scroll', onScroll, {
            passive: true,
        });

        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [offset]);

    return scrolled;
}