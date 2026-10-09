import { getPrayerTimes, getNextPrayer, resolveCalcSettings, PRAYER_ORDER } from '../prayerTimes';

const MECCA = { latitude: 21.4225, longitude: 39.8262 };
const DAY = new Date(2026, 9, 9); // local Y/M/D = 2026-10-09

describe('getPrayerTimes', () => {
  it('computes Umm al-Qura times for Mecca', () => {
    const t = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'shafi');
    expect(t.fajr.toISOString()).toBe('2026-10-09T01:58:00.000Z');
    expect(t.maghrib.toISOString()).toBe('2026-10-09T15:01:00.000Z');
  });
  it('returns times in prayer order', () => {
    const t = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'shafi');
    const times = PRAYER_ORDER.map((p) => t[p].getTime());
    expect([...times].sort((a, b) => a - b)).toEqual(times);
  });
  it('puts Hanafi Asr later than Shafi Asr', () => {
    const shafi = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'shafi');
    const hanafi = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'hanafi');
    expect(hanafi.asr.getTime()).toBeGreaterThan(shafi.asr.getTime());
  });
});

describe('getNextPrayer', () => {
  it('returns the next prayer later today', () => {
    const next = getNextPrayer(new Date('2026-10-09T15:30:00Z'), MECCA, 'UmmAlQura', 'shafi');
    expect(next.name).toBe('isha');
  });
  it("returns tomorrow's fajr after isha", () => {
    const now = new Date('2026-10-09T20:00:00Z'); // 16:00 in New York, still 2026-10-09 locally
    const next = getNextPrayer(now, MECCA, 'UmmAlQura', 'shafi');
    expect(next.name).toBe('fajr');
    expect(next.time.getTime()).toBeGreaterThan(now.getTime());
    expect(next.time.toISOString().startsWith('2026-10-10')).toBe(true);
  });
});

describe('resolveCalcSettings', () => {
  it('picks a regional default method and madhab', () => {
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, 'PK')).toEqual({ method: 'Karachi', madhab: 'hanafi' });
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, 'TR')).toEqual({ method: 'Turkey', madhab: 'hanafi' });
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, 'ID')).toEqual({ method: 'Singapore', madhab: 'shafi' });
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, 'SA')).toEqual({ method: 'UmmAlQura', madhab: 'shafi' });
  });
  it('falls back to Muslim World League / shafi', () => {
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, null)).toEqual({ method: 'MuslimWorldLeague', madhab: 'shafi' });
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, 'ZZ')).toEqual({ method: 'MuslimWorldLeague', madhab: 'shafi' });
  });
  it('respects explicit user choices', () => {
    expect(resolveCalcSettings({ calcMethod: 'Egyptian', madhab: 'hanafi' }, 'SA')).toEqual({ method: 'Egyptian', madhab: 'hanafi' });
  });
});

describe('high latitude hardening', () => {
  const OSLO = { latitude: 59.9139, longitude: 10.7522 };
  const REYKJAVIK = { latitude: 64.1466, longitude: -21.9426 };
  it('produces valid ordered times at high latitudes in summer', () => {
    for (const loc of [OSLO, REYKJAVIK]) {
      const t = getPrayerTimes(new Date(2026, 5, 21), loc, 'MuslimWorldLeague', 'shafi');
      const seq = [t.fajr, t.sunrise, t.dhuhr, t.asr, t.maghrib, t.isha].map((d) => d.getTime());
      seq.forEach((ms) => expect(Number.isFinite(ms)).toBe(true));
      expect([...seq].sort((a, b) => a - b)).toEqual(seq);
    }
  });
  it('getNextPrayer never returns an invalid date', () => {
    const next = getNextPrayer(new Date(2026, 5, 21, 23, 30), REYKJAVIK, 'MuslimWorldLeague', 'shafi');
    expect(Number.isFinite(next.time.getTime())).toBe(true);
  });
});

describe('invalid-time guard', () => {
  it('skips NaN prayer times when finding the next prayer (Tromso midsummer)', () => {
    const TROMSO = { latitude: 69.6492, longitude: 18.9553 };
    const next = getNextPrayer(new Date(2026, 5, 21, 23, 30), TROMSO, 'MuslimWorldLeague', 'shafi');
    expect(Number.isFinite(next.time.getTime())).toBe(true);
  });
});

describe('nearest-latitude fallback for polar days', () => {
  const TROMSO = { latitude: 69.6492, longitude: 18.9553 };
  const OSLO = { latitude: 59.9139, longitude: 10.7522 };
  const seqOf = (t: ReturnType<typeof getPrayerTimes>) =>
    [t.fajr, t.sunrise, t.dhuhr, t.asr, t.maghrib, t.isha].map((d) => d.getTime());
  it.each([
    ['June', new Date(2026, 5, 21)],
    ['December', new Date(2026, 11, 21)],
  ])('Tromso %s: all six finite, ordered, estimated', (_label, date) => {
    const t = getPrayerTimes(date, TROMSO, 'MuslimWorldLeague', 'shafi');
    const seq = seqOf(t);
    seq.forEach((ms) => expect(Number.isFinite(ms)).toBe(true));
    expect([...seq].sort((a, b) => a - b)).toEqual(seq);
    expect(t.estimated).toBe(true);
  });
  it('Mecca is not estimated', () => {
    expect(getPrayerTimes(new Date(2026, 9, 9), MECCA_COORDS, 'UmmAlQura', 'shafi').estimated).toBe(false);
  });
  it('Oslo in June yields finite times', () => {
    const t = getPrayerTimes(new Date(2026, 5, 21), OSLO, 'MuslimWorldLeague', 'shafi');
    seqOf(t).forEach((ms) => expect(Number.isFinite(ms)).toBe(true));
  });
});
const MECCA_COORDS = { latitude: 21.4225, longitude: 39.8262 };
