'use client';

import { Columns3, List } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';
import { SearchInput } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import type { ProjectFilters, ProjectSort } from '@/lib/derive';
import type { Client } from '@/lib/types';

const SORT_OPTIONS: Array<{ value: ProjectSort; label: string }> = [
  { value: 'due', label: 'Sort: Due date' },
  { value: 'updated', label: 'Sort: Recently updated' },
  { value: 'progress', label: 'Sort: Progress' },
  { value: 'name', label: 'Sort: Name' },
];

interface ProjectsToolbarProps {
  filters: ProjectFilters;
  clients: Client[];
  onChange: (patch: Partial<ProjectFilters>) => void;
}

/** Search, client filter, sort and the List/Board view switch. Status filtering lives in the tabs. */
export function ProjectsToolbar({ filters, clients, onChange }: ProjectsToolbarProps) {
  const clientOptions = [
    { value: 'all', label: 'All clients', sub: `${clients.length} clients` },
    ...clients.map((c) => ({ value: c.name, label: c.name, sub: c.contact })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <SearchInput
        placeholder="Search projects"
        aria-label="Search projects"
        value={filters.query}
        onChange={(query) => onChange({ query })}
      />
      <Dropdown
        aria-label="Filter by client"
        options={clientOptions}
        value={filters.client}
        onChange={(client) => onChange({ client })}
      />
      <Select
        aria-label="Sort projects"
        options={SORT_OPTIONS}
        value={filters.sort}
        onChange={(sort) => onChange({ sort: sort as ProjectSort })}
      />
      <div className="flex-1" />
      <ViewToggle />
    </div>
  );
}

/** Only the list view exists for now; the board view is shown disabled. */
function ViewToggle() {
  return (
    <div className="flex rounded-control border border-line bg-surface p-[3px]">
      <button
        type="button"
        aria-pressed="true"
        className="flex h-[30px] cursor-default items-center gap-1.5 rounded-[7px] bg-ink px-3 text-[13px] font-medium text-white"
      >
        <List size={16} />
        List
      </button>
      <button
        type="button"
        disabled
        title="Board view is coming later"
        className="flex h-[30px] cursor-not-allowed items-center gap-1.5 rounded-[7px] px-3 text-[13px] font-medium text-faint"
      >
        <Columns3 size={16} />
        Board
      </button>
    </div>
  );
}
