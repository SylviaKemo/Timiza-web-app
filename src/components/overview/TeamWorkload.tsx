import { ProgressBar } from '@/components/ui/ProgressBar';
import { SectionHeader } from '@/components/ui/PageHeader';
import { WORKLOAD_CAPACITY } from '@/lib/constants';
import { cn } from '@/lib/cn';
import type { WorkloadItem } from '@/lib/derive';

/** Open tasks per person against a capacity of 10. */
export function TeamWorkload({ people }: { people: WorkloadItem[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      <SectionHeader title="Team workload" aside="Open tasks" />
      <div className="flex flex-col gap-[18px] pt-1.5">
        {people.map((person) => (
          <div key={person.id} className="flex flex-col gap-2">
            <div className="flex justify-between text-[13px]">
              <span className="font-medium">{person.name}</span>
              <span className={cn(person.overCapacity ? 'text-brand-dark' : 'text-faint')}>
                {person.open} / {WORKLOAD_CAPACITY}
                {person.overCapacity && ' · Over capacity'}
              </span>
            </div>
            <ProgressBar
              value={(person.open / WORKLOAD_CAPACITY) * 100}
              fillClassName={person.overCapacity ? 'bg-brand-dark' : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
