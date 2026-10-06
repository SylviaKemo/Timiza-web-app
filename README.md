# Timiza

Project management for small agencies — one connected system for clients, projects and tasks.

Create a client → create a project → add and complete tasks → project progress changes → Overview,
Clients and My Tasks all update. Every number on every screen is **derived** from one shared dataset;
nothing is entered per screen. There is no backend: data lives in a Zustand store persisted to
`localStorage`.

| Route | Answers |
| --- | --- |
| `/` Overview | What's happening across the agency? |
| `/projects` | How is each client project doing? |
| `/projects/[id]` | How is this one project going? (task board, details, activity) |
| `/tasks` | What do *I* (Alex Morgan) need to get done? |
| `/clients`, `/clients/[id]` | Who are we working with, and how is their work going? |
| `/settings` | Reset demo data |

## Tech stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Zustand · lucide-react

Deployed on Vercel with [Web Analytics](https://vercel.com/docs/analytics) and
[Speed Insights](https://vercel.com/docs/speed-insights) (`<Analytics />` and `<SpeedInsights />` in
`src/app/layout.tsx`). Enable both in the Vercel project dashboard; they collect nothing in local dev.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

The demo "today" is fixed at **2026-10-03** (`TODAY` in `src/lib/constants.ts`) so the seed data always
reads correctly. Use **Settings → Reset demo data** to restore the seed.

## Project structure

```
src/
  app/                     Routes (thin server components that render a view)
    layout.tsx             Font, metadata and <AppShell>
    page.tsx               Overview
    projects/, projects/[id]/, tasks/, clients/, clients/[id]/, settings/
  components/
    brand/                 Timiza logo
    shell/                 AppShell, Sidebar, MobileTopBar, GlobalOverlays
    ui/                    Reusable primitives (Button, Badge, Modal, Drawer, Tabs, …)
    overview/              Overview dashboard sections
    projects/              Projects list, row menu, project modal
    project-details/       Project page: summary, overview tab, task board
    my-tasks/              My Tasks list, rows and filters
    tasks/                 Global task drawer and create-task modal
    clients/               Clients list, client page and add-client modal
    settings/              Settings page
  hooks/                   useAppNavigation, useBreakpoints, useEscapeKey
  lib/
    types.ts               Domain model (Project, Task, Client, AppData)
    constants.ts           TODAY, people, labels, storage key
    dates.ts               Date maths and display formatting
    seed.ts                Demo data
    derive/                Derived values: project stats, overview, my tasks, clients
  store/
    useAppStore.ts         Persisted data + every mutation
    useUiStore.ts          Drawer, modals, toast, highlights, list filters
    commands.ts            Mutations that also show toasts / undo
    useStoreHydration.ts   Client-only localStorage hydration
```

### Conventions

- **Derive, don't store.** Progress, statuses, counts and groupings are computed in `lib/derive`.
  Components never compute business rules inline.
- **One place for mutations.** Data changes go through `useAppStore` (or `store/commands` when the
  user also needs feedback such as a toast with Undo).
- **Overlays are global.** The task drawer and modals are mounted once in `GlobalOverlays` and opened
  through `useUiStore`, so any screen can open them.
- **Design tokens** live in `src/app/globals.css` (`@theme`). Use token classes such as `bg-brand`,
  `text-muted`, `rounded-card` rather than raw hex values.
- **Breakpoints:** `desktop:` (≥ 900px, sidebar visible) and `wide:` (≥ 1200px, full tables).
  `useBreakpoints()` is used only where the markup itself changes.
- `cn()` merges class names with `tailwind-merge`, so a `className` prop can override defaults.

## Git workflow

`main` is always buildable. Work happens on short-lived branches merged with `--no-ff`:

| Prefix | Use |
| --- | --- |
| `feature/…` | New screens or capabilities |
| `fix/…` | Bug fixes |
| `chore/…` | Tooling and configuration |
| `docs/…` | Documentation |

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat(projects): …`).

## Design reference

The full design handoff (tokens, screens, behaviours) is in [docs/design-handoff.md](docs/design-handoff.md).
