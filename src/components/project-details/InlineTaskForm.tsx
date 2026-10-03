'use client';

import { useState } from 'react';

interface InlineTaskFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

/** Quick-add card at the top of a board column. Enter adds (and stays open), Esc cancels. */
export function InlineTaskForm({ onSubmit, onCancel }: InlineTaskFormProps) {
  const [title, setTitle] = useState('');

  const submit = () => {
    if (!title.trim()) {
      onCancel();
      return;
    }
    onSubmit(title.trim());
    setTitle('');
  };

  return (
    <div className="flex flex-col gap-2 rounded-tile border border-brand bg-surface p-2.5 shadow-[0_0_0_3px_var(--color-brand-light)]">
      <input
        autoFocus
        aria-label="Task title"
        value={title}
        placeholder="Task title"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') {
            e.stopPropagation();
            onCancel();
          }
        }}
        className="p-0.5 text-sm font-medium outline-none"
      />
      <div className="flex justify-end gap-1.5">
        <button type="button" onClick={onCancel} className="h-7 rounded-[7px] px-2.5 text-xs font-medium text-muted">
          Cancel
        </button>
        <button type="button" onClick={submit} className="h-7 rounded-[7px] bg-ink px-2.5 text-xs font-medium text-white">
          Add task
        </button>
      </div>
    </div>
  );
}
