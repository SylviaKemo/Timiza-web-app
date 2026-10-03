'use client';

import { useMemo, useState } from 'react';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { Avatar } from '@/components/ui/Avatar';
import { AddButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { BackLink } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { formatLogTime } from '@/lib/dates';
import { getClientActivity, getClientInfo, initialsOf, isClientActive } from '@/lib/derive';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import { ClientOverviewTab } from './ClientOverviewTab';
import { ClientProjectList } from './ClientProjectList';
import { ClientStatusBadge } from './ClientStatusBadge';

type ClientTab = 'overview' | 'projects' | 'activity';

/** "What's happening with this client's work?" */
export function ClientDetailsView({ clientId }: { clientId: string }) {
  const client = useAppStore((s) => s.data.clients.find((c) => c.id === clientId));
  const projects = useAppStore((s) => s.data.projects);
  const openProjectModal = useUiStore((s) => s.openProjectModal);
  const [tab, setTab] = useState<ClientTab>('overview');

  const info = useMemo(() => (client ? getClientInfo(client, projects) : null), [client, projects]);

  if (!info) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink href="/clients">Clients</BackLink>
        <EmptyState title="Client not found" description="It may have been removed." />
      </div>
    );
  }

  const { client: c } = info;
  const contactLine = [c.role, c.email, c.phone].filter(Boolean).join(' · ') || 'Primary contact';

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4">
        <BackLink href="/clients">Clients</BackLink>
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[30px] font-semibold tracking-[-0.02em]">{c.name}</h1>
              <ClientStatusBadge active={isClientActive(info)} long />
            </div>
            <div className="flex items-center gap-3">
              <Avatar initials={initialsOf(c.contact)} size="lg" tone="brand" />
              <div>
                <div className="text-sm font-medium">{c.contact}</div>
                <div className="mt-0.5 text-[13px] text-muted">{contactLine}</div>
              </div>
            </div>
          </div>
          <AddButton onClick={() => openProjectModal({ mode: 'create', presetClient: c.name })}>New project</AddButton>
        </header>
      </div>

      <div className="flex flex-col gap-6">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'overview', label: 'Overview' },
            { value: 'projects', label: 'Projects', count: info.projects.length },
            { value: 'activity', label: 'Activity' },
          ]}
        />

        {tab === 'overview' && <ClientOverviewTab info={info} />}

        {tab === 'projects' &&
          (info.projects.length > 0 ? (
            <ClientProjectList projects={[...info.active, ...info.completed]} className="max-w-[760px]" />
          ) : (
            <EmptyState title="No projects yet" description="Projects you create for this client will show here." />
          ))}

        {tab === 'activity' && (
          <ActivityFeed
            items={getClientActivity(info).map((entry, i) => ({
              key: `${i}-${entry.text}`,
              text: entry.text,
              meta: `${entry.source} · ${formatLogTime(entry)}`,
            }))}
          />
        )}
      </div>
    </div>
  );
}
