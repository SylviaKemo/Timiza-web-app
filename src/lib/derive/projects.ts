import { TODAY } from '../constants';
import type { Project, ProjectStatus, Task } from '../types';

export interface ProjectStats {
  total: number;
  done: number;
  inProgress: number;
  overdue: Task[];
  pct: number;
  status: ProjectStatus;
}

export const isTaskOverdue = (t: Task) => t.status !== 'done' && !!t.due && t.due < TODAY;

export function getProjectStats(p: Project): ProjectStats {
  const total = p.tasks.length;
  const done = p.tasks.filter((t) => t.status === 'done').length;
  const inProgress = p.tasks.filter((t) => t.status === 'progress').length;
  const overdue = p.tasks.filter(isTaskOverdue);
  const pct = p.completed ? 100 : total ? Math.round((done / total) * 100) : 0;

  let status: ProjectStatus = 'on';
  if (p.completed) status = 'done';
  else if (p.due && p.due < TODAY) status = 'late';
  else if (p.health === 'risk') status = 'risk';

  return { total, done, inProgress, overdue, pct, status };
}

export const isAtRiskStatus = (status: ProjectStatus) => status === 'risk' || status === 'late';

export const getVisibleProjects = (projects: Project[]) => projects.filter((p) => !p.archived);
export const getActiveProjects = (projects: Project[]) => getVisibleProjects(projects).filter((p) => !p.completed);

/** "Acme · Website Redesign" — first word of the client plus the project name. */
export const projectLabel = (p: Project) => `${p.client.split(' ')[0]} · ${p.name}`;

/** Compares ISO dates, pushing empty dates to the end. */
export const compareDue = (a: string, b: string) => (a || '9').localeCompare(b || '9');

/* ---------- Projects list: filtering & sorting ---------- */

export type ProjectStatusFilter = 'all' | 'active' | 'risk' | 'done';
export type ProjectSort = 'due' | 'updated' | 'progress' | 'name';

export interface ProjectFilters {
  query: string;
  status: ProjectStatusFilter;
  /** 'all' or a client name. */
  client: string;
  sort: ProjectSort;
}

export const DEFAULT_PROJECT_FILTERS: ProjectFilters = { query: '', status: 'all', client: 'all', sort: 'due' };

function matchesStatus(p: Project, stats: ProjectStats, filter: ProjectStatusFilter) {
  switch (filter) {
    case 'active':
      return !p.completed;
    case 'risk':
      return isAtRiskStatus(stats.status);
    case 'done':
      return p.completed;
    default:
      return true;
  }
}

export function countProjectsByStatus(projects: Project[]): Record<ProjectStatusFilter, number> {
  return {
    all: projects.length,
    active: projects.filter((p) => !p.completed).length,
    risk: projects.filter((p) => isAtRiskStatus(getProjectStats(p).status)).length,
    done: projects.filter((p) => p.completed).length,
  };
}

export function filterAndSortProjects(projects: Project[], filters: ProjectFilters): Project[] {
  const query = filters.query.trim().toLowerCase();
  const stats = new Map(projects.map((p) => [p.id, getProjectStats(p)]));
  const statsOf = (p: Project) => stats.get(p.id)!;

  const filtered = projects.filter((p) => {
    if (query && !p.name.toLowerCase().includes(query) && !p.client.toLowerCase().includes(query)) return false;
    if (filters.client !== 'all' && p.client !== filters.client) return false;
    return matchesStatus(p, statsOf(p), filters.status);
  });

  const sorters: Record<ProjectSort, (a: Project, b: Project) => number> = {
    // Completed projects sink to the bottom.
    due: (a, b) => Number(a.completed) - Number(b.completed) || compareDue(a.due, b.due),
    updated: (a, b) => b.updated - a.updated,
    progress: (a, b) => statsOf(b).pct - statsOf(a).pct,
    name: (a, b) => a.name.localeCompare(b.name),
  };

  return [...filtered].sort(sorters[filters.sort]);
}
