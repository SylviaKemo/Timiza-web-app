'use client';

import { useMemo, useState } from 'react';
import { AddButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tabs } from '@/components/ui/Tabs';
import {
  DEFAULT_MY_TASKS_FILTERS,
  MY_TASKS_TABS,
  countByTab,
  filterMyTasks,
  getMyTasks,
  getTodayProgress,
  groupMyTasks,
  hasActiveTaskFilters,
  type MyTasksFilters,
  type MyTasksTab,
} from '@/lib/derive';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import { MyTasksToolbar } from './MyTasksToolbar';
import { TaskGroupList } from './TaskGroupList';

const EMPTY_STATES: Record<MyTasksTab, [title: string, description: string]> = {
  today: ["You're clear for today", 'Nothing due today or overdue.'],
  upcoming: ['Nothing scheduled ahead', 'New tasks with a future due date will show here.'],
  all: ['No open tasks', 'Everything assigned to you is done.'],
  completed: ['No completed tasks yet', 'Tasks you check off will move here.'],
};

/** "What do I need to get done?" — tasks assigned to the current user. */
export function MyTasksView() {
  const projects = useAppStore((s) => s.data.projects);
  const openTaskModal = useUiStore((s) => s.openTaskModal);
  const [tab, setTab] = useState<MyTasksTab>('today');
  const [filters, setFilters] = useState<MyTasksFilters>(DEFAULT_MY_TASKS_FILTERS);

  const myTasks = useMemo(() => getMyTasks(projects), [projects]);
  const filtered = useMemo(() => filterMyTasks(myTasks, filters), [myTasks, filters]);
  const groups = useMemo(() => groupMyTasks(filtered, tab), [filtered, tab]);
  const today = getTodayProgress(myTasks);
  const myProjects = useMemo(() => [...new Map(myTasks.map((t) => [t.project.id, t.project])).values()], [myTasks]);

  const isFiltered = hasActiveTaskFilters(filters);
  const [emptyTitle, emptyDescription] = isFiltered
    ? ['No tasks match your filters', 'Try a different search, project or priority.']
    : EMPTY_STATES[tab];

  return (
    <div className="flex max-w-[1000px] flex-col gap-6">
      <PageHeader
        title="My Tasks"
        subtitle="Stay on top of your work across every project."
        actions={<AddButton onClick={() => openTaskModal()}>Add task</AddButton>}
      />

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-[13px] font-medium text-muted">Today&apos;s progress</span>
        <ProgressBar value={today.pct} className="min-w-[120px] flex-[0_1_280px]" />
        <span className="text-[13px] text-muted">
          <span className="font-semibold text-ink">{today.done}</span> of {today.total} completed
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <Tabs
          value={tab}
          onChange={setTab}
          items={MY_TASKS_TABS.map((t) => ({ value: t.key, label: t.label, count: countByTab(filtered, t.key) }))}
        />
        <MyTasksToolbar
          filters={filters}
          projects={myProjects}
          onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        />
      </div>

      {groups.length > 0 ? (
        <TaskGroupList groups={groups} />
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </div>
  );
}
