import type { ReactNode } from 'react';
import { TASK_STATUS_LABEL } from '@/lib/constants';
import { cn } from '@/lib/cn';
import type { Priority, ProjectStatus, TaskStatus } from '@/lib/types';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral';

const TONES: Record<BadgeTone, string> = {
  success: 'bg-success-light text-success',
  warning: 'bg-brand-light text-brand-dark',
  danger: 'bg-danger-light text-danger',
  neutral: 'bg-neutral text-muted',
};

interface BadgeProps {
  tone: BadgeTone;
  children: ReactNode;
  /** Shows the 6px status dot. */
  dot?: boolean;
  size?: 'sm' | 'md';
}

export function Badge({ tone, children, dot = true, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-badge text-xs font-medium',
        size === 'md' ? 'h-6 px-[9px]' : 'h-[22px] px-2',
        TONES[tone],
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export const PROJECT_STATUS: Record<ProjectStatus, { label: string; tone: BadgeTone }> = {
  on: { label: 'On track', tone: 'success' },
  risk: { label: 'At risk', tone: 'warning' },
  late: { label: 'Overdue', tone: 'danger' },
  done: { label: 'Completed', tone: 'neutral' },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, tone } = PROJECT_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}

const TASK_STATUS_TONE: Record<TaskStatus, BadgeTone> = { todo: 'neutral', progress: 'warning', done: 'success' };

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge tone={TASK_STATUS_TONE[status]} size="md">
      {TASK_STATUS_LABEL[status]}
    </Badge>
  );
}

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'border-brand-light bg-brand-light text-brand-dark',
  Medium: 'border-neutral bg-neutral text-muted',
  Low: 'border-line bg-surface text-faint',
};

interface PriorityBadgeProps {
  priority: Priority;
  /** "High priority" instead of "High". */
  long?: boolean;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, long = false, size = 'sm' }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-badge border text-xs font-medium',
        size === 'md' ? 'h-6 px-[9px]' : 'h-[22px] px-2',
        PRIORITY_STYLES[priority],
      )}
    >
      {long ? `${priority} priority` : priority}
    </span>
  );
}
