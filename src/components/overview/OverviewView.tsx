'use client';

import { useMemo } from 'react';
import { Bell, Search } from 'lucide-react';
import { AddButton, IconButton } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { CURRENT_USER, TODAY } from '@/lib/constants';
import { formatLong } from '@/lib/dates';
import { getOverview } from '@/lib/derive';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import { ActiveProjectsList } from './ActiveProjectsList';
import { NeedsAttention } from './NeedsAttention';
import { StatCards } from './StatCards';
import { TeamWorkload } from './TeamWorkload';
import { UpcomingTasks } from './UpcomingTasks';

/** "What's happening across the agency?" */
export function OverviewView() {
  const projects = useAppStore((s) => s.data.projects);
  const openProjectModal = useUiStore((s) => s.openProjectModal);
  const overview = useMemo(() => getOverview(projects), [projects]);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title={`Good morning, ${CURRENT_USER.firstName}`}
        subtitle={`${formatLong(TODAY)} · Here's what's happening today.`}
        actions={
          <>
            <IconButton label="Search" size="md">
              <Search />
            </IconButton>
            <IconButton label="Notifications" size="md">
              <Bell />
              <span className="absolute top-[9px] right-2.5 size-1.5 rounded-full bg-brand" />
            </IconButton>
            <AddButton className="ml-1" onClick={() => openProjectModal({ mode: 'create' })}>
              New project
            </AddButton>
          </>
        }
      />

      <StatCards overview={overview} />

      <section className="flex flex-wrap items-start gap-x-8 gap-y-10">
        <div className="min-w-0 flex-[2_1_520px]">
          <ActiveProjectsList projects={overview.topProjects} />
        </div>
        <div className="min-w-0 flex-[1_1_300px]">
          <NeedsAttention items={overview.attention} />
        </div>
        <div className="min-w-0 flex-[2_1_520px]">
          <UpcomingTasks tasks={overview.upcoming} />
        </div>
        <div className="min-w-0 flex-[1_1_300px]">
          <TeamWorkload people={overview.workload} />
        </div>
      </section>
    </div>
  );
}
