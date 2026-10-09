import { planNotifications } from '../notifications';
import { getPrayerTimes } from '../prayerTimes';
import { DEFAULT_SETTINGS } from '../model';

const MECCA = { latitude: 21.4225, longitude: 39.8262 };
const timesFor = (d: Date) => getPrayerTimes(d, MECCA, 'UmmAlQura', 'shafi');
const text = {
  dailyTitle: 'Daily',
  dailyBody: 'Body',
  prayerTitle: (p: string) => `T-${p}`,
  prayerBody: (p: string) => `B-${p}`,
};
const off = DEFAULT_SETTINGS.reminders;
// 2026-10-09 23:00 local (America/New_York): Mecca's Oct 9 prayers are all in the past by then.
const NOW = new Date(2026, 9, 9, 23, 0);

describe('planNotifications', () => {
  it('returns nothing when nothing is enabled', () => {
    expect(planNotifications({ now: NOW, reminders: off, timesFor, text })).toEqual([]);
  });

  it('plans a single daily notification with the parsed time', () => {
    const out = planNotifications({ now: NOW, reminders: { ...off, daily: true, dailyTime: '07:05' }, timesFor, text });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ kind: 'daily', hour: 7, minute: 5, title: 'Daily', body: 'Body' });
  });

  it('ignores prayer alerts without a location', () => {
    const out = planNotifications({ now: NOW, reminders: { ...off, daily: true, prayers: true }, timesFor: null, text });
    expect(out.map((n) => n.kind)).toEqual(['daily']);
  });

  it('plans only future prayers across the next 7 days, sorted, daily first', () => {
    const out = planNotifications({ now: NOW, reminders: { daily: true, dailyTime: '20:00', prayers: true }, timesFor, text });
    const prayers = out.filter((n) => n.kind === 'prayer');
    expect(out[0].kind).toBe('daily');
    expect(prayers.length).toBeGreaterThan(0);
    expect(prayers.length).toBeLessThanOrEqual(35);
    expect(out.length).toBeLessThanOrEqual(36);
    prayers.forEach((n) => expect(n.at!.getTime()).toBeGreaterThan(NOW.getTime()));
    const times = prayers.map((n) => n.at!.getTime());
    expect([...times].sort((a, b) => a - b)).toEqual(times);
    expect(prayers[0].id).toMatch(/^prayer-\d{4}-\d{2}-\d{2}-(fajr|dhuhr|asr|maghrib|isha)$/);
    expect(new Set(prayers.map((n) => n.id)).size).toBe(prayers.length);
  });

  it('has exact counts for the Mecca fixture', () => {
    const out = planNotifications({ now: NOW, reminders: { ...off, prayers: true }, timesFor, text });
    expect(out).toHaveLength(EXPECTED_COUNT);
    expect(out[0].id).toBe(EXPECTED_FIRST);
    expect(out[0].title).toBe(`T-${EXPECTED_FIRST.split('-').pop()}`);
  });

  it('plans all 35 when now is before the first prayer of today', () => {
    const early = new Date(2026, 9, 9, 0, 0);
    const out = planNotifications({ now: early, reminders: { ...off, prayers: true }, timesFor, text });
    expect(out.length).toBeGreaterThanOrEqual(34);
    expect(out.length).toBeLessThanOrEqual(35);
  });
});
// Oct 9: 0 left; Oct 10: 4 (its Fajr is 21:58 on Oct 9 local, already past); Oct 11-15: 5 each.
const EXPECTED_COUNT = 4 + 5 * 5;
const EXPECTED_FIRST = 'prayer-2026-10-10-dhuhr';
