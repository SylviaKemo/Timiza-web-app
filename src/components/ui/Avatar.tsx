import { PEOPLE } from '@/lib/constants';
import { cn } from '@/lib/cn';
import type { PersonId } from '@/lib/types';

interface AvatarProps {
  initials: string;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  xs: 'size-5 text-[9px]',
  sm: 'size-7 text-[11px]',
  md: 'size-8 text-[13px]',
  lg: 'size-10 text-sm',
};

export function Avatar({ initials, title, size = 'sm', className }: AvatarProps) {
  return (
    <span
      title={title}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-neutral font-semibold text-muted',
        SIZES[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** Up to `max` overlapping avatars followed by "+N". */
export function AvatarStack({ people, max = 3 }: { people: PersonId[]; max?: number }) {
  const extra = people.length - max;
  return (
    <div className="flex items-center">
      {people.slice(0, max).map((id, i) => (
        <Avatar
          key={id}
          initials={id}
          title={PEOPLE[id]}
          className={cn('border-2 border-surface text-[10px]', i > 0 && '-ml-2')}
        />
      ))}
      {extra > 0 && <span className="ml-1.5 text-xs text-faint">+{extra}</span>}
    </div>
  );
}
