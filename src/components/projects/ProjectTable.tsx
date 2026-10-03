'use client';

import { AvatarStack } from '@/components/ui/Avatar';
import { ProjectStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressWithLabel } from '@/components/ui/ProgressBar';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { cn } from '@/lib/cn';
import { formatShort } from '@/lib/dates';
import { getProjectStats, type ProjectStats } from '@/lib/derive';
import type { Project } from '@/lib/types';
import { useUiStore } from '@/store/useUiStore';
import { ProjectRowMenu } from './ProjectRowMenu';

const DESKTOP_COLUMNS =
  'grid-cols-[minmax(200px,2fr)_minmax(110px,1.1fr)_minmax(150px,1.4fr)_96px_72px_112px_32px]';

interface ProjectTableProps {
  projects: Project[];
  onClearFilters: () => void;
}

/** Projects table on wide screens; stacked list rows below 1200px. */
export function ProjectTable({ projects, onClearFilters }: ProjectTableProps) {
  const { isCompact } = useBreakpoints();

  return (
    <Card className="overflow-x-auto">
      <div className={cn(!isCompact && 'min-w-[880px]')}>
        {!isCompact && (
          <div className={cn('grid gap-4 px-5 py-3 text-xs font-medium text-faint', DESKTOP_COLUMNS)}>
            <div>Project</div>
            <div>Client</div>
            <div>Progress</div>
            <div>Team</div>
            <div>Due date</div>
            <div>Status</div>
            <div />
          </div>
        )}

        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} compact={isCompact} />
        ))}

        {projects.length === 0 && (
          <div className="border-t border-divider px-5 py-12 text-center">
            <div className="text-sm font-medium">No projects match your filters</div>
            <Button className="mt-3 h-[34px] text-[13px]" onClick={onClearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

interface ProjectRowProps {
  project: Project;
  compact: boolean;
}

function ProjectRow({ project, compact }: ProjectRowProps) {
  const { openProject } = useAppNavigation();
  const highlighted = useUiStore((s) => s.highlightedProjectId === project.id);
  const stats = getProjectStats(project);

  const open = () => openProject(project.id);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === 'Enter' && open()}
      className={cn('cursor-pointer border-t border-divider hover:bg-row-hover', highlighted && 'bg-highlight')}
    >
      {compact ? <CompactRow project={project} stats={stats} /> : <DesktopRow project={project} stats={stats} />}
    </div>
  );
}

interface RowContentProps {
  project: Project;
  stats: ProjectStats;
}

const taskSummary = ({ total, done }: ProjectStats) => (total ? `${done} of ${total} tasks` : 'No tasks yet');

function DueDate({ project, stats, prefix = '' }: RowContentProps & { prefix?: string }) {
  const color = stats.status === 'late' ? 'text-danger' : project.completed ? 'text-faint' : 'text-muted';
  return (
    <div className={cn('text-[13px]', color)}>
      {prefix}
      {formatShort(project.due)}
    </div>
  );
}

function DesktopRow({ project, stats }: RowContentProps) {
  return (
    <div className={cn('grid items-center gap-4 px-5 py-4', DESKTOP_COLUMNS)}>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{project.name}</div>
        <div className="mt-0.5 text-xs text-faint">{taskSummary(stats)}</div>
      </div>
      <div className="truncate text-sm text-muted">{project.client}</div>
      <ProgressWithLabel value={stats.pct} muted={project.completed} />
      <AvatarStack people={project.team} />
      <DueDate project={project} stats={stats} />
      <div>
        <ProjectStatusBadge status={stats.status} />
      </div>
      <div className="justify-self-end">
        <ProjectRowMenu project={project} />
      </div>
    </div>
  );
}

/** Name | menu, then full-width progress, then due date | status. */
function CompactRow({ project, stats }: RowContentProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 px-4 py-3.5">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{project.name}</div>
        <div className="mt-0.5 text-xs text-faint">
          {project.client} · {taskSummary(stats)}
        </div>
      </div>
      <div className="justify-self-end">
        <ProjectRowMenu project={project} />
      </div>
      <ProgressWithLabel value={stats.pct} muted={project.completed} className="col-span-2" />
      <DueDate project={project} stats={stats} prefix="Due " />
      <div className="justify-self-end">
        <ProjectStatusBadge status={stats.status} />
      </div>
    </div>
  );
}
