'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { ProjectStatusBadge } from '@/components/ui/Badge';
import { AddButton, Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { BackLink, PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import type { ProjectTab } from '@/hooks/useAppNavigation';
import { formatLogTime } from '@/lib/dates';
import { getProjectStats } from '@/lib/derive';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import { ProjectOverviewTab } from './ProjectOverviewTab';
import { ProjectSummary } from './ProjectSummary';
import { TaskBoard } from './TaskBoard';

interface ProjectDetailsViewProps {
  projectId: string;
  initialTab: ProjectTab;
}

/** "How is this one project going?" */
export function ProjectDetailsView({ projectId, initialTab }: ProjectDetailsViewProps) {
  const project = useAppStore((s) => s.data.projects.find((p) => p.id === projectId));
  const markProjectOpened = useAppStore((s) => s.markProjectOpened);
  const { openProjectModal, openTaskModal } = useUiStore.getState();
  const [tab, setTab] = useState<ProjectTab>(initialTab);

  // Every visit (link, sidebar, direct URL) counts as "recently opened".
  const exists = !!project;
  useEffect(() => {
    if (exists) markProjectOpened(projectId);
  }, [exists, projectId, markProjectOpened]);

  if (!project || project.archived) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink href="/projects">Projects</BackLink>
        <EmptyState title="Project not found" description="It may have been archived or removed." />
      </div>
    );
  }

  const stats = getProjectStats(project);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4">
        <BackLink href="/projects">Projects</BackLink>
        <PageHeader
          title={project.name}
          subtitle={
            <div className="mt-0.5 flex items-center gap-2.5">
              <span className="font-medium text-ink">{project.client}</span>
              <span className="text-faint">·</span>
              <ProjectStatusBadge status={stats.status} />
            </div>
          }
          actions={
            <>
              <Button onClick={() => openProjectModal({ mode: 'edit', projectId: project.id })}>Edit project</Button>
              <AddButton onClick={() => openTaskModal(project.id)}>Add task</AddButton>
            </>
          }
        />
      </div>

      <ProjectSummary project={project} stats={stats} />

      <div className="flex flex-col gap-6">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'overview', label: 'Overview' },
            { value: 'tasks', label: 'Tasks', count: stats.total },
            { value: 'files', label: 'Files' },
            { value: 'activity', label: 'Activity' },
          ]}
        />

        {tab === 'overview' && <ProjectOverviewTab project={project} />}
        {tab === 'tasks' && <TaskBoard project={project} />}
        {tab === 'files' && (
          <EmptyState
            icon={<FileText size={22} />}
            title="No files yet"
            description="Briefs, contracts and deliverables for this project will live here."
            className="py-12"
          />
        )}
        {tab === 'activity' && (
          <ActivityFeed
            layout="inline"
            items={project.activity.map((entry, i) => ({
              key: `${i}-${entry.text}`,
              text: entry.text,
              meta: formatLogTime(entry),
            }))}
          />
        )}
      </div>
    </div>
  );
}
