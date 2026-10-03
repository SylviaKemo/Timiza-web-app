'use client';

import { Card } from '@/components/ui/Card';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { cn } from '@/lib/cn';
import { formatDayLabel } from '@/lib/dates';
import { isClientActive, type ClientInfo } from '@/lib/derive';
import { useUiStore } from '@/store/useUiStore';
import { ClientStatusBadge } from './ClientStatusBadge';

const DESKTOP_COLUMNS = 'grid-cols-[minmax(170px,1.5fr)_minmax(190px,1.6fr)_80px_70px_110px_90px]';

/** Clients table on wide screens; "name + contact · N active | status" rows below 1200px. */
export function ClientTable({ clients }: { clients: ClientInfo[] }) {
  const { isCompact } = useBreakpoints();
  const { openClient } = useAppNavigation();
  const highlightedId = useUiStore((s) => s.highlightedClientId);

  return (
    <Card className="overflow-x-auto">
      <div className={cn(!isCompact && 'min-w-[780px]')}>
        {!isCompact && (
          <div className={cn('grid gap-4 px-5 py-3 text-xs font-medium text-faint', DESKTOP_COLUMNS)}>
            <div>Client</div>
            <div>Contact</div>
            <div className="text-right">Projects</div>
            <div className="text-right">Active</div>
            <div>Last activity</div>
            <div>Status</div>
          </div>
        )}

        {clients.map((info) => {
          const { client } = info;
          const open = () => openClient(client.id);
          return (
            <div
              key={client.id}
              role="link"
              tabIndex={0}
              onClick={open}
              onKeyDown={(e) => e.key === 'Enter' && open()}
              className={cn(
                'grid cursor-pointer items-center gap-4 border-t border-divider hover:bg-row-hover',
                isCompact ? 'grid-cols-[minmax(0,1fr)_auto] px-4 py-3.5' : cn(DESKTOP_COLUMNS, 'px-5 py-4'),
                highlightedId === client.id && 'bg-highlight',
              )}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium">{client.name}</div>
                <div className="mt-0.5 text-xs text-faint">
                  {isCompact ? `${client.contact} · ${info.active.length} active` : client.website}
                </div>
              </div>

              {!isCompact && (
                <>
                  <div className="min-w-0">
                    <div className="text-sm">{client.contact}</div>
                    <div className="mt-0.5 truncate text-xs text-faint">{client.email}</div>
                  </div>
                  <div className="text-right text-sm">{info.projects.length}</div>
                  <div className="text-right text-sm">{info.active.length}</div>
                  <div className="text-[13px] text-muted">
                    {info.lastActivity ? formatDayLabel(info.lastActivity) : '—'}
                  </div>
                </>
              )}

              <div>
                <ClientStatusBadge active={isClientActive(info)} />
              </div>
            </div>
          );
        })}

        {clients.length === 0 && (
          <div className="border-t border-divider px-5 py-12 text-center text-sm font-medium">
            No clients match your search
          </div>
        )}
      </div>
    </Card>
  );
}
