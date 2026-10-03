import type { MouseEvent } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CheckboxProps {
  checked: boolean;
  onToggle: (e: MouseEvent<HTMLButtonElement>) => void;
  label: string;
}

/** 18px rounded checkbox: orange fill with a white check when checked. */
export function Checkbox({ checked, onToggle, label }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      title={label}
      onClick={onToggle}
      className={cn(
        'flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] p-0 text-white transition-colors duration-150 hover:border-brand',
        checked ? 'border-brand bg-brand' : 'border-check-off bg-surface',
      )}
    >
      {checked && <Check size={11} strokeWidth={3} />}
    </button>
  );
}
