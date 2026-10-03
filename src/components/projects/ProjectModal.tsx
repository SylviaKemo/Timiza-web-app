'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Field, FieldError, TextArea, TextInput } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { CURRENT_USER, TODAY } from '@/lib/constants';
import { addDays } from '@/lib/dates';
import type { Client, Project } from '@/lib/types';
import { useAppStore, type ProjectInput } from '@/store/useAppStore';
import { useUiStore, type ProjectModalState } from '@/store/useUiStore';
import { TeamPicker } from './TeamPicker';

/** Create / Edit project modal. Mounted while `projectModal` is set in the UI store. */
export function ProjectModal() {
  const modal = useUiStore((s) => s.projectModal);
  const projects = useAppStore((s) => s.data.projects);
  const clients = useAppStore((s) => s.data.clients);
  if (!modal) return null;

  const editing = modal.mode === 'edit' ? projects.find((p) => p.id === modal.projectId) : undefined;
  if (modal.mode === 'edit' && !editing) return null;

  return <ProjectForm initial={initialValues(modal, editing, clients)} editing={editing} clients={clients} />;
}

function initialValues(modal: ProjectModalState, project: Project | undefined, clients: Client[]): ProjectInput {
  if (project) {
    const { name, client, start, due, team, desc } = project;
    return { name, client, start, due, team: [...team], desc };
  }
  const presetClient = modal.mode === 'create' ? modal.presetClient : undefined;
  return {
    name: '',
    client: presetClient ?? clients[0]?.name ?? '',
    start: TODAY,
    due: addDays(TODAY, 21),
    team: [CURRENT_USER.id],
    desc: '',
  };
}

interface FormErrors {
  name?: string;
  due?: string;
}

function validate(values: ProjectInput): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Project name is required.';
  if (!values.due) errors.due = 'Due date is required.';
  else if (values.start && values.due < values.start) errors.due = 'Due date must be after the start date.';
  return errors;
}

interface ProjectFormProps {
  initial: ProjectInput;
  editing?: Project;
  clients: Client[];
}

function ProjectForm({ initial, editing, clients }: ProjectFormProps) {
  const router = useRouter();
  const { createProject, updateProjectDetails } = useAppStore.getState();
  const { closeProjectModal, showToast, highlightProject, resetProjectFilters } = useUiStore.getState();

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Changing the start date can fix a due-date error too.
    setErrors((e) => ({ ...e, [key]: undefined, ...(key === 'start' ? { due: undefined } : {}) }));
  };

  const submit = () => {
    const nextErrors = validate(values);
    if (nextErrors.name || nextErrors.due) {
      setErrors(nextErrors);
      return;
    }

    if (editing) {
      updateProjectDetails(editing.id, values);
      closeProjectModal();
      showToast('Project updated');
      return;
    }

    const project = createProject(values);
    closeProjectModal();
    resetProjectFilters();
    highlightProject(project.id);
    showToast(`"${project.name}" created`);
    router.push('/projects');
  };

  return (
    <Modal
      title={editing ? 'Edit project' : 'Create new project'}
      width={540}
      onClose={closeProjectModal}
      footer={
        <>
          <Button onClick={closeProjectModal}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            {editing ? 'Save changes' : 'Create project'}
          </Button>
        </>
      }
    >
      <Field label="Project name" error={errors.name}>
        <TextInput
          autoFocus
          value={values.name}
          invalid={!!errors.name}
          placeholder="e.g. Website Redesign"
          onChange={(e) => setField('name', e.target.value)}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Client</span>
        <Dropdown
          variant="field"
          aria-label="Client"
          options={clients.map((c) => ({ value: c.name, label: c.name, sub: c.contact }))}
          value={values.client}
          onChange={(client) => setField('client', client)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start date">
            <TextInput type="date" value={values.start} onChange={(e) => setField('start', e.target.value)} />
          </Field>
          <Field label="Due date">
            <TextInput
              type="date"
              value={values.due}
              invalid={!!errors.due}
              onChange={(e) => setField('due', e.target.value)}
            />
          </Field>
        </div>
        {errors.due && <FieldError>{errors.due}</FieldError>}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium">Team members</span>
        <TeamPicker value={values.team} onChange={(team) => setField('team', team)} />
      </div>

      <Field label="Description">
        <TextArea
          value={values.desc}
          placeholder="What is this project about?"
          onChange={(e) => setField('desc', e.target.value)}
        />
      </Field>
    </Modal>
  );
}
