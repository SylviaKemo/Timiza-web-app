import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CURRENT_USER, MAX_RECENT_PROJECTS, STORAGE_KEY, TASK_STATUS_LABEL, TODAY } from '@/lib/constants';
import { createId } from '@/lib/ids';
import { createSeedData } from '@/lib/seed';
import type {
  AppData, Client, LogEntry, PersonId, Priority, Project, ProjectHealth, Subtask, Task, TaskStatus,
} from '@/lib/types';

/**
 * The persisted app data and every mutation on it.
 * All derived numbers (progress, counts, statuses) are computed in `lib/derive` — never stored here.
 */

const ME = CURRENT_USER.firstName;

export interface ProjectInput {
  name: string;
  client: string;
  start: string;
  due: string;
  team: PersonId[];
  desc: string;
}

export interface TaskInput {
  title: string;
  status?: TaskStatus;
  who?: PersonId;
  due?: string;
  pri?: Priority;
}

export interface ClientInput {
  name: string;
  contact: string;
  email: string;
  phone: string;
  website: string;
}

interface AppState {
  data: AppData;

  createProject: (input: ProjectInput) => Project;
  updateProjectDetails: (projectId: string, input: ProjectInput) => void;
  setProjectCompleted: (projectId: string, completed: boolean) => void;
  setProjectArchived: (projectId: string, archived: boolean) => void;
  setProjectHealth: (projectId: string, health: ProjectHealth) => void;
  markProjectOpened: (projectId: string) => void;

  addTask: (projectId: string, input: TaskInput) => Task;
  updateTask: (projectId: string, taskId: string, patch: Partial<Task>, log?: string) => void;
  moveTask: (projectId: string, taskId: string, status: TaskStatus) => void;
  deleteTask: (projectId: string, taskId: string) => Task | undefined;
  restoreTask: (projectId: string, task: Task) => void;

  addSubtask: (projectId: string, taskId: string, title: string) => void;
  toggleSubtask: (projectId: string, taskId: string, subtaskId: string) => void;
  removeSubtask: (projectId: string, taskId: string, subtaskId: string) => void;

  createClient: (input: ClientInput) => Client;

  resetData: () => void;
}

const logEntry = (text: string): LogEntry => ({ text, ts: Date.now() });

/** Applies `fn` to one project, bumps `updated` and optionally prepends an activity entry. */
function withProject(data: AppData, projectId: string, fn: (p: Project) => Project, log?: string): AppData {
  return {
    ...data,
    projects: data.projects.map((p) => {
      if (p.id !== projectId) return p;
      const next = { ...fn(p), updated: Date.now() };
      if (log) next.activity = [logEntry(log), ...next.activity];
      return next;
    }),
  };
}

function withTask(data: AppData, projectId: string, taskId: string, fn: (t: Task) => Task, log?: string) {
  return withProject(data, projectId, (p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === taskId ? fn(t) : t)) }), log);
}

const findTask = (data: AppData, projectId: string, taskId: string) =>
  data.projects.find((p) => p.id === projectId)?.tasks.find((t) => t.id === taskId);

