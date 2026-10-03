'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Field, FieldError, TextInput } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { CURRENT_USER, PRIORITIES, TODAY, firstName } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { getActiveProjects } from '@/lib/derive';
import type { PersonId, Priority } from '@/lib/types';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import { PEOPLE_OPTIONS } from './options';

/** "Create task" modal. Mounted while `taskModal` is set in the UI store. */
export function TaskModal() {
  const modal = useUiStore((s) => s.taskModal);
  if (!modal) return null;
  return <TaskModalForm initialProjectId={modal.projectId ?? ''} />;
}

interface FormErrors {
  title?: boolean;
  projectId?: boolean;
}

function TaskModalForm({ initialProjectId }: { initialProjectId: string }) {
  const projects = useAppStore((s) => s.data.projects);
  const addTask = useAppStore((s) => s.addTask);
  const { closeTaskModal, showToast } = useUiStore.getState();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(initialProjectId);
  const [who, setWho] = useState<PersonId>(CURRENT_USER.id);
  const [due, setDue] = useState(TODAY);
  const [priority, setPriority] = useState<Priority>('Medium');
  const [errors, setErrors] = useState<FormErrors>({});

  const projectOptions = useMemo(
    () => getActiveProjects(projects).map((p) => ({ value: p.id, label: p.name, sub: p.client })),
    [projects],
  );
  const selectedProject = projects.find((p) => p.id === projectId);

  const submit = () => {
    const nextErrors: FormErrors = { title: !title.trim(), projectId: !selectedProject };
    if (nextErrors.title || nextErrors.projectId) {
      setErrors(nextErrors);
      return;
    }
    addTask(projectId, { title, who, due, pri: priority });
    closeTaskModal();
    const forWhom = who === CURRENT_USER.id ? '' : ` for ${firstName(who)}`;
    showToast(`Task added to ${selectedProject!.name}${forWhom}`);
  };

  return (
    <Modal
      title="Create task"
      onClose={closeTaskModal}
      footer={
        <>
          <Button onClick={closeTaskModal}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            Create task
          </Button>
        </>
      }
    >
      <Field label="Task name" error={errors.title ? 'Task name is required.' : null}>
        <TextInput
          autoFocus
          value={title}
          invalid={errors.title}
          placeholder="e.g. Finalize homepage design"
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors((err) => ({ ...err, title: false }));
          }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Project</span>
        <Dropdown
          variant="field"
          aria-label="Project"
          options={projectOptions}
          value={projectId}
          placeholder="Select project"
          invalid={errors.projectId}
          onChange={(value) => {
            setProjectId(value);
            setErrors((err) => ({ ...err, projectId: false }));
          }}
        />
        {errors.projectId && <FieldError>Choose a project for this task.</FieldError>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Assignee">
          <Select variant="field" options={PEOPLE_OPTIONS} value={who} onChange={(v) => setWho(v as PersonId)} />
        </Field>
        <Field label="Due date">
          <TextInput type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </Field>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Priority</span>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={priority === p}
              onClick={() => setPriority(p)}
              className={cn(
                'h-[38px] rounded-control border text-sm font-medium',
                priority === p ? 'border-brand-border bg-brand-light text-brand-dark' : 'border-line bg-surface text-muted',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
