'use client';

import { useEffect, useRef } from 'react';

/** Calls `onEscape` when Esc is pressed while `active` is true. */
export function useEscapeKey(onEscape: () => void, active = true) {
  const handler = useRef(onEscape);

  useEffect(() => {
    handler.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);
}
