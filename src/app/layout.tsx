import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AppShell } from '@/components/shell/AppShell';
import './globals.css';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: { default: 'Timiza', template: '%s · Timiza' },
  description: 'Project management for small agencies.',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="font-sans">
        <AppShell>{children}</AppShell>
        {/* Vercel Web Analytics and Speed Insights; both are no-ops outside Vercel deployments. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
