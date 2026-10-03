'use client';

import { useState, type DragEvent } from 'react';
import { Plus } from 'lucide-react';
import { TASK_STATUSES, TASK_STATUS_LABEL } from '@/lib/constants';
import { cn } from '@/lib/cn';
import type { Project, TaskStatus } from '@/lib/types';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import { InlineTaskForm } from './InlineTaskForm';
import { TaskCard } from './TaskCard';

/** Three-column kanban (To do / In progress / Done) with native HTML5 drag and drop. */
export function TaskBoard({ project }: { project: Project }) {
  const moveTask = useAppStore((s) => s.moveTask);
  const addTask = useAppStore((s) => s.addTask);
  const openDrawer = useUiStore((s) => s.openDrawer);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);

  const endDrag = () => {
    setDraggingId(null);
    setDropTarget(null);
  };

  const handleDrop = (e: DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = draggingId ?? e.dataTransfer.getData('text/plain');
    endDrag();
    if (taskId) moveTask(project.id, taskId, status);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid snap-x snap-mandatory auto-cols-[85%] grid-flow-col items-start gap-3 overflow-x-auto pb-1 desktop:grid-flow-row desktop:grid-cols-[repeat(3,minmax(250px,1fr))] desktop:gap-4">
        {TASK_STATUSES.map((status) => {
          const tasks = project.tasks.filter((t) => t.status === status);
          const isDropTarget = !!draggingId && dropTarget === status;

          return (
            <section
              key={status}
              aria-label={TASK_STATUS_LABEL[status]}
              onDragOver={(e) => {
                e.preventDefault();
                if (dropTarget !== status) setDropTarget(status);
              }}
              onDrop={(e) => handleDrop(e, status)}
              className={cn(
                'flex min-h-60 snap-start flex-col gap-2 rounded-card border p-3',
                isDropTarget ? 'border-dashed border-brand bg-brand-light' : 'border-transparent bg-column',
              )}
            >
              <header className="flex items-center justify-between px-1 pt-0.5 pb-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.06em] text-muted">
                  {TASK_STATUS_LABEL[status].toUpperCase()}
                  <span className="font-medium tracking-normal text-faint">{tasks.length}</span>
                </div>
                <button
                  type="button"
                  aria-label={`Add task to ${TASK_STATUS_LABEL[status]}`}
                  onClick={() => setAddingTo(status)}
                  className="flex size-[26px] items-center justify-center rounded-[7px] text-faint hover:bg-surface hover:text-ink"
                >
                  <Plus size={15} strokeWidth={2} />
                </button>
              </header>

              {addingTo === status && (
                <InlineTaskForm
                  onCancel={() => setAddingTo(null)}
                  onSubmit={(title) => addTask(project.id, { title, status })}
                />
              )}

              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  dragging={draggingId === task.id}
                  onOpen={() => openDrawer({ projectId: project.id, taskId: task.id })}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', task.id);
                    e.dataTransfer.effectAllowed = 'move';
                    // Defer so the browser captures the drag image before the card fades.
                    setTimeout(() => setDraggingId(task.id), 0);
                  }}
                  onDragEnd={endDrag}
                />
              ))}
            </section>
          );
        })}
      </div>
      <p className="-mt-2 text-xs text-faint">Drag cards between columns, or open a task to change its status.</p>
    </div>
  );
}
