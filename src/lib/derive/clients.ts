import { TODAY } from '../constants';
import type { Client, LogEntry, Project, Task } from '../types';
import { compareDue, getVisibleProjects } from './projects';

export interface ClientInfo {
  client: Client;
  projects: Project[];
  /** Not completed, sorted by due date. */
  active: Project[];
  completed: Project[];
  /** Epoch ms of the most recent change (0 when unknown). */
  lastActivity: number;
}

export function getClientInfo(client: Client, allProjects: Project[]): ClientInfo {
  const projects = getVisibleProjects(allProjects).filter((p) => p.client === client.name);
  const active = projects.filter((p) => !p.completed).sort((a, b) => compareDue(a.due, b.due));
  const lastActivity = Math.max(
    client.created ?? 0,
    ...projects.map((p) => p.updated ?? 0),
    ...client.activity.map((a) => a.ts ?? 0),
  );
  return { client, projects, active, completed: projects.filter((p) => p.completed), lastActivity };
}

export const isClientActive = (info: ClientInfo) => info.active.length > 0;

/* ---------- Clients list: filtering & sorting ---------- */

export type ClientStatusFilter = 'all' | 'active' | 'inactive';
export type ClientSort = 'name' | 'activity' | 'projects';

export interface ClientFilters {
  query: string;
  status: ClientStatusFilter;
  sort: ClientSort;
}

export const DEFAULT_CLIENT_FILTERS: ClientFilters = { query: '', status: 'all', sort: 'name' };

export function filterAndSortClients(infos: ClientInfo[], filters: ClientFilters): ClientInfo[] {
  const query = filters.query.trim().toLowerCase();
  const sorters: Record<ClientSort, (a: ClientInfo, b: ClientInfo) => number> = {
    name: (a, b) => a.client.name.localeCompare(b.client.name),
    activity: (a, b) => b.lastActivity - a.lastActivity,
    projects: (a, b) => b.projects.length - a.projects.length,
  };

  return infos
    .filter((info) => {
      const { client } = info;
      const haystack = [client.name, client.contact, client.email].join(' ').toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (filters.status === 'active') return isClientActive(info);
      if (filters.status === 'inactive') return !isClientActive(info);
      return true;
    })
    .sort(sorters[filters.sort]);
}

/* ---------- Client details ---------- */

export type ClientDeadline =
  | { kind: 'task'; date: string; title: string; project: Project; task: Task }
  | { kind: 'delivery'; date: string; title: string; project: Project };

/** Open tasks due from today onward plus each active project's final delivery (top 6). */
export function getClientDeadlines(info: ClientInfo): ClientDeadline[] {
  const tasks: ClientDeadline[] = info.active.flatMap((project) =>
    project.tasks
      .filter((t) => t.status !== 'done' && t.due && t.due >= TODAY)
      .map((task) => ({ kind: 'task' as const, date: task.due, title: task.title, project, task })),
  );
  const deliveries: ClientDeadline[] = info.active
    .filter((p) => p.due && p.due >= TODAY)
    .map((project) => ({ kind: 'delivery' as const, date: project.due, title: 'Final delivery', project }));

  return [...tasks, ...deliveries].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
}

export interface ClientActivityEntry extends LogEntry {
  source: string;
}

/** Project and client logs merged: live entries newest first, then seed entries. */
export function getClientActivity(info: ClientInfo, limit = 40): ClientActivityEntry[] {
  const entries: ClientActivityEntry[] = [
    ...info.projects.flatMap((p) => p.activity.map((a) => ({ ...a, source: p.name }))),
    ...info.client.activity.map((a) => ({ ...a, source: info.client.name })),
  ];
  const live = entries.filter((a) => a.ts).sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
  const seeded = entries.filter((a) => !a.ts);
  return [...live, ...seeded].slice(0, limit);
}

export const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
