import { TODAY } from './constants';
import { addDays, diffDays, formatMonthYear, formatShort } from './dates';
import type { AppData, Client, LogEntry, PersonId, Priority, Project, Task, TaskStatus } from './types';

/**
 * Demo data: 12 projects, 6 clients and ~150 tasks, all relative to the fixed TODAY.
 * `createSeedData()` returns a fresh copy every time (used by "Reset demo data").
 */

const TASK_POOL = [
  'Kickoff call', 'Requirements doc', 'Moodboard', 'Wireframes', 'Visual design', 'Copywriting', 'Prototype',
  'Client review', 'Development', 'QA pass', 'Content entry', 'Launch checklist', 'Handoff', 'Retrospective',
];

export const SEED_RECENT = ['p1', 'p2', 'p5'];

export function createSeedClients(): Client[] {
  const client = (
    name: string, contact: string, role: string, email: string, phone: string, website: string, since: string,
  ): Client => ({
    id: 'c_' + name.toLowerCase().replace(/[^a-z]/g, ''),
    name, contact, role, email, phone, website, since,
    activity: [{ text: `${contact} was added as primary contact`, at: formatMonthYear(since) }],
  });

  return [
    client('Acme Inc.', 'Sarah Mitchell', 'Product Manager', 'sarah@acme.com', '+1 415 555 0142', 'acme.com', '2026-03'),
    client('Northstar', 'James Wilson', 'Head of Product', 'james@northstar.io', '+1 312 555 0187', 'northstar.io', '2025-11'),
    client('Lumon', 'Emma Davis', 'Brand Director', 'emma@lumon.co', '+44 20 7946 0321', 'lumon.co', '2026-01'),
    client('Vertex Health', 'Olivia Martin', 'Digital Lead', 'olivia@vertexhealth.com', '+1 617 555 0193', 'vertexhealth.com', '2026-06'),
    client('Kanso', 'Michael Chen', 'Founder', 'michael@kanso.studio', '+81 3 5555 0110', 'kanso.studio', '2026-05'),
    client('Halden & Co.', 'Ruth Halden', 'Managing Partner', 'ruth@halden.co', '+1 212 555 0175', 'halden.co', '2025-09'),
  ];
}

