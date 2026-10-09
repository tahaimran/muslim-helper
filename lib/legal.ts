export const LEGAL_UPDATED = '2026-10-09';

/** Formats a YYYY-MM-DD date in the given language, falling back to the raw key. */
export function formatLegalDate(key: string, lang: string): string {
  try {
    const [y, m, d] = key.split('-').map(Number);
    const date = new Date(y, m - 1, d, 12);
    if (!Number.isFinite(date.getTime())) return key;
    return new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(date);
  } catch {
    return key;
  }
}
