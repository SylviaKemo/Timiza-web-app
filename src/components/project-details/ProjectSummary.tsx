import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/cn';
import { daysFromToday, formatShort } from '@/lib/dates';
import type { ProjectStats } from '@/lib/derive';
import type { Project } from '@/lib/types';

function dueNote(project: Project): { text: string; overdue: boolean } {
  if (project.completed) return { text: 'Completed', overdue: false };
  if (!project.due) return { text: '', overdue: false };
  const left = daysFromToday(project.due);
  if (left < 0) return { text: `${-left} days overdue`, overdue: true };
  if (left === 0) return { text: 'Due today', overdue: false };
  return { text: `${left} days left`, overdue: false };
}

/** Progress and due-date summary card at the top of a project. */
export function ProjectSummary({ project, stats }: { project: Project; stats: ProjectStats }) {
  const note = dueNote(project);

  return (
    <Card className="flex flex-wrap items-end gap-x-14 gap-y-5 px-6 py-5">
      <div className="flex flex-[1_1_320px] flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <div className="text-[13px] font-medium text-muted">Progress</div>
          <div className="text-[13px] text-faint">
            {stats.total ? `${stats.done} of ${stats.total} tasks done · ${stats.inProgress} in progress` : 'No tasks yet'}
          </div>
        </div>
        <div className="text-[28px] font-semibold tracking-[-0.02em]">{stats.pct}%</div>
        <ProgressBar value={stats.pct} size="md" />
      </div>

      <div className="flex min-w-[140px] flex-col gap-3">
        <div className="text-[13px] font-medium text-muted">Due date</div>
        <div className="text-[28px] font-semibold tracking-[-0.02em]">{project.due ? formatShort(project.due) : '—'}</div>
        <div className={cn('h-2 text-[13px] leading-2', note.overdue ? 'text-danger' : 'text-faint')}>{note.text}</div>
      </div>
    </Card>
  );
}
