import { cn } from '@/lib/cn';

export interface TabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Underlined page tabs (Overview · Tasks · Files · Activity). Scrolls sideways on small screens. */
export function Tabs<T extends string>({ items, value, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="flex gap-5 overflow-x-auto border-b border-line scrollbar-none desktop:gap-7">
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.value)}
            className={cn(
              '-mb-px flex shrink-0 gap-1.5 whitespace-nowrap border-b-2 pb-3 text-sm font-medium hover:text-ink',
              selected ? 'border-brand text-ink' : 'border-transparent text-muted',
            )}
          >
            {item.label}
            {item.count !== undefined && <span className="text-faint">{item.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Pill-shaped filter tabs (All 12 · Active 8 · …). The selected pill is ink. */
export function PillTabs<T extends string>({ items, value, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="flex flex-wrap gap-1">
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.value)}
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-item px-3 text-[13px] font-medium hover:opacity-85',
              selected ? 'bg-ink text-white' : 'text-muted',
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className={selected ? 'text-[#a3a3a0]' : 'text-faint'}>{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
