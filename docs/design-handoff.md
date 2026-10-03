> **Note:** This is the original design handoff, with the product renamed from *Scope* to *Timiza*.
> The HTML prototype files it mentions are design references only and are not part of this repository.

# Handoff: Timiza — Agency Project Management App (MVP)

## Overview
Timiza is a project-management tool for small agencies. It has five connected areas, all running on one shared client-side dataset:

| Route | Question it answers |
|---|---|
| **Overview** `/` | What's happening across the agency? |
| **Projects** `/projects` | How is each client project doing? |
| **Project details** `/projects/[id]` | How is this one project going? (tasks board, details, activity) |
| **My Tasks** `/tasks` | What do *I* (Alex Morgan, the logged-in user) need to get done? |
| **Clients** `/clients` + `/clients/[id]` | Who are we working with, and what's happening with their work? |
| **Settings** `/settings` | Reset demo data |

The core requirement is **one system, not separate pages**. Create client → create project → create/complete tasks → project progress changes → Overview, Clients and My Tasks all update. Every number on every screen is **derived** from the same dataset; nothing is entered per screen. There's no backend: use local state persisted to `localStorage`.

**Target stack:** Next.js (App Router) + React + TypeScript + Tailwind CSS. Icons: `lucide-react`.

## About the Design Files
The files in this bundle are **design references built in HTML**. They're working prototypes that show the intended look and behaviour; they are not production code to copy. Rebuild them in Next.js/React/TS/Tailwind using normal patterns (components, a store, typed models). `Timiza App.dc.html` is a single-file prototype. Open it in a browser next to `support.js` to click through every flow. The logic class at the bottom of that file is the best reference for derivation rules and edge cases.

## Fidelity
**High-fidelity.** Colours, type, spacing, radii, copy and interactions are final. Match them closely.

---

## Design Tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| `orange` (brand) | `#F97316` | Active nav icon, progress fills, tab underline, focus ring, links, notification dot |
| `orange-hover` | `#EA670C` | (legacy hover; buttons now use opacity .88) |
| `orange-dark` | `#C2410C` | Text on orange-light (At risk, High priority, selected options), link hover |
| `orange-light` | `#FFF1E8` | Selected dropdown option bg, focus ring (3px), At-risk badge bg, High-priority badge bg |
| `ink` | `#1C1C1C` | Primary text, **primary buttons**, **sidebar bg**, active filter tab pill, List toggle, toast |
| `bg` | `#F8F8F6` | App background (warm off-white) |
| `surface` | `#FFFFFF` | Cards, inputs, modals, drawer |
| `text-2` | `#6B6B6B` | Secondary text |
| `text-3` | `#9A9A9A` | Muted text, table headers, placeholders |
| `border` | `#E8E8E5` | Card/input borders, dividers |
| `divider` | `#F0F0ED` | Row dividers inside cards |
| `border-hover` | `#D5D5D1` | Secondary-button / card hover border |
| `track` | `#EFEFEC` | Progress-bar track |
| `hover-row` | `#FCFCFB` | Table/list row hover |
| `subtle` | `#F4F4F1` | Chip bg, ghost hover |
| `column` | `#F1F1EE` | Kanban column bg |
| `check-off` | `#C8C8C4` | Unchecked checkbox border, completed-project progress fill |
| `highlight` | `#FFF8F2` | Newly created row highlight (clears after 4s) |

