'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn } from '@/lib/cn';
import type { Subtask } from '@/lib/types';
import { useAppStore } from '@/store/useAppStore';

interface SubtaskListProps {
  projectId: string;
  taskId: string;
  subtasks: Subtask[];
}

export function SubtaskList({ projectId, taskId, subtasks }: SubtaskListProps) {
  const [draft, setDraft] = useState('');
  const { addSubtask, toggleSubtask, removeSubtask } = useAppStore.getState();
  const doneCount = subtasks.filter((s) => s.done).length;

  const submitDraft = () => {
    if (!draft.trim()) return;
    addSubtask(projectId, taskId, draft);
    setDraft('');
  };

  return (
    <section className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">Subtasks</h3>
        {subtasks.length > 0 && (
          <span className="text-xs text-faint">
            {doneCount} of {subtasks.length}
          </span>
        )}
      </div>

      <ul className="flex flex-col">
        {subtasks.map((subtask) => (
          <li key={subtask.id} className="flex min-h-[38px] items-center gap-3 border-b border-divider">
            <Checkbox
              checked={subtask.done}
              label={subtask.done ? 'Mark subtask incomplete' : 'Mark subtask complete'}
              onToggle={() => toggleSubtask(projectId, taskId, subtask.id)}
            />
            <span className={cn('flex-1 text-sm', subtask.done && 'text-faint line-through')}>{subtask.title}</span>
            <button
              type="button"
              aria-label={`Remove ${subtask.title}`}
              onClick={() => removeSubtask(projectId, taskId, subtask.id)}
              className="flex size-[26px] items-center justify-center rounded-badge text-check-off hover:bg-subtle hover:text-muted"
            >
              <X size={13} strokeWidth={2} />
            </button>
          </li>
        ))}
        <li className="flex min-h-[38px] items-center gap-3">
          <span className="flex w-[18px] justify-center text-faint">
            <Plus size={13} strokeWidth={2} />
          </span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitDraft()}
            placeholder="Add subtask and press Enter"
            className="flex-1 py-1.5 text-sm outline-none"
          />
        </li>
      </ul>
    </section>
  );
}
