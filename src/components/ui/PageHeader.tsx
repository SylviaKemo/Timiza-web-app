import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

/** h1 + subtitle on the left, actions on the right; wraps on narrow screens. */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-6">
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.02em]">{title}</h1>
        {subtitle && <div className="mt-1.5 text-sm text-muted">{subtitle}</div>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

interface SectionHeaderProps {
  title: string;
  /** Right-aligned muted text or a link. */
  aside?: ReactNode;
}

export function SectionHeader({ title, aside }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {typeof aside === 'string' ? <span className="text-[13px] text-faint">{aside}</span> : aside}
    </div>
  );
}

interface ArrowLinkProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}

const ARROW_LINK_CLASS =
  'flex w-fit items-center gap-1 text-[13px] font-medium text-brand hover:text-brand-dark';

/** Orange tertiary link with a trailing arrow — "View all →". */
export function ArrowLink({ href, onClick, children }: ArrowLinkProps) {
  const content = (
    <>
      {children}
      <ArrowRight size={14} strokeWidth={2} />
    </>
  );
  if (href) {
    return (
      <Link href={href} className={ARROW_LINK_CLASS}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={ARROW_LINK_CLASS}>
      {content}
    </button>
  );
}

/** "← Projects" link above detail pages. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="flex w-fit items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink">
      <ArrowLeft size={16} />
      {children}
    </Link>
  );
}
