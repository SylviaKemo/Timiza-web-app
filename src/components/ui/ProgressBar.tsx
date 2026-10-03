import { cn } from '@/lib/cn';

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  size?: 'sm' | 'md';
  /** Grey fill, used for completed projects. */
  muted?: boolean;
  /** Overrides the fill colour class (e.g. over-capacity workload). */
  fillClassName?: string;
  className?: string;
}

export function ProgressBar({ value, size = 'sm', muted = false, fillClassName, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('overflow-hidden rounded-full bg-track', size === 'md' ? 'h-2' : 'h-1.5', className)}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-400 ease-out',
          fillClassName ?? (muted ? 'bg-check-off' : 'bg-brand'),
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** Progress bar with the percentage to its right. */
export function ProgressWithLabel({ value, muted, className }: Pick<ProgressBarProps, 'value' | 'muted' | 'className'>) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <ProgressBar value={value} muted={muted} className="flex-1" />
      <span className="w-[34px] text-right text-[13px] font-medium">{value}%</span>
    </div>
  );
}
