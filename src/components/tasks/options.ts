import type { SegmentOption } from '@/components/ui/Segmented';
import type { SelectOption } from '@/components/ui/Select';
import { PEOPLE, PERSON_IDS, PRIORITIES, TASK_STATUSES, TASK_STATUS_LABEL } from '@/lib/constants';
import type { Priority, TaskStatus } from '@/lib/types';

export const PEOPLE_OPTIONS: SelectOption[] = PERSON_IDS.map((id) => ({ value: id, label: PEOPLE[id] }));

const STATUS_ACTIVE_CLASS: Record<TaskStatus, string> = {
  todo: 'bg-neutral text-muted',
  progress: 'bg-brand-light text-brand-dark',
  done: 'bg-success-light text-success',
};

export const STATUS_OPTIONS: SegmentOption<TaskStatus>[] = TASK_STATUSES.map((status) => ({
  value: status,
  label: TASK_STATUS_LABEL[status],
  activeClassName: STATUS_ACTIVE_CLASS[status],
}));

export const PRIORITY_OPTIONS: SegmentOption<Priority>[] = PRIORITIES.map((p) => ({ value: p, label: p }));
