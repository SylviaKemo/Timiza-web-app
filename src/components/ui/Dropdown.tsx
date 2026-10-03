'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/lib/cn';

export interface DropdownOption {
  value: string;
  label: string;
  /** Secondary line under the label (e.g. client contact). */
  sub?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  /** Shown when no option matches `value`. */
  placeholder?: string;
  /** `filter` is the compact toolbar button, `field` the full-width form control. */
  variant?: 'filter' | 'field';
  invalid?: boolean;
  menuClassName?: string;
  'aria-label'?: string;
}

/**
 * Custom popover select for dynamic option lists (clients, projects).
 * Static short lists use the native `<Select>` instead.
 */
export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select',
  variant = 'filter',
  invalid = false,
  menuClassName,
  'aria-label': ariaLabel,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  useEscapeKey(() => setOpen(false), open);

  const selected = options.find((o) => o.value === value);
  const isField = variant === 'field';

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'relative w-full whitespace-nowrap rounded-control border bg-surface pr-[34px] pl-3 text-left',
          isField ? 'h-10 text-sm' : 'h-[38px] text-[13px] font-medium',
          invalid ? 'border-danger' : 'border-line',
          !selected && isField && 'text-faint',
        )}
      >
        {selected?.label ?? placeholder}
        <ChevronDown size={14} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-faint" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[52]" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className={cn(
              'absolute top-11 left-0 z-[53] max-h-80 overflow-auto rounded-tile border border-line bg-surface p-1 shadow-pop',
              isField ? 'w-full' : 'min-w-60',
              menuClassName,
            )}
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full flex-col gap-px rounded-item px-2.5 py-[7px] text-left text-[13px] hover:bg-subtle',
                    option.value === value && 'bg-brand-light hover:bg-brand-light',
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  {option.sub && <span className="text-xs text-faint">{option.sub}</span>}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
