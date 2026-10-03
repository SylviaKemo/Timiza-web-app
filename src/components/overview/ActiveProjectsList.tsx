'use client';

import { ProjectStatusBadge } from '@/components/ui/Badge';
import { ListCard } from '@/components/ui/Card';
import { ProgressWithLabel } from '@/components/ui/ProgressBar';
import { ArrowLink, SectionHeader } from '@/components/ui/PageHeader';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { formatShort } from '@/lib/dates';
import type { Overview } from '@/lib/derive';

/** Top 5 active projects by due date. Below 1200px the progress bar gets its own row. */
export function ActiveProjectsList({ projects }: { projects: Overview['topProjects'] }) {
  const { openProject } = useAppNavigation();

  return (
    <div className="flex flex-col gap-3.5">
      <SectionHeader title="Active projects" aside={<ArrowLink href="/projects">View all</ArrowLink>} />
      <ListCard>
        {projects.map(({ project, stats }) => (
          <button
            key={project.id}
            type="button"
            onClick={() => openProject(project.id)}
            className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 px-4 py-3.5 text-left hover:bg-row-hover wide:grid-cols-[minmax(0,1.6fr)_104px_64px_minmax(120px,1fr)] wide:gap-5 wide:px-5 wide:py-4"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{project.name}</div>
              <div className="mt-0.5 text-[13px] text-faint">{project.client}</div>
            </div>
            <div>
              <ProjectStatusBadge status={stats.status} />
            </div>
            <div className="hidden text-[13px] text-muted wide:block">{formatShort(project.due)}</div>
            <ProgressWithLabel value={stats.pct} className="col-span-full wide:col-span-1" />
          </button>
        ))}
      </ListCard>
    </div>
  );
}
