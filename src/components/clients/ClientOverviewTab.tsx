'use client';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/PageHeader';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { cn } from '@/lib/cn';
import { daysFromToday, formatMonthYear, formatShort } from '@/lib/dates';
import { getClientDeadlines, type ClientDeadline, type ClientInfo } from '@/lib/derive';
import { useUiStore } from '@/store/useUiStore';
import { ClientProjectList } from './ClientProjectList';

/** Key facts, active projects and upcoming deadlines for one client. */
export function ClientOverviewTab({ info }: { info: ClientInfo }) {
  const facts = [
    { label: 'Active projects', value: info.active.length },
    { label: 'Completed projects', value: info.completed.length },
    { label: 'Primary contact', value: info.client.contact },
    { label: 'Working with us since', value: formatMonthYear(info.client.since) },
  ];

  return (
    <div className="flex flex-col gap-9">
      <Card className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-6 gap-y-5 px-6 py-5">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-2">
            <div className="text-[13px] font-medium text-muted">{fact.label}</div>
            <div className="text-[22px] font-semibold tracking-[-0.01em]">{fact.value}</div>
          </div>
        ))}
      </Card>

      <div className="flex flex-wrap items-start gap-x-8 gap-y-9">
        <div className="flex min-w-0 flex-[2_1_460px] flex-col gap-3.5">
          <SectionHeader title="Active projects" />
          {info.active.length > 0 ? (
            <ClientProjectList projects={info.active} />
          ) : (
            <EmptyState
              align="left"
              title="No active projects"
              description="Start a new project for this client to track work here."
            />
          )}
        </div>

        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5">
          <SectionHeader title="Upcoming deadlines" />
          <DeadlineList deadlines={getClientDeadlines(info)} />
        </div>
      </div>
    </div>
  );
}

function DeadlineList({ deadlines }: { deadlines: ClientDeadline[] }) {
  const { openProject } = useAppNavigation();
  const openDrawer = useUiStore((s) => s.openDrawer);

  if (deadlines.length === 0) return <p className="text-[13px] text-muted">No upcoming deadlines.</p>;

  const open = (deadline: ClientDeadline) =>
    deadline.kind === 'task'
      ? openDrawer({ projectId: deadline.project.id, taskId: deadline.task.id })
      : openProject(deadline.project.id, 'overview');

  return (
    <div className="flex flex-col">
      {deadlines.map((deadline) => (
        <button
          key={deadline.kind === 'task' ? deadline.task.id : `delivery-${deadline.project.id}`}
          type="button"
          onClick={() => open(deadline)}
          className="grid grid-cols-[56px_minmax(0,1fr)] gap-4 border-b border-line px-1 py-3 text-left hover:bg-row-hover"
        >
          <div className={cn('text-[13px] font-semibold', daysFromToday(deadline.date) <= 2 && 'text-brand-dark')}>
            {formatShort(deadline.date)}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium">{deadline.title}</div>
            <div className="mt-0.5 text-xs text-faint">{deadline.project.name}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
