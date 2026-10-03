import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** White surface with a 1px border and 14px radius. Cards never have a shadow. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-card border border-line bg-surface', className)} {...props} />;
}

/** Card whose children are separated by divider lines (lists, tables). */
export function ListCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Card className={cn('divide-y divide-divider overflow-hidden', className)} {...props} />;
}
