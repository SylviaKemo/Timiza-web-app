'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';

export type ProjectTab = 'overview' | 'tasks' | 'files' | 'activity';

export const projectHref = (projectId: string, tab: ProjectTab = 'tasks') =>
  tab === 'tasks' ? `/projects/${projectId}` : `/projects/${projectId}?tab=${tab}`;

export const clientHref = (clientId: string) => `/clients/${clientId}`;

/** Navigation that also updates app state (recent projects, open overlays). */
export function useAppNavigation() {
  const router = useRouter();

  const openProject = (projectId: string, tab: ProjectTab = 'tasks') => {
    useAppStore.getState().markProjectOpened(projectId);
    useUiStore.getState().closeDrawer();
    router.push(projectHref(projectId, tab));
  };

  const openClient = (clientId: string) => router.push(clientHref(clientId));

  return { openProject, openClient, push: router.push };
}
