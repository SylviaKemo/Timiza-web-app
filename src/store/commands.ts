import { getProjectStats } from '@/lib/derive';
import { useAppStore } from './useAppStore';
import { useUiStore } from './useUiStore';

/**
 * User-facing commands that combine a data mutation with UI feedback (toasts, undo).
 * Components call these instead of wiring the two stores together themselves.
 */

const app = () => useAppStore.getState();
const ui = () => useUiStore.getState();

const findProject = (projectId: string) => app().data.projects.find((p) => p.id === projectId);

/** Marks a task done and reports the project's progress change: "Acme: 10 / 15 tasks · 60% → 67%". */
export function completeTask(projectId: string, taskId: string) {
  const project = findProject(projectId);
  const task = project?.tasks.find((t) => t.id === taskId);
  if (!project || !task || task.status === 'done') return;

  const before = getProjectStats(project);
  const after = project.completed ? 100 : Math.round(((before.done + 1) / before.total) * 100);

  app().moveTask(projectId, taskId, 'done');
  ui().showToast(`${project.name}: ${before.done + 1} / ${before.total} tasks · ${before.pct}% → ${after}%`);
}

export function reopenTask(projectId: string, taskId: string) {
  app().moveTask(projectId, taskId, 'todo');
}

export function deleteTask(projectId: string, taskId: string) {
  const removed = app().deleteTask(projectId, taskId);
  if (!removed) return;

  const { drawer, closeDrawer } = ui();
  if (drawer?.taskId === taskId) closeDrawer();

  ui().showToast('Task deleted', () => {
    app().restoreTask(projectId, removed);
    ui().dismissToast();
  });
}

export function toggleProjectCompleted(projectId: string) {
  const project = findProject(projectId);
  if (!project) return;
  const completed = !project.completed;
  app().setProjectCompleted(projectId, completed);
  ui().showToast(completed ? `"${project.name}" marked complete` : `"${project.name}" reopened`);
}

export function archiveProject(projectId: string) {
  const project = findProject(projectId);
  if (!project) return;
  app().setProjectArchived(projectId, true);
  ui().showToast(`"${project.name}" archived`, () => {
    app().setProjectArchived(projectId, false);
    ui().dismissToast();
  });
}

export function resetDemoData() {
  app().resetData();
  ui().closeAllOverlays();
  ui().showToast('Demo data restored');
}
