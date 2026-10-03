import { twMerge } from 'tailwind-merge';

/**
 * Joins class names, skipping falsy values.
 * Conflicting Tailwind classes are resolved in favour of the last one,
 * so `cn('h-10', 'h-9')` gives `h-9` — this is what makes `className` overrides work.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(' '));
}