function isValidData(value: unknown): value is AppData {
  const data = value as AppData | undefined;
  return !!data && data.v === 2 && Array.isArray(data.projects) && Array.isArray(data.clients);
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const update = (fn: (data: AppData) => AppData) => set((s) => ({ data: fn(s.data) }));

      return {
        data: createSeedData(),

        /* ---------- Projects ---------- */

        createProject: (input) => {
          const team = input.team.length ? input.team : [CURRENT_USER.id];
          const project: Project = {
            id: createId('p'),
            name: input.name.trim(),
            client: input.client,
            lead: team[0],
            team,
            start: input.start,
            due: input.due,
            health: 'on',
            completed: false,
            archived: false,
            desc: input.desc,
            updated: Date.now(),
            tasks: [],
            activity: [logEntry(`${ME} created the project`)],
          };
          update((d) => ({ ...d, projects: [project, ...d.projects] }));
          return project;
        },

        updateProjectDetails: (projectId, input) => {
          const team = input.team.length ? input.team : [CURRENT_USER.id];
          update((d) =>
            withProject(
              d,
              projectId,
              (p) => ({ ...p, name: input.name.trim(), client: input.client, start: input.start, due: input.due, team, lead: team[0], desc: input.desc }),
              `${ME} updated project details`,
            ),
          );
        },

        setProjectCompleted: (projectId, completed) =>
          update((d) =>
            withProject(
              d,
              projectId,
              (p) => ({ ...p, completed }),
              completed ? `${ME} marked the project complete` : `${ME} reopened the project`,
            ),
          ),

        setProjectArchived: (projectId, archived) =>
          update((d) => withProject(d, projectId, (p) => ({ ...p, archived }))),

        setProjectHealth: (projectId, health) =>
          update((d) =>
            withProject(
              d,
              projectId,
              (p) => ({ ...p, health }),
              `${ME} marked the project ${health === 'on' ? 'on track' : 'at risk'}`,
            ),
          ),

        markProjectOpened: (projectId) =>
          update((d) => ({
            ...d,
            recent: [projectId, ...d.recent.filter((id) => id !== projectId)].slice(0, MAX_RECENT_PROJECTS),
          })),

        /* ---------- Tasks ---------- */

        addTask: (projectId, input) => {
          const task: Task = {
            id: createId('t'),
            title: input.title.trim(),
            status: input.status ?? 'todo',
            who: input.who ?? CURRENT_USER.id,
            due: input.due ?? '',
            pri: input.pri ?? 'Medium',
            desc: '',
            subtasks: [],
            log: [logEntry(`${ME} created the task`)],
          };
          update((d) =>
            withProject(d, projectId, (p) => ({ ...p, tasks: [...p.tasks, task] }), `${ME} added "${task.title}"`),
          );
          return task;
        },

        updateTask: (projectId, taskId, patch, log) =>
          update((d) => withTask(d, projectId, taskId, (t) => ({ ...t, ...patch }), log)),

        moveTask: (projectId, taskId, status) => {
          const task = findTask(get().data, projectId, taskId);
          if (!task || task.status === status) return;
          const label = TASK_STATUS_LABEL[status];
          update((d) =>
            withTask(
              d,
              projectId,
              taskId,
              (t) => ({
                ...t,
                status,
                doneOn: status === 'done' ? TODAY : null,
                log: [logEntry(`${ME} changed status to ${label}`), ...(t.log ?? [])],
              }),
              `${ME} moved "${task.title}" to ${label}`,
            ),
          );
        },

        deleteTask: (projectId, taskId) => {
          const task = findTask(get().data, projectId, taskId);
          if (!task) return undefined;
          update((d) =>
            withProject(
              d,
              projectId,
              (p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }),
              `${ME} deleted "${task.title}"`,
            ),
          );
          return task;
        },

        restoreTask: (projectId, task) =>
          update((d) => withProject(d, projectId, (p) => ({ ...p, tasks: [...p.tasks, task] }))),

        /* ---------- Subtasks ---------- */

        addSubtask: (projectId, taskId, title) => {
          const subtask: Subtask = { id: createId('s'), title: title.trim(), done: false };
          update((d) => withTask(d, projectId, taskId, (t) => ({ ...t, subtasks: [...(t.subtasks ?? []), subtask] })));
        },

        toggleSubtask: (projectId, taskId, subtaskId) =>
          update((d) =>
            withTask(d, projectId, taskId, (t) => {
              const subtasks = t.subtasks ?? [];
              const target = subtasks.find((s) => s.id === subtaskId);
              const completing = target && !target.done;
              return {
                ...t,
                subtasks: subtasks.map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s)),
                log: completing ? [logEntry(`${ME} completed "${target.title}"`), ...(t.log ?? [])] : t.log,
              };
            }),
          ),

        removeSubtask: (projectId, taskId, subtaskId) =>
          update((d) =>
            withTask(d, projectId, taskId, (t) => ({
              ...t,
              subtasks: (t.subtasks ?? []).filter((s) => s.id !== subtaskId),
            })),
          ),

        /* ---------- Clients ---------- */

        createClient: (input) => {
          const contact = input.contact.trim();
          const client: Client = {
            id: createId('c'),
            name: input.name.trim(),
            contact,
            role: '',
            email: input.email.trim(),
            phone: input.phone.trim(),
            website: input.website.trim(),
            since: TODAY.slice(0, 7),
            created: Date.now(),
            activity: [logEntry(`${contact} was added as primary contact`)],
          };
          update((d) => ({ ...d, clients: [...d.clients, client] }));
          return client;
        },

        resetData: () => set({ data: createSeedData() }),
      };
    },
    {
      name: STORAGE_KEY,
      version: 2,
      // Hydrate on the client only (see useStoreHydration) to avoid SSR mismatches.
      skipHydration: true,
      partialize: (state) => ({ data: state.data }),
      merge: (persisted, current) => {
        const data = (persisted as { data?: unknown } | undefined)?.data;
        return isValidData(data) ? { ...current, data } : current;
      },
    },
  ),
);
