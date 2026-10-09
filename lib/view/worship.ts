import type { DayContent, Dhikr } from '../../content/types';

export const BASE_DHIKR_IDS = [
  'subhanallah', 'alhamdulillah', 'allahuakbar', 'astaghfirullah', 'tahlil', 'salawat',
] as const;

export const ROUND_TARGETS = [33, 99, 100] as const;

export interface DhikrOption {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  /** The traditional count for this dhikr (used as the suggested round target). */
  count: number;
}

const toOption = (d: Dhikr): DhikrOption => ({
  id: d.id, arabic: d.arabic, transliteration: d.transliteration, meaning: d.meaning, count: d.count,
});

/**
 * The tasbih selector list: the six base dhikr (resolved from any day's content), then any other
 * dhikr in today's morning and evening lists. De-duplicated by id. A base id missing from content
 * is skipped.
 */
export function buildDhikrOptions(allDays: readonly DayContent[], today: DayContent | null): DhikrOption[] {
  const known = new Map<string, Dhikr>();
  for (const day of allDays) {
    for (const d of [...day.morningDhikr, ...day.eveningDhikr]) if (!known.has(d.id)) known.set(d.id, d);
  }
  const out: DhikrOption[] = [];
  const seen = new Set<string>();
  for (const id of BASE_DHIKR_IDS) {
    const d = known.get(id);
    if (d) {
      out.push(toOption(d));
      seen.add(id);
    }
  }
  if (today) {
    for (const d of [...today.morningDhikr, ...today.eveningDhikr]) {
      if (!seen.has(d.id)) {
        out.push(toOption(d));
        seen.add(d.id);
      }
    }
  }
  return out;
}

/** Fraction of the current round done, 0 to 1. */
export function roundProgress(round: number, target: number): number {
  if (!(target > 0)) return 0;
  return Math.min(Math.max(round / target, 0), 1);
}

/** One tap: the new UI round count, and whether the round just completed (it then resets to 0). */
export function nextRound(round: number, target: number): { round: number; complete: boolean } {
  const next = round + 1;
  if (next >= target) return { round: 0, complete: true };
  return { round: next, complete: false };
}

const valid = (d: Date | undefined | null): d is Date => !!d && !Number.isNaN(d.getTime());

/**
 * Which adhkar section starts expanded: morning before Dhuhr, evening from Asr, nothing between.
 * Uses the clock (before 12:00, from 15:00) when prayer times are unknown or invalid.
 */
export function adhkarExpansion(
  now: Date,
  times: { dhuhr: Date; asr: Date } | null,
): 'morning' | 'evening' | null {
  if (times && valid(times.dhuhr) && valid(times.asr)) {
    if (now.getTime() < times.dhuhr.getTime()) return 'morning';
    if (now.getTime() >= times.asr.getTime()) return 'evening';
    return null;
  }
  const h = now.getHours();
  if (h < 12) return 'morning';
  if (h >= 15) return 'evening';
  return null;
}
