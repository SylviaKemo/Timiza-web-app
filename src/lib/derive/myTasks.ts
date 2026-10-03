import { CURRENT_USER, TODAY } from '../constants';
import { daysFromToday, formatShort } from '../dates';
import type { Priority, Project, TaskWithProject } from '../types';
import { compareDue, getActiveProjects, getVisibleProjects } from './projects';

export type MyTasksTab = 'today' | 'upcoming' | 'all' | 'completed';

export interface MyTasksFilters {
  query: string;
  /** 'all' or a project id. */
  projectId: string;
  priority: Priority | 'all';
}

export const DEFAULT_MY_TASKS_FILTERS: MyTasksFilters = { query: '', projectId: 'all', priority: 'all' };

export interface TaskGroup {
  key: string;
  label: string;
  isOverdue: boolean;
  tasks: TaskWithProject[];
}

const TAB_FILTERS: Record<MyTasksTab, (t: TaskWithProject) => boolean> = {
  today: (t) => t.status !== 'done' && !!t.due && t.due <= TODAY,
  upcoming: (t) => t.status !== 'done' && (!t.due || t.due > TODAY),
  all: (t) => t.status !== 'done',
  completed: (t) => t.status === 'done',
};

export const MY_TASKS_TABS: Array<{ key: MyTasksTab; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
];

/** Every task assigned to the current user in non-archived projects. */
export function getMyTasks(projects: Project[]): TaskWithProject[] {
  return getVisibleProjects(projects).flatMap((project) =>
    project.tasks.filter((t) => t.who === CURRENT_USER.id).map((t) => ({ ...t, project })),
  );
}

/** Open tasks of the current user in active projects (sidebar count). */
export function countMyOpenTasks(projects: Project[]): number {
  return getActiveProjects(projects).reduce(
    (n, p) => n + p.tasks.filter((t) => t.who === CURRENT_USER.id && t.status !== 'done').length,
    0,
  );
}

export function filterMyTasks(tasks: TaskWithProject[], filters: MyTasksFilters): TaskWithProject[] {
  const query = filters.query.trim().toLowerCase();
  const matchesQuery = (t: TaskWithProject) =>
    !query ||
    t.title.toLowerCase().includes(query) ||
    t.project.name.toLowerCase().includes(query) ||
    t.project.client.toLowerCase().includes(query);

  return tasks.filter(
    (t) =>
      matchesQuery(t) &&
      (filters.projectId === 'all' || t.project.id === filters.projectId) &&
      (filters.priority === 'all' || t.pri === filters.priority),
  );
}

export const hasActiveTaskFilters = (f: MyTasksFilters) =>
  !!f.query.trim() || f.projectId !== 'all' || f.priority !== 'all';

export const countByTab = (tasks: TaskWithProject[], tab: MyTasksTab) => tasks.filter(TAB_FILTERS[tab]).length;

/** Sortable group key: the prefix orders groups, the part after `|` is the label. */
function groupKey(t: TaskWithProject): string {
  if (t.status === 'done') return t.doneOn === TODAY ? '0|Completed today' : '1|Earlier';
  if (!t.due) return '9|No date';
  if (t.due < TODAY) return '0|Overdue';
  if (t.due === TODAY) return '1|Today';
  const days = daysFromToday(t.due);
  if (days === 1) return '2|Tomorrow';
  if (days <= 7) return `3${t.due}|${formatShort(t.due)}`;
  return '8|Later';
}

export function groupMyTasks(tasks: TaskWithProject[], tab: MyTasksTab): TaskGroup[] {
  const items = tasks
    .filter(TAB_FILTERS[tab])
    .sort((a, b) => (tab === 'completed' ? (b.due || '').localeCompare(a.due || '') : compareDue(a.due, b.due)));

  const groups = new Map<string, TaskWithProject[]>();
  for (const t of items) {
    const key = groupKey(t);
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }

  return [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, groupTasks]) => ({
      key,
      label: key.split('|')[1],
      isOverdue: key === '0|Overdue',
      tasks: groupTasks,
    }));
}

/** Tasks due today and how many of them are done. */
export function getTodayProgress(tasks: TaskWithProject[]) {
  const dueToday = tasks.filter((t) => t.due === TODAY);
  const done = dueToday.filter((t) => t.status === 'done').length;
  return { done, total: dueToday.length, pct: dueToday.length ? Math.round((done / dueToday.length) * 100) : 0 };
}
