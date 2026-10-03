import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  onChange: (value: string) => void;
  /** `filter` is the compact toolbar style, `field` the form-control style. */
  variant?: 'filter' | 'field';
}

/** Native select with the custom chevron. */
export function Select({ options, onChange, variant = 'filter', className, ...props }: SelectProps) {
  return (
    <div className={cn('relative', variant === 'field' && 'w-full')}>
      <select
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full appearance-none rounded-control border border-line bg-surface pr-[34px] pl-3 outline-none focus:border-brand',
          variant === 'field' ? 'h-10 text-sm' : 'h-[38px] text-[13px] font-medium',
          className,
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-faint" />
    </div>
  );
}
