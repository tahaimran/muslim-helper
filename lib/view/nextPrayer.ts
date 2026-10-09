/** Whole hours and minutes from `now` until `time`, rounding a partial minute up; never negative. */
export function timeUntil(now: Date, time: Date): { h: number; m: number } {
  const mins = Math.max(0, Math.ceil((time.getTime() - now.getTime()) / 60_000));
  return { h: Math.floor(mins / 60), m: mins % 60 };
}
