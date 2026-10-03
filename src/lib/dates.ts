import { TODAY } from './constants';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DAY_MS = 86_400_000;

/** Parses an ISO date (yyyy-mm-dd) as UTC midnight. */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(iso: string, days: number): string {
  const date = parseDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function diffDays(from: string, to: string): number {
  return Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / DAY_MS);
}

export const daysFromToday = (iso: string) => diffDays(TODAY, iso);

/** "Oct 12" */
export function formatShort(iso: string): string {
  if (!iso) return 'No date';
  const d = parseDate(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** "Saturday, October 3" */
export function formatLong(iso: string): string {
  const d = parseDate(iso);
  return `${WEEKDAYS_LONG[d.getUTCDay()]}, ${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** "Today", "Tomorrow", "Mon, Oct 5", or "Sep 28" for past dates. */
export function formatWhen(iso: string): string {
  if (!iso) return 'No date';
  const n = daysFromToday(iso);
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  if (n < 0) return formatShort(iso);
  return `${WEEKDAYS[parseDate(iso).getUTCDay()]}, ${formatShort(iso)}`;
}

/** "Today", "In 3 days", "2d overdue" — used next to date inputs. */
export function formatRelative(iso: string): string {
  if (!iso) return '';
  const n = daysFromToday(iso);
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  if (n < 0) return `${-n}d overdue`;
  return `In ${n} days`;
}

/** "2026-03" → "Mar 2026" */
export function formatMonthYear(yearMonth: string): string {
  const [y, m] = yearMonth.split('-');
  if (!y || !m) return '—';
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** "Just now", "5m ago", "3h ago", "2d ago" */
export function timeAgo(ts: number): string {
  const minutes = Math.round((Date.now() - ts) / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/** "Today", "Yesterday" or "Oct 1" for an epoch timestamp. */
export function formatDayLabel(ts: number): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(ts);
  day.setHours(0, 0, 0, 0);
  const n = Math.round((today.getTime() - day.getTime()) / DAY_MS);
  if (n <= 0) return 'Today';
  if (n === 1) return 'Yesterday';
  return `${MONTHS[day.getMonth()]} ${day.getDate()}`;
}

/** Label for a log entry: relative time for live events, the seed label otherwise. */
export const formatLogTime = (entry: { ts?: number; at?: string }) =>
  entry.ts ? timeAgo(entry.ts) : (entry.at ?? '');
