import { FolderKanban, House, Settings, SquareCheckBig, Users, type LucideIcon } from 'lucide-react';

export type NavKey = 'overview' | 'projects' | 'tasks' | 'clients' | 'settings';

export interface NavLink {
  key: NavKey;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const MAIN_NAV: NavLink[] = [
  { key: 'overview', label: 'Overview', href: '/', icon: House },
  { key: 'projects', label: 'Projects', href: '/projects', icon: FolderKanban },
  { key: 'tasks', label: 'My Tasks', href: '/tasks', icon: SquareCheckBig },
  { key: 'clients', label: 'Clients', href: '/clients', icon: Users },
];

export const SETTINGS_NAV: NavLink = { key: 'settings', label: 'Settings', href: '/settings', icon: Settings };

/** Which nav item a pathname belongs to (detail pages map to their list). */
export function navKeyFor(pathname: string): NavKey {
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/tasks')) return 'tasks';
  if (pathname.startsWith('/clients')) return 'clients';
  if (pathname.startsWith('/settings')) return 'settings';
  return 'overview';
}

export const sectionTitle = (pathname: string) =>
  [...MAIN_NAV, SETTINGS_NAV].find((n) => n.key === navKeyFor(pathname))?.label ?? '';
