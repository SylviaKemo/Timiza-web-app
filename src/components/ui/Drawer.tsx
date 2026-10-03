'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './Button';

interface DrawerProps {
  onClose: () => void;
  /** Content on the left of the header bar. */
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  label: string;
}

/** Right-hand panel (460px, full width on mobile) over a light overlay. */
export function Drawer({ onClose, header, footer, children, label }: DrawerProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-[rgba(28,28,28,0.16)]" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="fixed inset-y-0 right-0 z-41 flex w-[460px] max-w-full flex-col border-l border-line bg-surface"
      >
        <div className="flex items-center justify-between gap-3 border-b border-divider py-3.5 pr-4 pl-6">
          {header}
          <IconButton label="Close" onClick={onClose}>
            <X />
          </IconButton>
        </div>
        <div className="flex flex-1 flex-col gap-[26px] overflow-auto px-6 pt-[22px] pb-7">{children}</div>
        <div className="flex items-center justify-between gap-3 border-t border-divider px-6 py-3.5">{footer}</div>
      </aside>
    </>
  );
}
