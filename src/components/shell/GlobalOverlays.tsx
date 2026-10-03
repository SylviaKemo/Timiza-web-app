'use client';

import { ClientModal } from '@/components/clients/ClientModal';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { TaskDrawer } from '@/components/tasks/TaskDrawer';
import { TaskModal } from '@/components/tasks/TaskModal';
import { Toast } from '@/components/ui/Toast';
import { useUiStore } from '@/store/useUiStore';

/** Overlays that can be opened from any screen. Mounted once by the app shell. */
export function GlobalOverlays() {
  const toast = useUiStore((s) => s.toast);

  return (
    <>
      <TaskDrawer />
      <TaskModal />
      <ProjectModal />
      <ClientModal />
      {toast && <Toast key={toast.id} text={toast.text} onUndo={toast.undo} />}
    </>
  );
}
