'use client';

import { Badge } from '@/components/ui/Badge';
import { ListCard } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLink, SectionHeader } from '@/components/ui/PageHeader';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { formatShort } from '@/lib/dates';
import { projectLabel, type AttentionItem } from '@/lib/derive';

function describe({ project, stats }: AttentionItem): string {
  const due = `Project due ${formatShort(project.due)}.`;
  const overdue = stats.overdue.length;
  if (!overdue) return `Marked at risk. ${due}`;
  const names = stats.overdue.slice(0, 2).map((t) => t.title).join(', ');
  return `${overdue} task${overdue > 1 ? 's' : ''} overdue: ${names}. ${due}`;
}

export function NeedsAttention({ items }: { items: AttentionItem[] }) {
  const { openProject } = useAppNavigation();

  return (
    <div className="flex flex-col gap-3.5">
      <SectionHeader title="Needs attention" aside={items.length ? `${items.length} projects` : undefined} />
      {items.length === 0 ? (
        <EmptyState
          align="left"
          title="Nothing needs you right now"
          description="All projects are on track and nothing is overdue."
        />
      ) : (
        <ListCard>
          {items.map((item) => (
            <div key={item.project.id} className="flex flex-col gap-1.5 px-5 py-[18px]">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">{projectLabel(item.project)}</div>
                {item.severity === 'late' ? <Badge tone="danger">Overdue</Badge> : <Badge tone="warning">At risk</Badge>}
              </div>
              <p className="text-[13px] leading-normal text-pretty text-muted">{describe(item)}</p>
              <div className="mt-1">
                <ArrowLink onClick={() => openProject(item.project.id, 'tasks')}>Review tasks</ArrowLink>
              </div>
            </div>
          ))}
        </ListCard>
      )}
    </div>
  );
}
