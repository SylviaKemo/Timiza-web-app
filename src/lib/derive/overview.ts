import { PEOPLE, PERSON_IDS, TODAY, WORKLOAD_CAPACITY } from '../constants';
import { addDays } from '../dates';
import type { PersonId, Project, TaskWithProject } from '../types';
import { compareDue, getActiveProjects, getProjectStats, type ProjectStats } from './projects';

export interface AttentionItem {
  project: Project;
  stats: ProjectStats;
  /** 'late' if any task is overdue or the project date has passed; otherwise 'risk'. */
  severity: 'late' | 'risk';
}

export interface WorkloadItem {
  id: PersonId;
  name: string;
  open: number;
  overCapacity: boolean;
}

export interface Overview {
  activeCount: number;
  finishingThisMonth: number;
  dueThisWeek: TaskWithProject[];
  dueThisWeekProjectCount: number;
  doneTasks: number;
  totalTasks: number;
  attention: AttentionItem[];
  lateCount: number;
  topProjects: Array<{ project: Project; stats: ProjectStats }>;
  upcoming: TaskWithProject[];
  workload: WorkloadItem[];
}

const openTasksOf = (projects: Project[]): TaskWithProject[] =>
  projects.flatMap((project) => project.tasks.filter((t) => t.status !== 'done').map((t) => ({ ...t, project })));

export function getOverview(allProjects: Project[]): Overview {
  const active = getActiveProjects(allProjects);
  const withStats = active.map((project) => ({ project, stats: getProjectStats(project) }));
  const openTasks = openTasksOf(active);

  const weekEnd = addDays(TODAY, 7);
  const dueThisWeek = openTasks
    .filter((t) => t.due && t.due >= TODAY && t.due <= weekEnd)
    .sort((a, b) => a.due.localeCompare(b.due));

  const attention: AttentionItem[] = withStats
    .filter(({ project, stats }) => stats.status === 'late' || stats.overdue.length > 0 || project.health === 'risk')
    .map(({ project, stats }) => ({
      project,
      stats,
      severity: stats.overdue.length > 0 || stats.status === 'late' ? 'late' : 'risk',
    }));

  const load = new Map<PersonId, number>(PERSON_IDS.map((id) => [id, 0]));
  openTasks.forEach((t) => load.set(t.who, (load.get(t.who) ?? 0) + 1));

  return {
    activeCount: active.length,
    finishingThisMonth: active.filter((p) => p.due.slice(0, 7) === TODAY.slice(0, 7)).length,
    dueThisWeek,
    dueThisWeekProjectCount: new Set(dueThisWeek.map((t) => t.project.id)).size,
    doneTasks: withStats.reduce((n, { stats }) => n + stats.done, 0),
    totalTasks: withStats.reduce((n, { stats }) => n + stats.total, 0),
    attention,
    lateCount: attention.filter((a) => a.severity === 'late').length,
    topProjects: [...withStats].sort((a, b) => compareDue(a.project.due, b.project.due)).slice(0, 5),
    upcoming: dueThisWeek.slice(0, 5),
    workload: [...load.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, open]) => ({ id, name: PEOPLE[id], open, overCapacity: open > WORKLOAD_CAPACITY })),
  };
}
