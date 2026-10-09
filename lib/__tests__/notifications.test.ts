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
// 2026-10-09 23:00 America/New_York as an absolute instant; Mecca's Oct 9 prayers are all past by then.
const NOW = new Date('2026-10-10T03:00:00Z');

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

  it('plans only future prayers across the next 12 days, sorted, daily first', () => {
    const out = planNotifications({ now: NOW, reminders: { daily: true, dailyTime: '20:00', prayers: true }, timesFor, text });
    const prayers = out.filter((n) => n.kind === 'prayer');
    expect(out[0].kind).toBe('daily');
    expect(prayers.length).toBeGreaterThan(0);
    expect(prayers.length).toBeLessThanOrEqual(60);
    expect(out.length).toBeLessThanOrEqual(60);
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

  it('plans every remaining prayer of today when now is early', () => {
    const early = new Date('2026-10-09T04:00:00Z'); // 00:00 local on Oct 9
    const out = planNotifications({ now: early, reminders: { ...off, prayers: true }, timesFor, text });
    expect(out).toHaveLength(EARLY_COUNT);
    expect(out[0].id).toBe('prayer-2026-10-09-dhuhr');
  });

  it('falls back to 20:00 for an invalid daily time', () => {
    for (const bad of ['', 'nope', '25:00', '12:75']) {
      const out = planNotifications({ now: NOW, reminders: { ...off, daily: true, dailyTime: bad }, timesFor: null, text });
      expect(out[0]).toMatchObject({ hour: 20, minute: 0 });
    }
  });

  it('skips prayers when timesFor throws', () => {
    const boom = () => { throw new Error('x'); };
    const out = planNotifications({ now: NOW, reminders: { daily: true, dailyTime: '20:00', prayers: true }, timesFor: boom, text });
    expect(out.map((n) => n.kind)).toEqual(['daily']);
  });

  it('caps the total at 60, keeping the daily reminder first', () => {
    const farTimes = (d: Date) => {
      const at = (h: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, h);
      return { fajr: at(1), sunrise: at(2), dhuhr: at(3), asr: at(4), maghrib: at(5), isha: at(6), estimated: false };
    };
    const out = planNotifications({ now: NOW, reminders: { daily: true, dailyTime: '20:00', prayers: true }, timesFor: farTimes, text });
    expect(out).toHaveLength(60);
    expect(out[0].kind).toBe('daily');
    expect(out.filter((n) => n.kind === 'prayer')).toHaveLength(59);
  });
});
// 12-day window Oct 9-20: Oct 9 has 0 left; Oct 10 has 4 (its Fajr is 21:58 on Oct 9 local, past); Oct 11-20: 5 each.
const EXPECTED_COUNT = 4 + 10 * 5;
const EXPECTED_FIRST = 'prayer-2026-10-10-dhuhr';
// From 00:00 Oct 9: Oct 9 has 4 left (Fajr was 21:58 Oct 8 local); Oct 10-20: 5 each.
const EARLY_COUNT = 4 + 11 * 5;
