'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './Button';

interface ModalProps {
  title: string;
  onClose: () => void;
  /** Panel width in px (max 100% of the viewport). */
  width?: number;
  footer?: ReactNode;
  children: ReactNode;
}

/** Centered dialog over a dimmed overlay. Clicking the overlay closes it; Esc is handled by the app shell. */
export function Modal({ title, onClose, width = 460, footer, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-[rgba(28,28,28,0.28)] p-3 desktop:px-5 desktop:py-[72px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-w-full rounded-modal border border-line bg-surface"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <h2 className="text-xl font-semibold">{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <X />
          </IconButton>
        </div>
        <div className="flex flex-col gap-[18px] px-6 pt-4 pb-2">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 pt-4 pb-5">{footer}</div>}
      </div>
    </div>
  );
}
