import type { DateKey } from './day';
import type { DateLog, PersistedState } from './model';

type Dates = Record<DateKey, DateLog>;
const NO_TASBIH: Record<string, number> = Object.freeze({}) as Record<string, number>;

/**
 * The per-date logs without tasbih counts. Returns `prev` unchanged when nothing but tasbih
 * counts differ, so a selector built on it keeps a stable result while someone taps the tasbih.
 */
export function stripTasbih(dates: Dates, prev: Dates | null): Dates {
  const keys = Object.keys(dates);
  if (prev && keys.length === Object.keys(prev).length) {
    const same = keys.every((k) => {
      const a = dates[k];
      const b = prev[k];
      return b !== undefined && a.active === b.active && a.prayers === b.prayers;
    });
    if (same) return prev;
  }
  const out: Dates = {};
  for (const k of keys) out[k] = { active: dates[k].active, prayers: dates[k].prayers, tasbih: NO_TASBIH };
  return out;
}

const OTHER_SLICES: (keyof PersistedState)[] = ['schema', 'profile', 'settings', 'cycle', 'planStartDate', 'planDays', 'milestones'];

/** True when the only difference between two states is tasbih counts (no day newly active, no new date). */
export function isTasbihOnlyChange(prev: PersistedState, next: PersistedState): boolean {
  if (OTHER_SLICES.some((k) => prev[k] !== next[k])) return false;
  if (prev.dates === next.dates) return true;
  const keys = Object.keys(next.dates);
  if (keys.length !== Object.keys(prev.dates).length) return false;
  return keys.every((k) => {
    const a = prev.dates[k];
    const b = next.dates[k];
    return a !== undefined && (a === b || (a.active === b.active && a.prayers === b.prayers));
  });
}
