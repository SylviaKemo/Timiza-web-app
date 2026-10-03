import type { PersonId, Priority, TaskStatus } from './types';

export const APP_NAME = 'Timiza';
export const STORAGE_KEY = 'timiza-app-v2';

/** Demo "today". Fixed so the seed data always reads correctly. */
export const TODAY = '2026-10-03';

export const PEOPLE: Record<PersonId, string> = {
  AM: 'Alex Morgan',
  MC: 'Maya Chen',
  DO: 'Daniel Okafor',
  PS: 'Priya Shah',
  JP: 'Jin Park',
  MR: 'Marcus Reid',
  SL: 'Sofia Lind',
};

export const PERSON_IDS = Object.keys(PEOPLE) as PersonId[];

export const CURRENT_USER = {
  id: 'AM' as PersonId,
  name: 'Alex Morgan',
  firstName: 'Alex',
  email: 'alex@timiza.app',
};

export const TASK_STATUSES: TaskStatus[] = ['todo', 'progress', 'done'];

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To do',
  progress: 'In progress',
  done: 'Done',
};

export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];

/** Open tasks per person before they count as over capacity. */
export const WORKLOAD_CAPACITY = 10;

export const MAX_RECENT_PROJECTS = 6;

export const firstName = (id: PersonId) => PEOPLE[id]?.split(' ')[0] ?? '';