export function createSeedData(): AppData {
  let taskCount = 0;
  const nextTaskId = () => 't' + ++taskCount;

  const task = (
    title: string, status: TaskStatus, who: PersonId, due: string, pri: Priority = 'Medium', desc = '',
  ): Task => ({ id: nextTaskId(), title, status, who, due, pri, desc });

  /** Generates a plausible task list: `done` finished tasks, then `prog` + `todo` open ones spread up to `due`. */
  const generateTasks = (team: PersonId[], due: string, done: number, prog: number, todo: number, atRisk = false) => {
    const tasks: Task[] = [];
    const open = prog + todo;
    const span = Math.max(2, diffDays(TODAY, due));
    let i = 0;

    for (let k = 0; k < done; k++, i++) {
      tasks.push(task(TASK_POOL[i], 'done', team[i % team.length], addDays(TODAY, -(done - k) * 3)));
    }
    for (let k = 0; k < open; k++, i++) {
      let taskDue = addDays(TODAY, Math.max(1, Math.round((span * (k + 1)) / open)));
      if (atRisk && k < 2) taskDue = addDays(TODAY, -(2 - k) - 1);
      const pri: Priority = k === 0 ? 'High' : k % 3 === 2 ? 'Low' : 'Medium';
      tasks.push(task(TASK_POOL[i], k < prog ? 'progress' : 'todo', team[i % team.length], taskDue, pri));
    }
    return tasks;
  };

  const project = (
    id: string, name: string, client: string, team: PersonId[], due: string, health: Project['health'],
    tasks: Task[], completed = false, desc = '', activity: LogEntry[] | null = null, start: string | null = null,
  ): Project => {
    const startDate = start ?? addDays(due, -42);
    return {
      id, name, client, lead: team[0], team, start: startDate, due, health, tasks, completed, archived: false, desc,
      updated: Date.now() - Number(id.slice(1)) * 5 * 3_600_000,
      activity: activity ?? [{ text: 'Project created', at: formatShort(startDate) }],
    };
  };

  const websiteRedesignTasks = [
    task('Project setup', 'done', 'DO', '2026-09-21'),
    task('Kickoff workshop', 'done', 'MC', '2026-09-22'),
    task('Sitemap & IA', 'done', 'DO', '2026-09-23'),
    task('Content audit', 'done', 'AM', '2026-09-24'),
    task('Moodboard', 'done', 'SL', '2026-09-25', 'Low'),
    task('Wireframes', 'done', 'MC', '2026-09-27', 'High'),
    task('Design system', 'done', 'SL', '2026-09-29', 'High'),
    task('Analytics setup', 'done', 'JP', '2026-09-30', 'Low'),
    task('Style tile approval', 'done', 'AM', '2026-10-01'),
    task('Case study templates', 'progress', 'MC', '2026-10-08', 'High', 'Reusable layouts for long-form and short-form case studies.'),
    task('API integration', 'progress', 'DO', '2026-10-10', 'High', 'Connect the CMS to the case-study and team endpoints.'),
    task('Client review', 'progress', 'AM', '2026-10-05', 'Medium', 'Walk Acme through the homepage and collect consolidated feedback.'),
    task('Homepage copy', 'todo', 'AM', '2026-10-05', 'High'),
    task('Mobile designs', 'todo', 'SL', '2026-10-09'),
    task('SEO metadata', 'todo', 'JP', '2026-10-11', 'Low'),
  ];

  const projects: Project[] = [
    project('p1', 'Website Redesign', 'Acme Inc.', ['MC', 'DO', 'SL', 'AM', 'JP'], '2026-10-12', 'on', websiteRedesignTasks, false,
      "Redesign Acme's marketing website with a clearer service structure, new case studies and a CMS the marketing team can update without developers.",
      [
        { text: 'Alex moved "Style tile approval" to Done', at: 'Oct 1' },
        { text: 'Jin moved "Analytics setup" to Done', at: 'Sep 30' },
        { text: 'Sofia moved "Design system" to Done', at: 'Sep 29' },
        { text: 'Maya moved "Wireframes" to Done', at: 'Sep 27' },
        { text: 'Project created', at: 'Sep 20' },
      ],
      '2026-09-20'),
    project('p2', 'Mobile App v2', 'Northstar', ['PS', 'AM', 'MR'], '2026-10-18', 'risk', generateTasks(['PS', 'AM', 'MR'], '2026-10-18', 6, 3, 4, true), false,
      'Second major release of the Northstar booking app: new payments flow, saved trips and offline mode.'),
    project('p3', 'Brand Website', 'Lumon', ['SL', 'MC', 'DO'], '2026-10-09', 'on', generateTasks(['SL', 'MC', 'DO'], '2026-10-09', 8, 2, 1), false,
      'A compact brand site to launch alongside the Lumon identity refresh.'),
    project('p4', 'Marketing Site', 'Vertex Health', ['DO', 'JP'], '2026-10-28', 'on', generateTasks(['DO', 'JP'], '2026-10-28', 4, 2, 6), false,
      'Patient-facing marketing site for the Vertex clinic network.'),
    project('p5', 'Brand Identity', 'Kanso', ['MC', 'SL', 'AM'], '2026-10-07', 'risk', generateTasks(['MC', 'SL', 'AM'], '2026-10-07', 7, 2, 2, true), false,
      'Logo, type and colour system for Kanso ahead of their retail launch.'),
    project('p6', 'Customer Portal', 'Vertex Health', ['JP', 'AM', 'MR'], '2026-12-02', 'on', generateTasks(['JP', 'AM', 'MR'], '2026-12-02', 3, 2, 7), false,
      'Self-service portal for appointments, records and billing.'),
    project('p7', 'Annual Report', 'Halden & Co.', ['SL', 'AM'], '2026-11-14', 'on', generateTasks(['SL', 'AM'], '2026-11-14', 5, 2, 4), false,
      'Print and web editions of the 2026 annual report.'),
    project('p8', 'Design System', 'Northstar', ['AM', 'MC', 'PS'], '2026-11-30', 'on', generateTasks(['AM', 'MC', 'PS'], '2026-11-30', 4, 3, 5), false,
      'Shared component library across Northstar web and mobile products.'),
    project('p9', 'Product Launch Page', 'Acme Inc.', ['MC', 'DO'], '2026-09-18', 'on', generateTasks(['MC', 'DO'], '2026-09-18', 9, 0, 0), true,
      'Launch page for the Acme Pro product line.'),
    project('p10', 'Packaging', 'Kanso', ['SL'], '2026-08-29', 'on', generateTasks(['SL'], '2026-08-29', 6, 0, 0), true,
      'Packaging system for the first Kanso product range.'),
    project('p11', 'Onboarding Flow', 'Lumon', ['PS', 'MC'], '2026-09-05', 'on', generateTasks(['PS', 'MC'], '2026-09-05', 8, 0, 0), true,
      'New-employee onboarding flow for the Lumon intranet.'),
    project('p12', 'Pitch Deck', 'Halden & Co.', ['AM', 'SL'], '2026-09-25', 'on', generateTasks(['AM', 'SL'], '2026-09-25', 5, 0, 0), true,
      'Investor pitch deck and speaker notes.'),
  ];

  /** Extra tasks assigned to the current user so "My Tasks" has a realistic mix. */
  const myTask = (title: string, status: TaskStatus, due: string, pri: Priority, more: Partial<Task> = {}): Task => ({
    id: nextTaskId(), title, status, who: 'AM', due, pri, desc: '', subtasks: [], log: [], ...more,
  });

  const myExtraTasks: Record<string, Task[]> = {
    p1: [
      myTask('Finalize homepage design', 'progress', TODAY, 'High', {
        desc: 'Complete the desktop and mobile homepage designs before the client review.',
        subtasks: [
          { id: 's1', title: 'Hero section', done: true },
          { id: 's2', title: 'Services section', done: true },
          { id: 's3', title: 'Case studies', done: false },
          { id: 's4', title: 'Mobile version', done: false },
        ],
        log: [
          { text: 'Alex completed "Hero section"', at: 'Today at 9:18 AM' },
          { text: 'Maya changed status to In progress', at: 'Yesterday at 3:42 PM' },
        ],
      }),
      myTask('Implement contact form', 'todo', addDays(TODAY, 1), 'Medium'),
      myTask('Send weekly status update', 'done', TODAY, 'Low', { doneOn: TODAY }),
    ],
    p2: [
      myTask('Review mobile navigation', 'todo', TODAY, 'Medium'),
      myTask('Create empty states', 'todo', addDays(TODAY, 1), 'Medium'),
      myTask('Review sprint backlog', 'done', TODAY, 'Medium', { doneOn: TODAY }),
    ],
    p3: [
      myTask('Update pricing section', 'todo', TODAY, 'Low'),
      myTask('Responsive QA', 'todo', '2026-10-08', 'Medium'),
    ],
    p5: [
      myTask('Prepare client presentation', 'todo', TODAY, 'High'),
      myTask('Client revisions', 'todo', '2026-10-08', 'High'),
      myTask('Export logo files', 'done', TODAY, 'Low', { doneOn: TODAY }),
    ],
  };

  for (const p of projects) {
    const extra = myExtraTasks[p.id];
    if (!extra) continue;
    p.tasks = [...p.tasks, ...extra];
    if (!p.team.includes('AM')) p.team = [...p.team, 'AM'];
  }

  return { v: 2, projects, clients: createSeedClients(), recent: [...SEED_RECENT] };
}
