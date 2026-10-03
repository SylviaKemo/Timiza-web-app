import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'danger';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:opacity-88',
  secondary: 'border border-line bg-surface hover:border-line-strong',
  danger: 'text-danger hover:bg-danger-light',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** Leading icon. Use `<AddButton>` for the standard "+ New …" button. */
  icon?: ReactNode;
}

export function Button({ variant = 'secondary', icon, className, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-[38px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-control text-sm font-medium transition-opacity',
        icon ? 'pr-4 pl-3' : 'px-3.5',
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

/** Primary button with a leading plus icon — "New project", "Add task", … */
export function AddButton(props: Omit<ButtonProps, 'variant' | 'icon'>) {
  return <Button variant="primary" icon={<Plus size={16} strokeWidth={2} />} {...props} />;
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: 'sm' | 'md';
}

/** Square icon-only button. `md` is the bordered 38px variant, `sm` the borderless 32px one. */
export function IconButton({ label, size = 'sm', className, children, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'relative flex shrink-0 items-center justify-center text-muted',
        size === 'md'
          ? 'size-[38px] rounded-control border border-line bg-surface hover:border-line-strong'
          : 'size-8 rounded-item hover:bg-subtle',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
