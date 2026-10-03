'use client';

import { Dropdown } from '@/components/ui/Dropdown';
import { SearchInput } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import type { MyTasksFilters } from '@/lib/derive';
import type { Priority, Project } from '@/lib/types';

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All priorities' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

interface MyTasksToolbarProps {
  filters: MyTasksFilters;
  /** Projects the current user has tasks in. */
  projects: Project[];
  onChange: (patch: Partial<MyTasksFilters>) => void;
}

export function MyTasksToolbar({ filters, projects, onChange }: MyTasksToolbarProps) {
  const projectOptions = [
    { value: 'all', label: 'All projects', sub: 'Every project you have tasks in' },
    ...projects.map((p) => ({ value: p.id, label: p.name, sub: p.client })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <SearchInput
        placeholder="Search tasks"
        aria-label="Search tasks"
        value={filters.query}
        onChange={(query) => onChange({ query })}
      />
      <Dropdown
        aria-label="Filter by project"
        options={projectOptions}
        value={filters.projectId}
        onChange={(projectId) => onChange({ projectId })}
        menuClassName="min-w-[260px]"
      />
      <Select
        aria-label="Filter by priority"
        options={PRIORITY_OPTIONS}
        value={filters.priority}
        onChange={(priority) => onChange({ priority: priority as Priority | 'all' })}
      />
    </div>
  );
}
