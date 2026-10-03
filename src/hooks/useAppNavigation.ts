'use client';

import { useRouter } from 'next/navigation';
import { useUiStore } from '@/store/useUiStore';

export type ProjectTab = 'overview' | 'tasks' | 'files' | 'activity';

export const projectHref = (projectId: string, tab: ProjectTab = 'tasks') =>
  tab === 'tasks' ? `/projects/${projectId}` : `/projects/${projectId}?tab=${tab}`;

export const clientHref = (clientId: string) => `/clients/${clientId}`;

/** Navigation that also closes overlays left open on the previous screen. */
export function useAppNavigation() {
  const router = useRouter();

  const openProject = (projectId: string, tab: ProjectTab = 'tasks') => {
    useUiStore.getState().closeDrawer();
    router.push(projectHref(projectId, tab));
  };

  const openClient = (clientId: string) => router.push(clientHref(clientId));

  return { openProject, openClient, push: router.push };
}
