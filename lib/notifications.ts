import { PRAYER_ORDER, type DailyPrayerTimes } from './prayerTimes';
import type { Settings } from './model';
import type { PrayerName } from './types';

export interface PlannedNotification {
  id: string;
  kind: 'daily' | 'prayer';
  at?: Date;
  hour?: number;
  minute?: number;
  title: string;
  body: string;
}

const DAYS_AHEAD = 7;
const MAX_NOTIFICATIONS = 36; // iOS keeps at most 64 pending; stay well under.

const pad = (n: number) => String(n).padStart(2, '0');

function parseTime(hhmm: string): { hour: number; minute: number } {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  const hour = m ? Number(m[1]) : 20;
  const minute = m ? Number(m[2]) : 0;
  return hour < 24 && minute < 60 ? { hour, minute } : { hour: 20, minute: 0 };
}

/** Pure planner: which local notifications should exist right now. */
export function planNotifications(args: {
  now: Date;
  reminders: Settings['reminders'];
  timesFor: ((d: Date) => DailyPrayerTimes) | null;
  text: {
    dailyTitle: string;
    dailyBody: string;
    prayerTitle: (p: PrayerName) => string;
    prayerBody: (p: PrayerName) => string;
  };
}): PlannedNotification[] {
  const { now, reminders, timesFor, text } = args;
  const out: PlannedNotification[] = [];

  if (reminders.daily) {
    const { hour, minute } = parseTime(reminders.dailyTime);
    out.push({ id: 'daily', kind: 'daily', hour, minute, title: text.dailyTitle, body: text.dailyBody });
  }

  if (reminders.prayers && timesFor) {
    const prayers: PlannedNotification[] = [];
    for (let i = 0; i < DAYS_AHEAD; i++) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 12);
      let times: DailyPrayerTimes;
      try {
        times = timesFor(day);
      } catch {
        continue;
      }
      const key = `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
      for (const name of PRAYER_ORDER) {
        const at = times[name];
        if (!Number.isFinite(at.getTime()) || at.getTime() <= now.getTime()) continue;
        prayers.push({
          id: `prayer-${key}-${name}`,
          kind: 'prayer',
          at,
          title: text.prayerTitle(name),
          body: text.prayerBody(name),
        });
      }
    }
    prayers.sort((a, b) => a.at!.getTime() - b.at!.getTime());
    out.push(...prayers);
  }

  return out.slice(0, MAX_NOTIFICATIONS);
}
