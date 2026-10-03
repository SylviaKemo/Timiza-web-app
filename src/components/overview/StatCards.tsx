import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import type { Overview } from '@/lib/derive';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  note: string;
  highlight?: boolean;
}

export function StatCards({ overview }: { overview: Overview }) {
  const attention = overview.attention.length;
  const stats: Stat[] = [
    {
      label: 'Active projects',
      value: overview.activeCount,
      note: `${overview.finishingThisMonth} finishing this month`,
    },
    {
      label: 'Tasks due this week',
      value: overview.dueThisWeek.length,
      note: `Tasks across ${overview.dueThisWeekProjectCount} projects`,
    },
    {
      label: 'Tasks completed',
      value: overview.doneTasks,
      suffix: ` / ${overview.totalTasks}`,
      note: 'Across active projects',
    },
    {
      label: 'Needs attention',
      value: attention,
      note: attention ? `${overview.lateCount} overdue · ${attention - overview.lateCount} at risk` : 'Nothing overdue',
      highlight: attention > 0,
    },
  ];

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 desktop:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex flex-col gap-3.5 px-5 pt-5 pb-[18px]">
          <div className="text-[13px] font-medium text-muted">{stat.label}</div>
          <div className={cn('text-[28px] font-semibold tracking-[-0.02em]', stat.highlight && 'text-brand-dark')}>
            {stat.value}
            {stat.suffix && <span className="text-base font-medium text-faint">{stat.suffix}</span>}
          </div>
          <div className="text-[13px] text-faint">{stat.note}</div>
        </Card>
      ))}
    </section>
  );
}
