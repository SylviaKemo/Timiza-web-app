'use client';

import type { ReactNode } from 'react';
import { LucideProvider } from 'lucide-react';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useStoreHydration } from '@/store/useStoreHydration';
import { useUiStore } from '@/store/useUiStore';
import { GlobalOverlays } from './GlobalOverlays';
import { MobileTopBar } from './MobileTopBar';
import { Sidebar } from './Sidebar';

/** Sidebar + main column. Renders nothing until saved data has loaded from localStorage. */
export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useStoreHydration();
  const { isMobile } = useBreakpoints();
  const navOpen = useUiStore((s) => s.mobileNavOpen);
  const setNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const closeAllOverlays = useUiStore((s) => s.closeAllOverlays);

  useEscapeKey(closeAllOverlays);

  if (!hydrated) return <div className="min-h-dvh bg-canvas" />;

  return (
    <LucideProvider size={16} strokeWidth={1.75}>
      <div className="flex min-h-dvh bg-canvas">
        {isMobile && navOpen && (
          <div className="fixed inset-0 z-44 bg-[rgba(28,28,28,0.28)]" onClick={() => setNavOpen(false)} />
        )}
        <Sidebar isMobile={isMobile} open={navOpen} onClose={() => setNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          {isMobile && <MobileTopBar onOpenMenu={() => setNavOpen(true)} />}
          <main className="min-w-0 flex-1 px-4 pt-6 pb-14 desktop:px-12 desktop:pt-10 desktop:pb-[72px]">
            <div className="mx-auto max-w-[1160px]">{children}</div>
          </main>
        </div>

        <GlobalOverlays />
      </div>
    </LucideProvider>
  );
}
