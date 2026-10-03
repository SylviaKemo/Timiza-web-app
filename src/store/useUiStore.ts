import { create } from 'zustand';
import { DEFAULT_PROJECT_FILTERS, type ProjectFilters } from '@/lib/derive';

/**
 * Transient UI state (not persisted): the task drawer, modals, toast and highlights.
 * Overlays live here so they can be opened from any screen and are mounted once in the app shell.
 */

const TOAST_DURATION_MS = 4000;

export interface DrawerTarget {
  projectId: string;
  taskId: string;
}

export type ProjectModalState = { mode: 'create'; presetClient?: string } | { mode: 'edit'; projectId: string };

export interface ToastState {
  id: number;
  text: string;
  undo?: () => void;
}

interface UiState {
  drawer: DrawerTarget | null;
  projectModal: ProjectModalState | null;
  /** `projectId` preselects the project in the Create task modal. */
  taskModal: { projectId?: string } | null;
  clientModalOpen: boolean;
  mobileNavOpen: boolean;
  toast: ToastState | null;
  /** Newly created rows get a short highlight. */
  highlightedProjectId: string | null;
  highlightedClientId: string | null;
  /** Kept here (not in the page) so creating a project can reset them. */
  projectFilters: ProjectFilters;

  openDrawer: (target: DrawerTarget) => void;
  closeDrawer: () => void;
  openProjectModal: (state: ProjectModalState) => void;
  closeProjectModal: () => void;
  openTaskModal: (projectId?: string) => void;
  closeTaskModal: () => void;
  openClientModal: () => void;
  closeClientModal: () => void;
  setMobileNavOpen: (open: boolean) => void;
  showToast: (text: string, undo?: () => void) => void;
  dismissToast: () => void;
  highlightProject: (projectId: string) => void;
  highlightClient: (clientId: string) => void;
  setProjectFilters: (patch: Partial<ProjectFilters>) => void;
  resetProjectFilters: () => void;
  /** Esc closes every overlay. */
  closeAllOverlays: () => void;
}

let toastCounter = 0;
let toastTimer: ReturnType<typeof setTimeout> | undefined;
let highlightTimer: ReturnType<typeof setTimeout> | undefined;

export const useUiStore = create<UiState>()((set) => ({
  drawer: null,
  projectModal: null,
  taskModal: null,
  clientModalOpen: false,
  mobileNavOpen: false,
  toast: null,
  highlightedProjectId: null,
  highlightedClientId: null,
  projectFilters: DEFAULT_PROJECT_FILTERS,

  openDrawer: (target) => set({ drawer: target }),
  closeDrawer: () => set({ drawer: null }),
  openProjectModal: (state) => set({ projectModal: state }),
  closeProjectModal: () => set({ projectModal: null }),
  openTaskModal: (projectId) => set({ taskModal: { projectId } }),
  closeTaskModal: () => set({ taskModal: null }),
  openClientModal: () => set({ clientModalOpen: true }),
  closeClientModal: () => set({ clientModalOpen: false }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  showToast: (text, undo) => {
    clearTimeout(toastTimer);
    set({ toast: { id: ++toastCounter, text, undo } });
    toastTimer = setTimeout(() => set({ toast: null }), TOAST_DURATION_MS);
  },
  dismissToast: () => {
    clearTimeout(toastTimer);
    set({ toast: null });
  },

  highlightProject: (projectId) => {
    clearTimeout(highlightTimer);
    set({ highlightedProjectId: projectId });
    highlightTimer = setTimeout(() => set({ highlightedProjectId: null }), TOAST_DURATION_MS);
  },
  highlightClient: (clientId) => {
    clearTimeout(highlightTimer);
    set({ highlightedClientId: clientId });
    highlightTimer = setTimeout(() => set({ highlightedClientId: null }), TOAST_DURATION_MS);
  },

  setProjectFilters: (patch) => set((s) => ({ projectFilters: { ...s.projectFilters, ...patch } })),
  resetProjectFilters: () => set((s) => ({ projectFilters: { ...DEFAULT_PROJECT_FILTERS, sort: s.projectFilters.sort } })),

  closeAllOverlays: () =>
    set({ drawer: null, projectModal: null, taskModal: null, clientModalOpen: false, mobileNavOpen: false }),
}));
