'use client';

import { useState } from 'react';
import { PriorityBadge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { cn } from '@/lib/cn';
import { formatWhen } from '@/lib/dates';
import { isTaskOverdue, projectLabel } from '@/lib/derive';
import type { TaskWithProject } from '@/lib/types';
import { completeTask, reopenTask } from '@/store/commands';
import { useUiStore } from '@/store/useUiStore';
import { TaskRowMenu } from './TaskRowMenu';

/** Time the row shows its checked/faded state before the task moves to Done. */
const COMPLETE_DELAY_MS = 700;

export function TaskRow({ task }: { task: TaskWithProject }) {
  const { isCompact } = useBreakpoints();
  const openDrawer = useUiStore((s) => s.openDrawer);
  const [completing, setCompleting] = useState(false);

  const isDone = task.status === 'done';
  const checked = isDone || completing;

  const startComplete = () => {
    if (completing) return;
    setCompleting(true);
    setTimeout(() => {
      completeTask(task.project.id, task.id);
      setCompleting(false);
    }, COMPLETE_DELAY_MS);
  };

  const open = () => openDrawer({ projectId: task.project.id, taskId: task.id });
  const subLine = isCompact
    ? `${projectLabel(task.project)} · ${task.pri} · ${formatWhen(task.due)}`
    : projectLabel(task.project);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === 'Enter' && open()}
      className={cn(
        'grid cursor-pointer items-center transition-opacity duration-350 hover:bg-row-hover',
        isCompact
          ? 'grid-cols-[20px_minmax(0,1fr)_40px] gap-3 py-3 pr-1 pl-4'
          : 'grid-cols-[20px_minmax(0,1fr)_84px_96px_32px] gap-4 py-3 pr-3 pl-5',
        completing && 'opacity-50',
      )}
    >
      <Checkbox
        checked={checked}
        label={isDone ? 'Mark incomplete' : 'Mark complete'}
        onToggle={(e) => {
          e.stopPropagation();
          if (isDone) reopenTask(task.project.id, task.id);
          else startComplete();
        }}
      />

      <div className="min-w-0">
        <div className={cn('truncate text-sm font-medium transition-colors', checked && 'text-faint line-through')}>
          {task.title}
        </div>
        <div className="mt-0.5 text-xs text-faint">{subLine}</div>
      </div>

      {!isCompact && (
        <>
          <div>
            <PriorityBadge priority={task.pri} />
          </div>
          <div className={cn('text-[13px]', isTaskOverdue(task) ? 'text-danger' : 'text-muted')}>
            {formatWhen(task.due)}
          </div>
        </>
      )}

      <TaskRowMenu task={task} onComplete={startComplete} />
    </div>
  );
}
