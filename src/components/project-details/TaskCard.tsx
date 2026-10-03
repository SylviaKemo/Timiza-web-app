'use client';

import type { DragEvent } from 'react';
import { PriorityBadge } from '@/components/ui/Badge';
import { firstName } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { formatShort } from '@/lib/dates';
import { isTaskOverdue } from '@/lib/derive';
import type { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  dragging: boolean;
  onOpen: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

/** Kanban card: title, priority and "Maya · Oct 8". Draggable between columns. */
export function TaskCard({ task, dragging, onOpen, onDragStart, onDragEnd }: TaskCardProps) {
  const done = task.status === 'done';

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className={cn(
        'flex cursor-pointer flex-col gap-2.5 rounded-tile border border-line bg-surface p-3.5 hover:border-line-strong',
        dragging && 'opacity-40',
      )}
    >
      <div className={cn('text-sm leading-[1.4] font-medium', done && 'text-muted')}>{task.title}</div>
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
        <PriorityBadge priority={task.pri} long />
        <span className={cn('whitespace-nowrap text-xs', isTaskOverdue(task) ? 'text-danger' : 'text-faint')}>
          {firstName(task.who)} · {formatShort(task.due)}
        </span>
      </div>
    </div>
  );
}
