import { ListCard } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import type { TaskGroup } from '@/lib/derive';
import { TaskRow } from './TaskRow';

/** Date-grouped task lists: OVERDUE → TODAY → TOMORROW → OCT 8 → LATER → NO DATE. */
export function TaskGroupList({ groups }: { groups: TaskGroup[] }) {
  return (
    <div className="flex flex-col gap-7">
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between px-1">
            <h2 className={cn('text-xs font-semibold tracking-[0.06em]', group.isOverdue ? 'text-danger' : 'text-muted')}>
              {group.label.toUpperCase()}
            </h2>
            <span className="text-xs text-faint">
              {group.tasks.length} task{group.tasks.length > 1 ? 's' : ''}
            </span>
          </div>
          <ListCard>
            {group.tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ListCard>
        </section>
      ))}
    </div>
  );
}
