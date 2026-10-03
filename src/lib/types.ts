/** Domain model — the single source of truth for every screen. */

export type PersonId = 'AM' | 'MC' | 'DO' | 'PS' | 'JP' | 'MR' | 'SL';

export type TaskStatus = 'todo' | 'progress' | 'done';
export type Priority = 'High' | 'Medium' | 'Low';
export type ProjectHealth = 'on' | 'risk';

/** Derived project status shown in badges. */
export type ProjectStatus = 'on' | 'risk' | 'late' | 'done';

/** `ts` is set for live events; `at` is a pre-formatted label used by seed data. */
export interface LogEntry {
  text: string;
  ts?: number;
  at?: string;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  who: PersonId;
  /** ISO date (yyyy-mm-dd) or '' when there is no due date. */
  due: string;
  pri: Priority;
  desc: string;
  doneOn?: string | null;
  subtasks?: Subtask[];
  log?: LogEntry[];
}

export interface Project {
  id: string;
  name: string;
  /** References `Client.name`. */
  client: string;
  lead: PersonId;
  team: PersonId[];
  start: string;
  due: string;
  health: ProjectHealth;
  completed: boolean;
  archived: boolean;
  desc: string;
  /** Epoch ms, bumped on every change. */
  updated: number;
  tasks: Task[];
  activity: LogEntry[];
}

export interface Client {
  id: string;
  /** Unique (case-insensitive). */
  name: string;
  contact: string;
  role: string;
  email: string;
  phone: string;
  website: string;
  /** yyyy-mm */
  since: string;
  created?: number;
  activity: LogEntry[];
}

export interface AppData {
  v: 2;
  projects: Project[];
  clients: Client[];
  /** Project ids, most recently opened first (max 6). */
  recent: string[];
}

/** A task together with the project it belongs to. */
export interface TaskWithProject extends Task {
  project: Project;
}
