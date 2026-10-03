'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from './useAppStore';

/**
 * Loads persisted data from localStorage after mount.
 * Returns `true` once the store reflects the saved data, so the UI never renders seed data first.
 */
export function useStoreHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(useAppStore.persist.rehydrate()).then(() => {
      if (!cancelled) setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return hydrated;
}
