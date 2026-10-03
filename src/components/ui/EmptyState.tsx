import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Card } from './Card';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export function EmptyState({ title, description, icon, action, align = 'center', className }: EmptyStateProps) {
  return (
    <Card
      className={cn(
        'flex flex-col gap-1',
        align === 'center' ? 'items-center px-6 py-10 text-center' : 'px-5 py-7',
        className,
      )}
    >
      {icon && <span className="mb-1.5 flex text-faint">{icon}</span>}
      <div className="text-sm font-medium">{title}</div>
      {description && <div className="text-[13px] leading-normal text-muted">{description}</div>}
      {action && <div className="mt-3">{action}</div>}
    </Card>
  );
}
