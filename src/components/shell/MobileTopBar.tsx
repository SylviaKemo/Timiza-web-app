'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { CURRENT_USER } from '@/lib/constants';
import { sectionTitle } from './navigation';

/** Sticky 56px ink bar shown below 900px: menu button, logo, current section and avatar. */
export function MobileTopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 flex h-14 items-center gap-1.5 border-b border-sidebar-line bg-sidebar pr-2 pl-1 text-white">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="flex size-11 items-center justify-center rounded-control"
      >
        <Menu size={20} />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Logo size="sm" />
        <span className="truncate text-sm text-sidebar-faint">· {sectionTitle(pathname)}</span>
      </div>
      <span className="mr-1.5 flex size-8 items-center justify-center rounded-full bg-brand text-[13px] font-semibold">
        {CURRENT_USER.name[0]}
      </span>
    </div>
  );
}
