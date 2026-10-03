'use client';

import { useEffect, useState, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { Ellipsis } from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/lib/cn';

interface Anchor {
  x: number;
  y: number;
}

interface RowMenuProps {
  label: string;
  /** Menu width in px; the menu right-aligns with the trigger. */
  width?: number;
  /** Estimated menu height so it never opens below the viewport. */
  height?: number;
  children: (close: () => void) => ReactNode;
}

/**
 * "•••" button that opens a fixed-position menu.
 * Clicks on the trigger don't bubble, so it can sit inside clickable rows.
 */
export function RowMenu({ label, width = 180, height = 140, children }: RowMenuProps) {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const close = () => setAnchor(null);
  useEscapeKey(close, !!anchor);

  // Fixed menus would drift on scroll, so close them instead.
  useEffect(() => {
    if (!anchor) return;
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, [anchor]);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchor(anchor ? null : { x: rect.right, y: rect.bottom + 4 });
  };

  return (
    <>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        onClick={toggle}
        className="flex size-10 shrink-0 items-center justify-center rounded-item text-faint hover:bg-neutral hover:text-ink desktop:size-8"
      >
        <Ellipsis size={16} />
      </button>
      {anchor && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          />
          <div
            role="menu"
            onClick={(e) => e.stopPropagation()}
            className="fixed z-31 rounded-tile border border-line bg-surface p-1 shadow-pop"
            style={{
              width,
              left: Math.max(8, anchor.x - width),
              top: Math.min(window.innerHeight - height, anchor.y),
            }}
          >
            {children(close)}
          </div>
        </>
      )}
    </>
  );
}

interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
}

export function MenuItem({ danger, className, ...props }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'h-[34px] w-full rounded-item px-2.5 text-left text-[13px]',
        danger ? 'text-danger hover:bg-danger-light' : 'hover:bg-subtle',
        className,
      )}
      {...props}
    />
  );
}

export function MenuDivider() {
  return <div className="my-1 h-px bg-divider" />;
}
