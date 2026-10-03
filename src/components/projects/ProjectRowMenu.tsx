'use client';

import { MenuDivider, MenuItem, RowMenu } from '@/components/ui/Menu';
import type { Project } from '@/lib/types';
import { archiveProject, toggleProjectCompleted } from '@/store/commands';
import { useUiStore } from '@/store/useUiStore';

/** ••• menu on a project row: Edit / Mark complete (or Reopen) / Archive. */
export function ProjectRowMenu({ project }: { project: Project }) {
  const openProjectModal = useUiStore((s) => s.openProjectModal);

  return (
    <RowMenu label={`Actions for ${project.name}`}>
      {(close) => (
        <>
          <MenuItem
            onClick={() => {
              close();
              openProjectModal({ mode: 'edit', projectId: project.id });
            }}
          >
            Edit project
          </MenuItem>
          <MenuItem
            onClick={() => {
              close();
              toggleProjectCompleted(project.id);
            }}
          >
            {project.completed ? 'Reopen project' : 'Mark complete'}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            danger
            onClick={() => {
              close();
              archiveProject(project.id);
            }}
          >
            Archive
          </MenuItem>
        </>
      )}
    </RowMenu>
  );
}
