import type { DateKey } from './day';

const pad = (n: number) => String(n).padStart(2, '0');

/** Local noon of a date key: a stable instant for that calendar day (safe across DST and Hijri conversion). */
export function dateFromKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12);
}

function format(key: DateKey, lang: string, options: Intl.DateTimeFormatOptions): string {
  const date = dateFromKey(key);
  if (!Number.isFinite(date.getTime())) return key;
  try {
    return new Intl.DateTimeFormat(lang, options).format(date);
  } catch {
    return key;
  }
}

/** "Oct 9" style, in the given language; the raw key if formatting fails. */
export function formatShortDate(key: DateKey, lang: string): string {
  return format(key, lang, { day: 'numeric', month: 'short' });
}

/** "October 9, 2026" style, in the given language; the raw key if formatting fails. */
export function formatLongDate(key: DateKey, lang: string): string {
  return format(key, lang, { day: 'numeric', month: 'long', year: 'numeric' });
}

/** "Friday, 9 October" style, in the given language; a plain date string if formatting fails. */
export function formatWeekdayDate(key: DateKey, lang: string): string {
  const date = dateFromKey(key);
  try {
    return new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  } catch {
    return date.toDateString();
  }
}

/** Hour and minutes in the given language's clock style; "HH:MM" if formatting fails. */
export function formatTime(date: Date, lang: string): string {
  try {
    return new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit' }).format(date);
  } catch {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
