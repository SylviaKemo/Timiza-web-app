'use client';

import { MenuDivider, MenuItem, RowMenu } from '@/components/ui/Menu';
import { PRIORITIES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import type { TaskWithProject } from '@/lib/types';
import { deleteTask, reopenTask } from '@/store/commands';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';

interface TaskRowMenuProps {
  task: TaskWithProject;
  /** Starts the animated completion owned by the row. */
  onComplete: () => void;
}

/** ••• menu on a My Tasks row: open, complete/reopen, quick priority, delete. */
export function TaskRowMenu({ task, onComplete }: TaskRowMenuProps) {
  const openDrawer = useUiStore((s) => s.openDrawer);
  const updateTask = useAppStore((s) => s.updateTask);
  const isDone = task.status === 'done';

  return (
    <RowMenu label={`Actions for ${task.title}`} width={200} height={220}>
      {(close) => (
        <>
          <MenuItem
            onClick={() => {
              close();
              openDrawer({ projectId: task.project.id, taskId: task.id });
            }}
          >
            Open task
          </MenuItem>
          <MenuItem
            onClick={() => {
              close();
              if (isDone) reopenTask(task.project.id, task.id);
              else onComplete();
            }}
          >
            {isDone ? 'Mark incomplete' : 'Mark complete'}
          </MenuItem>

          <div className="px-2.5 pt-2 pb-1.5 text-xs text-faint">Priority</div>
          <div className="grid grid-cols-3 gap-1 px-1.5 pb-1.5">
            {PRIORITIES.map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => {
                  close();
                  updateTask(task.project.id, task.id, { pri: priority });
                }}
                className={cn(
                  'h-7 rounded-[7px] text-xs font-medium',
                  task.pri === priority ? 'bg-brand-light text-brand-dark' : 'bg-subtle text-muted',
                )}
              >
                {priority}
              </button>
            ))}
          </div>

          <MenuDivider />
          <MenuItem
            danger
            onClick={() => {
              close();
              deleteTask(task.project.id, task.id);
            }}
          >
            Delete task
          </MenuItem>
        </>
      )}
    </RowMenu>
  );
}
