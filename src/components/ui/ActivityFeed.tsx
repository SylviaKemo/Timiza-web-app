import { cn } from '@/lib/cn';

export interface ActivityItem {
  key: string;
  text: string;
  /** Time label, or "{Project} · 2h ago" style sub-line. */
  meta: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  /**
   * `inline` puts the time on the right of each row (project activity),
   * `stacked` puts it under the text (client activity, task drawer).
   */
  layout?: 'inline' | 'stacked';
  compact?: boolean;
}

function Dot({ first, offset = false }: { first: boolean; offset?: boolean }) {
  return <span className={cn('size-[7px] rounded-full', first ? 'bg-brand' : 'bg-line-strong', offset && 'mt-1.5')} />;
}

/** Timeline list. The newest entry gets an orange dot, the rest grey. */
export function ActivityFeed({ items, layout = 'stacked', compact = false }: ActivityFeedProps) {
  if (compact) {
    return (
      <ul className="flex flex-col gap-3.5">
        {items.map((item, i) => (
          <li key={item.key} className="grid grid-cols-[8px_minmax(0,1fr)] gap-3">
            <Dot first={i === 0} offset />
            <div>
              <div className="text-[13px] leading-[1.45]">{item.text}</div>
              <div className="mt-0.5 text-xs text-faint">{item.meta}</div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex max-w-[720px] flex-col">
      {items.map((item, i) =>
        layout === 'inline' ? (
          <li
            key={item.key}
            className="grid grid-cols-[16px_minmax(0,1fr)_auto] items-center gap-3.5 border-b border-line py-3 pl-1"
          >
            <Dot first={i === 0} />
            <div className="text-sm">{item.text}</div>
            <div className="text-xs text-faint">{item.meta}</div>
          </li>
        ) : (
          <li key={item.key} className="grid grid-cols-[12px_minmax(0,1fr)] gap-3.5 border-b border-line py-3">
            <Dot first={i === 0} offset />
            <div>
              <div className="text-sm">{item.text}</div>
              <div className="mt-[3px] text-xs text-faint">{item.meta}</div>
            </div>
          </li>
        ),
      )}
    </ul>
  );
}
