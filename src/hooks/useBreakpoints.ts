'use client';

import { useSyncExternalStore } from 'react';

/** Matches the `desktop` (900px) and `wide` (1200px) breakpoints in globals.css. */
const MOBILE_QUERY = '(max-width: 899.98px)';
const COMPACT_QUERY = '(max-width: 1199.98px)';

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * `isMobile` (< 900px): sidebar becomes a drawer.
 * `isCompact` (< 1200px): tables switch to stacked rows.
 * Prefer Tailwind's `desktop:` / `wide:` variants for pure styling; use this when markup differs.
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isCompact = useMediaQuery(COMPACT_QUERY);
  return { isMobile, isCompact };
}
