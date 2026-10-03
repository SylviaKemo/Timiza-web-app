import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string | null;
  children: ReactNode;
  className?: string;
}

/** Form row: label, control and an optional validation message. */
export function Field({ label, required, error, children, className }: FieldProps) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[13px] font-medium">
        {label}
        {required && <span className="text-brand-dark"> *</span>}
      </span>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </label>
  );
}

export function FieldError({ children }: { children: ReactNode }) {
  return <span className="text-xs text-danger">{children}</span>;
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function TextInput({ invalid, className, ...props }: TextInputProps) {
  return (
    <input
      className={cn(
        'h-10 rounded-control border bg-surface px-3 text-sm focus-ring',
        invalid ? 'border-danger' : 'border-line',
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      className={cn(
        'resize-y rounded-control border border-line bg-surface px-3 py-2.5 text-sm leading-normal focus-ring',
        className,
      )}
      {...props}
    />
  );
}

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void;
}

/** Toolbar search box: 280px on desktop, full width under 900px. */
export function SearchInput({ onChange, className, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative min-w-[200px] flex-[1_1_100%] desktop:flex-[0_1_280px]', className)}>
      <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint" />
      <input
        type="search"
        onChange={(e) => onChange(e.target.value)}
        className="h-[38px] w-full rounded-control border border-line bg-surface pr-3 pl-9 text-sm focus-ring"
        {...props}
      />
    </div>
  );
}
