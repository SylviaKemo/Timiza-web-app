'use client';

import { Avatar } from '@/components/ui/Avatar';
import { ArrowLink, SectionHeader } from '@/components/ui/PageHeader';
import { PEOPLE } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { daysFromToday, formatWhen } from '@/lib/dates';
import { projectLabel } from '@/lib/derive';
import type { TaskWithProject } from '@/lib/types';
import { useUiStore } from '@/store/useUiStore';

/** Open tasks due in the next 7 days. Clicking a row opens the task drawer. */
export function UpcomingTasks({ tasks }: { tasks: TaskWithProject[] }) {
  const openDrawer = useUiStore((s) => s.openDrawer);

  return (
    <div className="flex flex-col gap-3.5">
      <SectionHeader title="Upcoming" aside={<ArrowLink href="/tasks">My tasks</ArrowLink>} />
      <div className="flex flex-col">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => openDrawer({ projectId: task.project.id, taskId: task.id })}
            className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-5 border-b border-line px-1 py-3.5 text-left hover:bg-row-hover"
          >
            <div className={cn('text-[13px] font-medium', daysFromToday(task.due) <= 2 ? 'text-brand-dark' : 'text-muted')}>
              {formatWhen(task.due)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">{task.title}</div>
              <div className="mt-0.5 text-[13px] text-faint">{projectLabel(task.project)}</div>
            </div>
            <Avatar initials={task.who} title={PEOPLE[task.who]} />
          </button>
        ))}
        {tasks.length === 0 && <p className="px-1 py-3.5 text-[13px] text-muted">Nothing due in the next 7 days.</p>}
      </div>
    </div>
  );
}
