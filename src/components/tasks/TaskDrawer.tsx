'use client';

import type { ReactNode } from 'react';
import { Check, FolderKanban, Trash2 } from 'lucide-react';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { PriorityBadge, TaskStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { TextArea } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import { Select } from '@/components/ui/Select';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { CURRENT_USER, firstName } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { daysFromToday, formatLogTime, formatRelative } from '@/lib/dates';
import type { PersonId, Project, Task } from '@/lib/types';
import { completeTask, deleteTask, reopenTask } from '@/store/commands';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import { PEOPLE_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from './options';
import { SubtaskList } from './SubtaskList';

/** Global task drawer. Every change saves immediately. */
export function TaskDrawer() {
  const target = useUiStore((s) => s.drawer);
  const closeDrawer = useUiStore((s) => s.closeDrawer);
  const project = useAppStore((s) => (target ? s.data.projects.find((p) => p.id === target.projectId) : undefined));
  const task = project?.tasks.find((t) => t.id === target?.taskId);

  if (!project || !task) return null;
  // Keyed so local input state resets when another task opens.
  return <TaskDrawerContent key={task.id} project={project} task={task} onClose={closeDrawer} />;
}

interface TaskDrawerContentProps {
  project: Project;
  task: Task;
  onClose: () => void;
}

function TaskDrawerContent({ project, task, onClose }: TaskDrawerContentProps) {
  const { openProject } = useAppNavigation();
  const updateTask = useAppStore((s) => s.updateTask);
  const moveTask = useAppStore((s) => s.moveTask);
  const update = (patch: Partial<Task>, log?: string) => updateTask(project.id, task.id, patch, log);

  const isDone = task.status === 'done';
  const isOverdue = !!task.due && daysFromToday(task.due) < 0 && !isDone;
  const log = task.log ?? [];

  return (
    <Drawer
      label={`Task: ${task.title}`}
      onClose={onClose}
      header={
        <button
          type="button"
          onClick={() => openProject(project.id)}
          className="flex items-center gap-1.5 text-[13px] text-muted hover:text-ink"
        >
          <FolderKanban size={16} />
          {project.client}
        </button>
      }
      footer={
        <>
          <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => deleteTask(project.id, task.id)}>
            Delete
          </Button>
          {isDone ? (
            <Button onClick={() => reopenTask(project.id, task.id)}>Mark incomplete</Button>
          ) : (
            <Button
              variant="primary"
              icon={<Check size={16} strokeWidth={2.25} />}
              onClick={() => completeTask(project.id, task.id)}
            >
              Mark complete
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <input
          aria-label="Task title"
          value={task.title}
          onChange={(e) => update({ title: e.target.value })}
          className="border-b border-transparent py-0.5 text-[22px] font-semibold tracking-[-0.01em] outline-none focus:border-line"
        />
        <div className="flex gap-1.5">
          <TaskStatusBadge status={task.status} />
          <PriorityBadge priority={task.pri} long size="md" />
        </div>
      </div>

      <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-4 gap-y-3">
        <FieldLabel>Status</FieldLabel>
        <Segmented
          label="Status"
          options={STATUS_OPTIONS}
          value={task.status}
          onChange={(status) =>
            status === 'done' ? completeTask(project.id, task.id) : moveTask(project.id, task.id, status)
          }
        />

        <FieldLabel>Priority</FieldLabel>
        <Segmented label="Priority" options={PRIORITY_OPTIONS} value={task.pri} onChange={(pri) => update({ pri })} />

        <FieldLabel>Project</FieldLabel>
        <button
          type="button"
          onClick={() => openProject(project.id)}
          className="w-fit text-left text-sm font-medium hover:text-brand"
        >
          {project.name}
        </button>

        <FieldLabel>Assignee</FieldLabel>
        <Select
          aria-label="Assignee"
          variant="field"
          className="h-9 text-sm"
          options={PEOPLE_OPTIONS}
          value={task.who}
          onChange={(value) => {
            const who = value as PersonId;
            update({ who }, `${CURRENT_USER.firstName} assigned "${task.title}" to ${firstName(who)}`);
          }}
        />

        <FieldLabel>Due date</FieldLabel>
        <div className="flex items-center gap-2.5">
          <input
            type="date"
            aria-label="Due date"
            value={task.due}
            onChange={(e) => update({ due: e.target.value })}
            className="h-9 flex-1 rounded-control border border-line px-3 text-sm outline-none focus:border-brand"
          />
          <span className={cn('whitespace-nowrap text-[13px]', isOverdue ? 'text-danger' : 'text-faint')}>
            {formatRelative(task.due)}
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Description</h3>
        <TextArea
          aria-label="Description"
          value={task.desc}
          onChange={(e) => update({ desc: e.target.value })}
          placeholder="Add details or acceptance criteria"
          className="leading-[1.55]"
        />
      </section>

      <SubtaskList projectId={project.id} taskId={task.id} subtasks={task.subtasks ?? []} />

      {log.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold">Activity</h3>
          <ActivityFeed
            compact
            items={log.map((entry, i) => ({ key: `${i}-${entry.text}`, text: entry.text, meta: formatLogTime(entry) }))}
          />
        </section>
      )}
    </Drawer>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-[13px] text-muted">{children}</span>;
}
