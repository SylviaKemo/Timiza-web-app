'use client';

import type { ReactNode } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { PEOPLE } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { formatShort } from '@/lib/dates';
import type { Project, ProjectHealth } from '@/lib/types';
import { useAppStore } from '@/store/useAppStore';

const HEALTH_OPTIONS: Array<{ value: ProjectHealth; label: string; activeClassName: string }> = [
  { value: 'on', label: 'On track', activeClassName: 'border-success-border bg-success-light text-success' },
  { value: 'risk', label: 'At risk', activeClassName: 'border-brand-border bg-brand-light text-brand-dark' },
];

/** Details card (client, lead, timeline, team, health) and the description. */
export function ProjectOverviewTab({ project }: { project: Project }) {
  const setProjectHealth = useAppStore((s) => s.setProjectHealth);

  return (
    <div className="flex flex-wrap items-start gap-6">
      <Card className="flex-[1_1_320px] divide-y divide-divider px-6 py-2">
        <DetailRow label="Client">{project.client}</DetailRow>
        <DetailRow label="Project lead">{PEOPLE[project.lead] ?? '—'}</DetailRow>
        <DetailRow label="Timeline">
          {formatShort(project.start)} — {formatShort(project.due)}
        </DetailRow>
        <DetailRow label="Team" compact>
          <div className="flex flex-wrap gap-1.5">
            {project.team.map((id) => (
              <span key={id} className="inline-flex h-7 items-center gap-1.5 rounded-full bg-subtle pr-2.5 pl-1 text-[13px] font-normal">
                <Avatar initials={id} size="xs" className="bg-surface" />
                {PEOPLE[id]}
              </span>
            ))}
          </div>
        </DetailRow>
        <DetailRow label="Health" compact>
          <div className="flex gap-1.5">
            {HEALTH_OPTIONS.map((option) => {
              const selected = project.health === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => !selected && setProjectHealth(project.id, option.value)}
                  className={cn(
                    'h-7 rounded-item border px-2.5 text-[13px] font-medium',
                    selected ? option.activeClassName : 'border-line bg-surface text-muted',
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </DetailRow>
      </Card>

      <div className="flex flex-[1_1_320px] flex-col gap-2.5">
        <h2 className="text-lg font-semibold">Description</h2>
        <p className="max-w-[60ch] text-sm leading-[1.65] text-pretty text-muted">
          {project.desc || 'No description yet.'}
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, compact = false, children }: { label: string; compact?: boolean; children: ReactNode }) {
  return (
    <div className={cn('grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4 text-sm', compact ? 'py-3' : 'py-3.5')}>
      <div className="text-muted">{label}</div>
      <div className="font-medium">{children}</div>
    </div>
  );
}
