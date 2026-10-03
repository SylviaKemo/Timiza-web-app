'use client';

import { ProjectStatusBadge } from '@/components/ui/Badge';
import { ListCard } from '@/components/ui/Card';
import { ProgressWithLabel } from '@/components/ui/ProgressBar';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { formatShort } from '@/lib/dates';
import { getProjectStats } from '@/lib/derive';
import type { Project } from '@/lib/types';

/** Project cards (name, progress, due date and status). Clicking opens the project's Overview tab. */
export function ClientProjectList({ projects, className }: { projects: Project[]; className?: string }) {
  const { openProject } = useAppNavigation();

  return (
    <ListCard className={className}>
      {projects.map((project) => {
        const stats = getProjectStats(project);
        return (
          <button
            key={project.id}
            type="button"
            onClick={() => openProject(project.id, 'overview')}
            className="flex w-full flex-col gap-2.5 px-5 py-4 text-left hover:bg-row-hover"
          >
            <div className="text-[15px] font-medium">{project.name}</div>
            <ProgressWithLabel value={stats.pct} muted={project.completed} className="w-full" />
            <div className="flex w-full items-center justify-between">
              <span className="text-[13px] text-muted">
                {project.completed ? 'Completed' : `Due ${formatShort(project.due)}`}
              </span>
              <ProjectStatusBadge status={stats.status} />
            </div>
          </button>
        );
      })}
    </ListCard>
  );
}
