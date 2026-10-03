import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/cn';

interface LogoMarkProps {
  size?: number;
  /** Colour of the two lower bars: white on the ink sidebar, ink on light backgrounds. */
  ink?: string;
}

/** "Workload" mark: three left-aligned bars getting shorter — a big task broken into smaller ones. */
export function LogoMark({ size = 24, ink = '#FFFFFF' }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="block shrink-0">
      <rect x="4" y="5" width="24" height="5.5" rx="2.75" fill="#F97316" />
      <rect x="4" y="13.25" width="17" height="5.5" rx="2.75" fill={ink} />
      <rect x="4" y="21.5" width="10" height="5.5" rx="2.75" fill={ink} />
    </svg>
  );
}

interface LogoProps {
  size?: 'md' | 'sm';
  className?: string;
}

/** Mark + "Timiza" wordmark, for dark (ink) backgrounds. */
export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <div className={cn('flex items-center', size === 'md' ? 'gap-2.5' : 'gap-2', className)}>
      <LogoMark size={size === 'md' ? 24 : 20} />
      <span className={cn('font-bold tracking-[-0.02em]', size === 'md' ? 'text-[19px]' : 'text-[17px]')}>
        {APP_NAME}
      </span>
    </div>
  );
}
