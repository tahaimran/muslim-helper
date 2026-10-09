export type DateKey = string;

export const PLAN_LENGTH = 30;
export type Phase = 'journey' | 'istiqamah';

const DAY_MS = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(d: Date): DateKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function keyToUTC(key: DateKey): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function addDays(key: DateKey, n: number): DateKey {
  const t = new Date(keyToUTC(key) + n * DAY_MS);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

export function daysBetween(from: DateKey, to: DateKey): number {
  return Math.round((keyToUTC(to) - keyToUTC(from)) / DAY_MS);
}

export function getPlanPosition(planStartDate: DateKey, today: DateKey): { day: number; phase: Phase } {
  const elapsed = Math.max(0, daysBetween(planStartDate, today));
  if (elapsed >= PLAN_LENGTH) return { day: PLAN_LENGTH, phase: 'istiqamah' };
  return { day: elapsed + 1, phase: 'journey' };
}

export function getStreak(active: ReadonlySet<DateKey>, today: DateKey): number {
  let cursor = active.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (active.has(cursor)) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export function daysSinceLastActive(active: ReadonlySet<DateKey>, today: DateKey): number | null {
  let latest: DateKey | null = null;
  for (const key of active) {
    if (key <= today && (latest === null || key > latest)) latest = key;
  }
  return latest === null ? null : daysBetween(latest, today);
}

export function shouldWelcomeBack(daysSince: number | null): boolean {
  return daysSince !== null && daysSince >= 3;
}
