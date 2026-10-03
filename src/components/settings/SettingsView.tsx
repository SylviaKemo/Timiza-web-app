'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { resetDemoData } from '@/store/commands';

export function SettingsView() {
  return (
    <div className="flex max-w-[720px] flex-col gap-7">
      <PageHeader title="Settings" />
      <Card className="flex flex-wrap items-center justify-between gap-6 px-6 py-5">
        <div>
          <div className="text-sm font-medium">Demo data</div>
          <div className="mt-1 text-[13px] text-muted">
            Changes are saved in this browser. Reset to restore the original projects and tasks.
          </div>
        </div>
        <Button className="h-9 text-[13px]" onClick={resetDemoData}>
          Reset demo data
        </Button>
      </Card>
    </div>
  );
}
