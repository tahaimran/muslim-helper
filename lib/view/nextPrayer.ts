/** Whole hours and minutes from `now` until `time`, rounding a partial minute up; never negative. */
export function timeUntil(now: Date, time: Date): { h: number; m: number } {
  const mins = Math.max(0, Math.ceil((time.getTime() - now.getTime()) / 60_000));
  return { h: Math.floor(mins / 60), m: mins % 60 };
}

export type CountdownKey = 'today.nextIn' | 'today.nextInHours' | 'today.nextInMin' | 'today.nextPrayer';

/** Which next-prayer line to show, so whole hours read "in 2 h" rather than "in 2 h 0 min". */
export function countdownLine(now: Date, time: Date): { key: CountdownKey; h: number; m: number } {
  const { h, m } = timeUntil(now, time);
  if (h > 0) return { key: m > 0 ? 'today.nextIn' : 'today.nextInHours', h, m };
  if (m > 0) return { key: 'today.nextInMin', h, m };
  return { key: 'today.nextPrayer', h, m };
}