**Sidebar (Ink theme, the chosen default):** bg `#1C1C1C`, border `#2B2B2A`, text `#FFFFFF`, inactive item text `#B4B4B0`, faint/labels `#7A7A77`, active item bg `#2E2E2C` with white text and orange icon, user avatar orange `#F97316` with white initial. Hover on any sidebar item: `box-shadow: inset 0 0 0 999px rgba(128,128,128,.12)`. The mobile top bar uses the same ink colours. (A Light sidebar variant exists in the prototype's Tweaks, but **Ink is the final choice**.)

**Primary buttons: Ink** (`#1C1C1C` bg, white text). This is the final choice; orange stays as the accent.

**Semantic status badges** (pale bg + darker text, 6px dot in the text colour):
| Status | bg | fg |
|---|---|---|
| On track | `#ECF6EF` | `#1F7A3D` |
| At risk | `#FFF1E8` | `#C2410C` |
| Overdue | `#FDEDEC` | `#B42318` |
| Completed / Inactive | `#F1F1EF` | `#6B6B6B` |
| Client "Active" | `#ECF6EF` | `#1F7A3D` |

**Task status (drawer badge / segmented control):** To do `#F1F1EF`/`#6B6B6B` · In progress `#FFF1E8`/`#C2410C` · Done `#ECF6EF`/`#1F7A3D`.
**Priority badge:** High `#FFF1E8` bg / `#C2410C` text · Medium `#F1F1EF` / `#6B6B6B` · Low white bg / `#9A9A9A` text / 1px `#E8E8E5` border.
**Error:** `#B42318` (input border + 12px message). Danger hover bg `#FDEDEC`.
**Overdue dates:** text `#B42318`. Due within 2 days on lists: `#C2410C`.

### Typography
Font: **Figtree** (Google Fonts, weights 400/500/600/700). Inter was the original spec. Figtree was picked through the font tweak.
| Role | Size / weight / tracking |
|---|---|
| Page title (h1) | 30px / 600 / -0.02em |
| Section title (h2) | 18px / 600 |
| Stat / big value | 28px / 600 / -0.02em (suffix like "/ 31" 16px/500 `#9A9A9A`) |
| Client fact value | 22px / 600 / -0.01em |
| Modal title | 20px / 600 |
| Drawer task title (editable input) | 22px / 600 / -0.01em |
| Body / row title | 14px / 400–500 |
| Secondary / meta | 13px |
| Labels, badges, table headers | 12px / 500 |
| Group headers (TODAY, TO DO) | 12px / 600 / 0.06em uppercase |
| Sidebar section label | 11px / 500 / 0.08em uppercase |
| Wordmark "Timiza" | 19px / 700 / -0.02em (mobile bar 17px) |

### Radius, spacing, shadow
- Radius: cards **14px**, modals **16px**, inputs/buttons **10px**, nav items/menu items **8px**, badges **6px**, segmented inner **7px**, kanban cards **12px**, avatars full.
- Card: white, `1px solid #E8E8E5`, **no shadow**.
- Only floating menus/dropdowns get a shadow: `0 8px 24px rgba(28,28,28,0.08)`. Mobile sidebar when open: `0 0 40px rgba(28,28,28,.12)`.
- Overlays: modal `rgba(28,28,28,.28)`, drawer `rgba(28,28,28,.16)`.
- Page padding: desktop `40px 48px 72px`, mobile `24px 16px 56px`. Content max-width **1160px**, centred.
- Vertical section gap: 40px (Overview), 24–28px elsewhere. Card row padding `14–16px 20px`.
- Heights: buttons/inputs 38px (modal inputs 40px), filter tabs 32px, badges 22px, icon buttons 38×38, row menu button 32×32 (40×40 on mobile), mobile touch targets ≥ 44px.

### Buttons
- **Primary:** ink bg, white 14px/500, 38px tall, padding `0 16px 0 12px` with a leading 16px Plus icon (stroke 2), radius 10, hover opacity .88.
- **Secondary:** white bg, 1px `#E8E8E5` border, 14px/500, hover border `#D5D5D1`.
- **Tertiary/link:** orange 13px/500 text + 14px ArrowRight icon ("View all →"), hover `#C2410C`.
- **Danger text:** `#B42318`, hover bg `#FDEDEC`.

### Inputs
White, 1px `#E8E8E5`, radius 10, 14px. Focus: border `#F97316` plus `box-shadow: 0 0 0 3px #FFF1E8`. Error: border `#B42318` with a message below. Selects use `appearance:none` and a 14px ChevronDown at right 12px. **Dynamic option lists (clients, projects) are custom dropdown popovers, not native selects**: a button with the current label, then a popover (radius 12, shadow above) whose options show a 13px/500 label and a 12px `#9A9A9A` sub-line. The selected option gets bg `#FFF1E8`.

### Logo — "Workload" mark (option 1d)
Three left-aligned rounded bars in a 32×32 viewBox:
```svg
<svg viewBox="0 0 32 32"><rect x="4" y="5" width="24" height="5.5" rx="2.75" fill="#F97316"/><rect x="4" y="13.25" width="17" height="5.5" rx="2.75" fill="INK"/><rect x="4" y="21.5" width="10" height="5.5" rx="2.75" fill="INK"/></svg>
```
`INK` = `#1C1C1C` on light backgrounds, `#FFFFFF` on the ink sidebar. Sidebar size 24px, mobile bar 20px. The wordmark "Timiza" sits to the right with a 10px gap. App icon: orange tile with a white mark and an ink lower pair, or an ink tile with white bars and an orange top bar (see `Timiza Logo Options.dc.html`, 1d).

### Icons
lucide-react, **stroke 1.75** (2 for Plus/ArrowRight/X-small, 3 for checkbox check), 16px default. Used: House, FolderKanban, SquareCheckBig, Users, Settings, Search, Bell, Plus, ArrowRight, ArrowLeft, Ellipsis, X, ChevronDown, List, Columns3, FileText, Trash2, Check, Menu.

---

## Data Model (single source of truth)

```ts
type PersonId = 'AM' | 'MC' | 'DO' | 'PS' | 'JP' | 'MR' | 'SL';
const PEOPLE: Record<PersonId, string> = { AM: 'Alex Morgan', MC: 'Maya Chen', DO: 'Daniel Okafor', PS: 'Priya Shah', JP: 'Jin Park', MR: 'Marcus Reid', SL: 'Sofia Lind' };
const CURRENT_USER: PersonId = 'AM';

type TaskStatus = 'todo' | 'progress' | 'done';
type Priority = 'High' | 'Medium' | 'Low';
interface LogEntry { text: string; ts?: number; at?: string } // ts for live events, at = preformatted seed label
interface Subtask { id: string; title: string; done: boolean }
interface Task {
  id: string; title: string; status: TaskStatus; who: PersonId;
  due: string /* ISO yyyy-mm-dd or '' */; pri: Priority; desc: string;
  doneOn?: string | null; subtasks?: Subtask[]; log?: LogEntry[];
}
interface Project {
  id: string; name: string; client: string /* Client.name */; lead: PersonId; team: PersonId[];
  start: string; due: string; health: 'on' | 'risk'; completed: boolean; archived: boolean;
  desc: string; updated: number /* ms, bumped on every change */; tasks: Task[]; activity: LogEntry[];
}
interface Client {
  id: string; name: string /* unique */; contact: string; role: string; email: string; phone: string;
  website: string; since: string /* yyyy-mm */; created?: number; activity: LogEntry[];
}
interface AppData { v: 2; projects: Project[]; clients: Client[]; recent: string[] /* project ids, most recent first, max 6 */ }
```
Persist `AppData` to `localStorage['timiza-app-v2']`. Seed data is in the prototype's `seed()` / `seedClients()` (12 projects, 6 clients, around 150 tasks). Port it to `lib/seed.ts`. The demo "today" is **2026-10-03** (`TODAY` constant). Keep it fixed so the seed data reads correctly.

### Derived values (compute, never store)
```ts
stat(p) = {
  total: p.tasks.length,
  done: tasks with status 'done',
  prog: tasks with status 'progress',
  overdue: tasks not done && due && due < TODAY,
  pct: p.completed ? 100 : total ? round(done/total*100) : 0,
  status: p.completed ? 'done' : (p.due < TODAY ? 'late' : p.health === 'risk' ? 'risk' : 'on')  // → Completed / Overdue / At risk / On track
}
```
- **visible projects** = `!archived`. **active** = visible && `!completed`.
- Projects tab counts: All = visible; Active = active; **At risk** = status `risk` or `late`; Completed = completed.
- Overview stats: Active projects (+ "N finishing this month" = due in Oct 2026); **Tasks due this week** = open tasks in active projects with `TODAY ≤ due ≤ TODAY+7` (+ "Tasks across N projects"); Tasks completed = done/total across active projects; Needs attention = active projects where status is late, or there are overdue tasks, or health is risk (+ "X overdue · Y at risk").
- Team workload = open tasks per person across active projects, capacity 10. Bars are orange; over 10 shows `#C2410C` and "N / 10 · Over capacity". Show the top 5.
- Client: projects = visible projects whose `client === name`; active = not completed; status Active if active > 0, otherwise Inactive; last activity = max(client.created, project.updated, client activity ts), shown as Today / Yesterday / "Oct 1".
- My Tasks: tasks where `who === 'AM'` in visible projects.

### Mutations (all go through one store; each bumps `project.updated` and appends to `project.activity`)
- `moveTask(pid, tid, status)` sets status and `doneOn` (= TODAY when done, otherwise null). Logs to the task (`"Alex changed status to In progress"`) and the project (`'Alex moved "X" to Done'`).
- `completeTask` = moveTask(done) plus a toast: `"{Project}: {done+1} / {total} tasks · {before}% → {after}%"`.
- `updTask(pid, tid, patch, log?)`, `addTask`, `deleteTask` (toast with **Undo**), `addSubtask`/`toggleSubtask` (completing one logs `Alex completed "X"`).
- `createProject` / `updateProject` / `markComplete` / `reopen` / `archive` (toast with Undo) / `setHealth`.
- `createClient` (logs `"{contact} was added as primary contact"`).
- `openProject(pid)` also pushes the pid to the front of `recent`.
- Reset demo data (Settings) restores the seed.

Suggested: a Zustand store (or React context + reducer) with `persist` to localStorage, plus selector hooks for the derived values (`useProjectStats`, `useOverview`, `useMyTasks`, `useClientInfo`).

---

## Layout Shell
- Root: flex row. **Sidebar 240px** (max 84vw), sticky full height, ink theme, padding `24px 14px 16px`.
  - Logo row (mark + "Timiza"), min-height 44.
  - Nav: Overview, Projects (count = visible projects), My Tasks (count = Alex's open tasks in active projects), Clients. Items are 36px tall (44px on mobile), radius 8, 14px/500, 16px icon, count right-aligned 12px faint.
  - **RECENT PROJECTS** label, then up to 4 recently opened projects (`"{client first word} · {project}"`, 8px hollow circle bullet). Clicking one opens the project. Empty state: "Projects you open will appear here." Seed recent: p1, p2, p5.
  - Spacer, Settings item, divider, user block (32px orange avatar "A", "Alex Morgan" 13/500, "alex@timiza.app" 12 faint).
- Main: `flex:1`, padding as above, inner max-width 1160 centred.
- **Breakpoints**
  - `< 900px` (mobile): sidebar becomes an off-canvas drawer (fixed, `translateX(-100%)`, 0.25s ease) with an overlay. A sticky 56px ink top bar shows a 44px Menu button, logo, "· {Section}" and the avatar. The drawer has a close X and closes on navigation, overlay click or Esc.
  - `< 1200px` (compact): tables switch to stacked list rows (details below), so nothing scrolls sideways at tablet widths.
  - Search inputs go full width under 900.
- Esc closes any open menu, dropdown, modal, drawer or mobile nav.

## Screens

### 1. Overview `/`
- Header: "Good morning, Alex" / "Saturday, October 3 · Here's what's happening today." On the right: Search icon button, Bell icon button with a 6px orange dot, primary "New project" (opens the project modal).
- Stat cards in a grid `repeat(auto-fit, minmax(150px,1fr))`, gap 16. Each card: label 13/500 `#6B6B6B`, value 28/600, note 13 `#9A9A9A`, padding `20px 20px 18px`, internal gap 14. The Needs-attention value is `#C2410C` when > 0.
- Two-row flex-wrap grid (main column `flex:2 1 520px`, side `flex:1 1 300px`, gap `40px 32px`):
  - **Active projects** (+ "View all →"): card list of the top 5 active projects by due date. Desktop row grid `minmax(0,1.6fr) 104px 64px minmax(120px,1fr)`: name + client · status badge · due · progress bar (6px, track `#EFEFEC`, orange fill) + % right. In compact mode: name | status, with the bar on its own full-width row and the due date hidden.
  - **Needs attention** ("N projects"): rows show `"{client} · {project}"` + badge (Overdue if there are overdue tasks or the date has passed, otherwise At risk), a detail line ("2 tasks overdue: A, B. Project due Oct 18." or "Marked at risk. Project due …") and "Review tasks →", which opens the project's Tasks tab. Empty: "Nothing needs you right now".
  - **Upcoming** (+ "My tasks →"): open tasks due in the next 7 days, top 5. Row grid `96px 1fr auto`: when (Today / Tomorrow / "Mon, Oct 5", orange-dark if ≤ 2 days) · title + project · 28px initials avatar. Clicking a row opens the task drawer.
  - **Team workload** ("Open tasks"): name + "N / 10", with a bar under it.

### 2. Projects `/projects`
- Header: "Projects" / "Manage and track all your client projects." + "New project".
- Toolbar (flex-wrap gap 10): search (280px, "Search projects", matches name or client), **Client dropdown** (custom popover: "All clients" + every client with contact as sub-line), **Sort** select (Due date [default; completed sink to the bottom] / Recently updated / Progress / Name), spacer, **List | Board** segmented control (List active = ink pill; Board disabled with tooltip "Board view is coming later"). **There is no status dropdown**: status filtering belongs to the tabs.
- Status tabs: **All 12 · Active 8 · At risk N · Completed 4**. Pills are 32px; active = ink bg, white text, count `#A3A3A0`; hover opacity .85.
- Table card. Desktop columns `minmax(200px,2fr) minmax(110px,1.1fr) minmax(150px,1.4fr) 96px 72px 112px 32px`: Project (name 14/500 + "9 of 15 tasks" 12 muted) · Client · Progress (bar + %, completed projects use a `#C8C8C4` fill) · Team (up to 3 overlapping 28px avatars with initials, -8px overlap, 2px white ring, then "+N") · Due date (red if overdue) · Status badge · ••• menu.
  - Compact (< 1200): grid areas `"n m" "p p" "d s"`. The sub-line becomes "Acme Inc. · 9 of 15 tasks", the due date reads "Due Oct 12", and Client, Team and the table header are hidden.
  - Row click opens Project details. ••• opens a fixed-position menu (180px) with Edit project / Mark complete (or Reopen project) / divider / Archive (red; toast with Undo).
  - Empty: "No projects match your filters" + "Clear filters". Footer: "Showing X of Y projects".
- New projects are prepended and the row is highlighted `#FFF8F2` for 4s. Creating a project also clears filters and navigates here.

### 3. Create / Edit project modal
540px wide, title "Create new project" / "Edit project". Fields: Project name (required → "Project name is required."), Client (custom dropdown listing all clients, including new ones; preset when opened from a client page), Start date + Due date (2-col; due required and must be ≥ start → "Due date must be after the start date."), Team members (removable chips "Maya ×" + a dashed "+ Add" picker; lead = first member; defaults to [AM]), Description textarea. Footer: Cancel / "Create project" or "Save changes". Overlay click or Esc closes it.

### 4. Project details `/projects/[id]`
- "← Projects" link. h1 name, then a row with client (500) · status badge. Right side: secondary "Edit project" and primary "Add task" (opens the task modal with this project preselected).
- Summary card: Progress (28px %, 8px bar animated `width .4s ease`, "9 of 15 tasks done · 3 in progress") and Due date (28px "Oct 12", plus "9 days left" / "N days overdue" in red / "Due today" / "Completed").
- Tabs (underline 2px orange on the active one; horizontally scrollable on mobile): **Overview · Tasks {count} · Files · Activity**. Default: Tasks.
  - **Overview:** details card (rows grid `120px 1fr`: Client, Project lead, Timeline "Sep 20 — Oct 12", Team chips, Health toggle On track / At risk, which logs on change) + Description (14px, line-height 1.65, max 60ch).
  - **Tasks:** 3-column board (To do / In progress / Done), columns `repeat(3, minmax(250px,1fr))`, gap 16. On mobile the columns are `repeat(3,85%)` with horizontal scroll-snap. Column: bg `#F1F1EE`, radius 14, padding 12, header (12/600 uppercase label + count + a "+" button that opens an inline add card: input with "Task title" placeholder, Enter adds, Esc cancels). Cards: title 14/500 (Done cards `#6B6B6B`), then a wrapping row with the priority badge "High priority" (nowrap) and "Maya · Oct 8" (red if overdue). **Drag and drop** between columns with the native HTML5 API: while dragging, the target column turns `#FFF1E8` with a 1px dashed orange border and the dragged card drops to 40% opacity. Clicking a card opens the task drawer. Hint under the board: "Drag cards between columns, or open a task to change its status."
  - **Files:** empty state (FileText icon, "No files yet", "Briefs, contracts and deliverables for this project will live here.").
  - **Activity:** project log, newest first. The first dot is orange, the rest `#D5D5D1`. Times: "Just now / 5m ago / 3h ago / 2d ago", or the seed label.

### 5. Task drawer (global — opens from any screen)
Fixed right panel, 460px (full width on mobile), white with a left border, over a 16% ink overlay.
- Header: project (folder icon + client; links to the project) + close X.
- Editable title input (22/600). Badges: status (dot) + "High priority".
- Field grid `96px 1fr`: Status segmented control (To do / In progress / Done; picking Done runs completeTask with its toast), Priority segmented control (Low/Medium/High; active = `#FFF1E8`/`#C2410C`), Project (link), Assignee select (all 7 people; logs on change), Due date input + relative label ("Today", "In 3 days", "2d overdue" in red).
- Description textarea. **Subtasks** ("2 of 4"): 18px square checkboxes (radius 5; checked = orange fill with a white check, struck-through text), remove ×, and an "Add subtask and press Enter" input. **Activity**: the task's log.
- Footer: "Delete" (red, toast with Undo) on the left. On the right, primary "Mark complete" (with a Check icon) or secondary "Mark incomplete". Every change saves immediately ("Changes save automatically").

### 6. My Tasks `/tasks`
- Header: "My Tasks" / "Stay on top of your work across every project." + primary "Add task".
- **Today's progress**: label, 280px bar, "**3** of 7 completed". The total is Alex's tasks due today and the done count is those completed.
- Tabs: **Today** (open and due ≤ today, so overdue is included) · **Upcoming** (open, due > today or no date) · **All** (open) · **Completed** (done). Each tab shows its count.
- Controls: search ("Search tasks", matches title, project or client), Project dropdown (custom popover; only projects where Alex has tasks), Priority select (All priorities / High / Medium / Low).
- Grouped list. Groups are sorted Overdue (red header) → Today → Tomorrow → each date within 7 days ("OCT 8") → Later → No date. On the Completed tab: "Completed today" → "Earlier". Each group header shows the uppercase label (12/600, 0.06em) and "N tasks" on the right.
- Row grid `20px 1fr 84px 96px 32px`: checkbox · title + "Acme · Website Redesign" · priority badge · due label · ••• menu. Compact: `20px 1fr 40px`, with priority and due moved into the sub-line ("Acme · Website Redesign · High · Today").
- **Completing:** clicking the checkbox fills it orange, strikes the title through and fades the row to 0.5 opacity (`.35s`). After **700ms** the task moves to Done (and out of Today), and the project-progress toast appears. Unchecking a done task sets it back to To do.
- Row ••• menu (200px): Open task / Mark complete or Mark incomplete / Priority quick-set (3 small buttons) / Delete task (Undo toast).
- Empty states: Today "You're clear for today" / "Nothing due today or overdue."; Upcoming "Nothing scheduled ahead"; All "No open tasks"; Completed "No completed tasks yet"; with filters active: "No tasks match your filters" / "Try a different search, project or priority."

### 7. Create task modal
460px wide, "Create task". Fields: Task name (required → "Task name is required."; Enter submits), Project (custom dropdown of active projects, required → "Choose a project for this task."; preselected when opened from a project page), Assignee (default Alex) + Due date (default today) in 2 columns, Priority as three 38px toggle buttons (Low / Medium [default] / High; active = `#FFF1E8` bg, `#FBD5BA` border, `#C2410C` text). Creates a `todo` task. Toast: "Task added to {Project}" (adds " for {Name}" when the task isn't assigned to Alex).

### 8. Clients `/clients`
- Header: "Clients" / "Manage your clients and their active projects." + primary "Add client".
- Toolbar: search (name, contact or email), Status select (All / Active / Inactive), Sort select (Name / Last activity / Most projects).
- Table columns `minmax(170px,1.5fr) minmax(190px,1.6fr) 80px 70px 110px 90px`: Client (name + website) · Contact (name + email) · Projects (right-aligned) · Active (right-aligned) · Last activity · Status badge. Compact: `1fr auto` with name + "Sarah Mitchell · 2 active" | status. Rows open Client details. Footer "Showing X of Y clients". A newly added client row gets the `#FFF8F2` highlight.

### 9. Client details `/clients/[id]`
- "← Clients". h1 name + badge ("Active client" green / "Inactive"). Contact block: 40px orange-light initials avatar, name 14/500, then "Product Manager · sarah@acme.com · +1 415 555 0142". Right side: primary "New project" (opens the project modal with this client preset).
- Tabs: Overview · Projects {n} · Activity.
  - **Overview:** facts card (grid `auto-fit minmax(140px,1fr)`): Active projects, Completed projects, Primary contact, Working with us since ("Mar 2026"). Then **Active projects** (cards: name 15/500, bar + %, "Due Oct 12" + status badge; click opens the project's Overview tab) and **Upcoming deadlines** (open tasks due ≥ today plus each project's "Final delivery" on its due date, top 6, grid `56px 1fr`, date 13/600). Empty states: "No active projects" / "No upcoming deadlines."
  - **Projects:** all of the client's projects, active first, same card style.
  - **Activity:** merged project and client logs (live ts entries sorted newest first, then seed entries), sub-line "{Project} · 2h ago".

### 10. Add client modal
460px wide, "Add client". Fields: Company name * (required; unique, case-insensitive → "A client with this name already exists."), Contact name * (required), Email (if filled, must match `^[^\s@]+@[^\s@]+\.[^\s@]+$` → "Enter a valid email address."), Phone + Website (2 columns). Required asterisk in `#C2410C`. Sets `since` to the current month. Toast: "{Name} added — now available when creating projects". The client is immediately available in both client dropdowns.

### Toast
Fixed bottom-centre (28px from the bottom), ink bg, white 13px text, radius 10, min-height 42, max-width `calc(100vw - 32px)`. Optional "Undo" button (`#FDBA74`). Auto-dismisses after 4s.

---

## Suggested Next.js structure
```
app/
  layout.tsx            // font (next/font/google Figtree), <AppShell>
  page.tsx              // Overview
  projects/page.tsx
  projects/[id]/page.tsx
  tasks/page.tsx
  clients/page.tsx
  clients/[id]/page.tsx
  settings/page.tsx
components/
  shell/Sidebar.tsx, MobileTopBar.tsx, Logo.tsx
  ui/Button.tsx, Badge.tsx (StatusBadge, PriorityBadge), ProgressBar.tsx, Tabs.tsx, Dropdown.tsx, Select.tsx, Input.tsx, Modal.tsx, Drawer.tsx, Menu.tsx, Toast.tsx, Avatar.tsx, Checkbox.tsx, Segmented.tsx
  projects/ProjectTable.tsx, ProjectModal.tsx, TaskBoard.tsx
  tasks/TaskList.tsx, TaskDrawer.tsx, TaskModal.tsx
  clients/ClientTable.tsx, ClientModal.tsx
lib/
  types.ts, seed.ts, dates.ts (TODAY, addDays, diff, fmt "Oct 12", when "Mon, Oct 5", ago), derive.ts (stat, overview, myTasks, clientInfo)
store/
  useTimiza.ts           // Zustand + persist('timiza-app-v2'); UI state (drawer/modals/toast) can live in a separate non-persisted slice
```
Tailwind: extend `theme.colors` with the tokens above (`orange`, `orange-dark`, `orange-light`, `ink`, `bg`, `surface`, `text-2`, `text-3`, `line`, `divider`, `track`…), `borderRadius` (card 14px, modal 16px), and `fontFamily.sans = ['var(--font-figtree)', ...]`. Mount the drawer, modals, menus and toast once in the shell so they work from any route. Hydrate the persisted store on the client only, to avoid SSR mismatch.

## Assets
No raster images. The logo is the SVG above. Icons come from lucide-react. The font is Figtree from Google Fonts.

## Files
- `Timiza App.dc.html`: the full interactive prototype (all screens, flows and logic). Open it in a browser with `support.js` alongside. The JS class at the bottom has the seed data, derivation rules and every handler.
- `Timiza Logo Options.dc.html`: the logo exploration. **1d "Workload" is the chosen mark.**
- `support.js`: the runtime needed to open the prototypes locally. Not part of the implementation.
