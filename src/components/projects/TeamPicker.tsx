import { Plus, X } from 'lucide-react';
import { PEOPLE, PERSON_IDS } from '@/lib/constants';
import type { PersonId } from '@/lib/types';

interface TeamPickerProps {
  value: PersonId[];
  onChange: (team: PersonId[]) => void;
}

/** Removable member chips plus a dashed "+ Add" picker. The first member is the project lead. */
export function TeamPicker({ value, onChange }: TeamPickerProps) {
  const available = PERSON_IDS.filter((id) => !value.includes(id));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {value.map((id) => (
        <span key={id} className="inline-flex h-[30px] items-center gap-1 rounded-full bg-subtle pr-1 pl-3 text-[13px] font-medium">
          {PEOPLE[id]}
          <button
            type="button"
            aria-label={`Remove ${PEOPLE[id]}`}
            onClick={() => onChange(value.filter((member) => member !== id))}
            className="flex size-[22px] items-center justify-center rounded-full text-muted hover:bg-line"
          >
            <X size={13} strokeWidth={2} />
          </button>
        </span>
      ))}

      {available.length > 0 && (
        <div className="relative">
          <select
            aria-label="Add team member"
            value=""
            onChange={(e) => e.target.value && onChange([...value, e.target.value as PersonId])}
            className="h-[30px] appearance-none rounded-full border border-dashed border-line-strong bg-surface pr-3 pl-7 text-[13px] font-medium text-muted outline-none"
          >
            <option value="">Add</option>
            {available.map((id) => (
              <option key={id} value={id}>
                {PEOPLE[id]}
              </option>
            ))}
          </select>
          <Plus size={13} strokeWidth={2} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted" />
        </div>
      )}
    </div>
  );
}
