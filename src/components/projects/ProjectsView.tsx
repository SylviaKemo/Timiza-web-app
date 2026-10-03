'use client';

import { useMemo } from 'react';
import { AddButton } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { PillTabs } from '@/components/ui/Tabs';
import {
  countProjectsByStatus,
  filterAndSortProjects,
  getVisibleProjects,
  type ProjectStatusFilter,
} from '@/lib/derive';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import { ProjectTable } from './ProjectTable';
import { ProjectsToolbar } from './ProjectsToolbar';

const STATUS_TABS: Array<{ value: ProjectStatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'risk', label: 'At risk' },
  { value: 'done', label: 'Completed' },
];

/** "How is each client project doing?" */
export function ProjectsView() {
  const allProjects = useAppStore((s) => s.data.projects);
  const clients = useAppStore((s) => s.data.clients);
  const filters = useUiStore((s) => s.projectFilters);
  const { setProjectFilters, resetProjectFilters, openProjectModal } = useUiStore.getState();

  const visible = useMemo(() => getVisibleProjects(allProjects), [allProjects]);
  const counts = useMemo(() => countProjectsByStatus(visible), [visible]);
  const rows = useMemo(() => filterAndSortProjects(visible, filters), [visible, filters]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Projects"
        subtitle="Manage and track all your client projects."
        actions={<AddButton onClick={() => openProjectModal({ mode: 'create' })}>New project</AddButton>}
      />

      <ProjectsToolbar filters={filters} clients={clients} onChange={setProjectFilters} />

      <div className="flex flex-col gap-3">
        <PillTabs
          items={STATUS_TABS.map((tab) => ({ ...tab, count: counts[tab.value] }))}
          value={filters.status}
          onChange={(status) => setProjectFilters({ status })}
        />
        <ProjectTable projects={rows} onClearFilters={resetProjectFilters} />
        <div className="text-[13px] text-faint">
          Showing {rows.length} of {visible.length} projects
        </div>
      </div>
    </div>
  );
}
