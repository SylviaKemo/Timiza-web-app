'use client';

import { useMemo } from 'react';
import { AddButton } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/Field';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { filterAndSortClients, getClientInfo, type ClientSort, type ClientStatusFilter } from '@/lib/derive';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import { ClientTable } from './ClientTable';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Sort: Name' },
  { value: 'activity', label: 'Sort: Last activity' },
  { value: 'projects', label: 'Sort: Most projects' },
];

/** "Who are we working with?" */
export function ClientsView() {
  const clients = useAppStore((s) => s.data.clients);
  const projects = useAppStore((s) => s.data.projects);
  const filters = useUiStore((s) => s.clientFilters);
  const { setClientFilters, openClientModal } = useUiStore.getState();

  const rows = useMemo(
    () => filterAndSortClients(clients.map((c) => getClientInfo(c, projects)), filters),
    [clients, projects, filters],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clients"
        subtitle="Manage your clients and their active projects."
        actions={<AddButton onClick={openClientModal}>Add client</AddButton>}
      />

      <div className="flex flex-wrap items-center gap-2.5">
        <SearchInput
          placeholder="Search clients"
          aria-label="Search clients"
          value={filters.query}
          onChange={(query) => setClientFilters({ query })}
        />
        <Select
          aria-label="Filter by status"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(status) => setClientFilters({ status: status as ClientStatusFilter })}
        />
        <Select
          aria-label="Sort clients"
          options={SORT_OPTIONS}
          value={filters.sort}
          onChange={(sort) => setClientFilters({ sort: sort as ClientSort })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <ClientTable clients={rows} />
        <div className="text-[13px] text-faint">
          Showing {rows.length} of {clients.length} clients
        </div>
      </div>
    </div>
  );
}
