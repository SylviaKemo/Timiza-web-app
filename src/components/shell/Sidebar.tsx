'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { CURRENT_USER } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { countMyOpenTasks, getVisibleProjects, projectLabel } from '@/lib/derive';
import { useAppStore } from '@/store/useAppStore';
import { MAIN_NAV, SETTINGS_NAV, navKeyFor, type NavLink } from './navigation';

const MAX_SIDEBAR_RECENT = 4;

interface SidebarProps {
  isMobile: boolean;
  open: boolean;
  onClose: () => void;
}

/** Ink sidebar: sticky on desktop, an off-canvas drawer below 900px. */
export function Sidebar({ isMobile, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const activeKey = navKeyFor(pathname);
  const projects = useAppStore((s) => s.data.projects);
  const recentIds = useAppStore((s) => s.data.recent);
  const { openProject } = useAppNavigation();

  const counts = useMemo(
    () => ({ projects: getVisibleProjects(projects).length, tasks: countMyOpenTasks(projects) }),
    [projects],
  );

  const recentProjects = useMemo(() => {
    const visible = getVisibleProjects(projects);
    return recentIds
      .map((id) => visible.find((p) => p.id === id))
      .filter((p) => p !== undefined)
      .slice(0, MAX_SIDEBAR_RECENT);
  }, [projects, recentIds]);

  return (
    <aside
      className={cn(
        'top-0 left-0 flex h-dvh w-60 max-w-[84vw] shrink-0 flex-col overflow-y-auto border-r border-sidebar-line bg-sidebar px-3.5 pt-6 pb-4 text-white transition-transform duration-250 ease-out',
        isMobile ? 'fixed z-45' : 'sticky',
        isMobile && !open && '-translate-x-full',
        isMobile && open && 'shadow-nav',
      )}
    >
      <div className="flex min-h-11 items-center gap-2.5 pr-1 pb-6 pl-2.5">
        <Logo className="flex-1" />
        {isMobile && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-control text-sidebar-muted"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-0.5">
        {MAIN_NAV.map((item) => (
          <SidebarLink
            key={item.key}
            item={item}
            active={activeKey === item.key}
            count={item.key === 'projects' ? counts.projects : item.key === 'tasks' ? counts.tasks : undefined}
            onNavigate={onClose}
          />
        ))}
      </nav>

      <div className="px-2.5 pt-7 pb-2 text-[11px] font-medium tracking-[0.08em] text-sidebar-faint">
        RECENT PROJECTS
      </div>
      <div className="flex flex-col gap-0.5">
        {recentProjects.map((project) => {
          const active = pathname === `/projects/${project.id}`;
          return (
            <button
              key={project.id}
              type="button"
              onClick={() => {
                openProject(project.id);
                onClose();
              }}
              className={cn(
                'flex h-11 items-center gap-3 rounded-item px-2.5 text-left text-sm hover-tint desktop:h-9',
                active ? 'bg-sidebar-active text-white' : 'text-sidebar-muted',
              )}
            >
              <span className="mx-1 size-2 shrink-0 rounded-full border-[1.5px] border-sidebar-faint" />
              <span className="truncate">{projectLabel(project)}</span>
            </button>
          );
        })}
        {recentProjects.length === 0 && (
          <div className="px-2.5 py-1 text-xs leading-normal text-sidebar-faint">
            Projects you open will appear here.
          </div>
        )}
      </div>

      <div className="flex-1" />

      <SidebarLink item={SETTINGS_NAV} active={activeKey === 'settings'} onNavigate={onClose} />

      <div className="mt-3 flex items-center gap-2.5 border-t border-sidebar-line px-2.5 pt-4">
        <span className="flex size-8 items-center justify-center rounded-full bg-brand text-[13px] font-semibold">
          {CURRENT_USER.name[0]}
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-medium">{CURRENT_USER.name}</div>
          <div className="text-xs text-sidebar-faint">{CURRENT_USER.email}</div>
        </div>
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  item: NavLink;
  active: boolean;
  count?: number;
  onNavigate: () => void;
}

function SidebarLink({ item, active, count, onNavigate }: SidebarLinkProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-11 items-center gap-2.5 rounded-item px-2.5 text-sm font-medium hover-tint desktop:h-9',
        active ? 'bg-sidebar-active text-white' : 'text-sidebar-muted',
      )}
    >
      <Icon size={16} className={active ? 'text-brand' : 'text-sidebar-faint'} />
      <span className="flex-1">{item.label}</span>
      {count !== undefined && <span className="text-xs text-sidebar-faint">{count}</span>}
    </Link>
  );
}
