import {
  getPrayerTimes,
  getNextPrayer,
  highLatitudeRuleFor,
  pickNext,
  resolveCalcSettings,
  PRAYER_ORDER,
  type DailyPrayerTimes,
} from '../prayerTimes';

// Shared fixtures
const MECCA = { latitude: 21.4225, longitude: 39.8262 };
const OSLO = { latitude: 59.9139, longitude: 10.7522 };
const REYKJAVIK = { latitude: 64.1466, longitude: -21.9426 };
const TROMSO = { latitude: 69.6492, longitude: 18.9553 };
const PUNTA_ARENAS = { latitude: -53.16, longitude: -70.91 };
const MCMURDO = { latitude: -77.85, longitude: 166.67 };
const DAY = new Date(2026, 9, 9); // local Y/M/D = 2026-10-09

const SIX = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
const sixMs = (t: DailyPrayerTimes) => SIX.map((k) => t[k].getTime());

/** Every value finite and each strictly less than the next. */
function expectStrictlyOrdered(ms: number[]) {
  ms.forEach((v) => expect(Number.isFinite(v)).toBe(true));
  for (let i = 1; i < ms.length; i++) expect(ms[i - 1]).toBeLessThan(ms[i]);
}

describe('getPrayerTimes', () => {
  it('computes Umm al-Qura times for Mecca', () => {
    const t = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'shafi');
    expect(t.fajr.toISOString()).toBe('2026-10-09T01:58:00.000Z');
    expect(t.maghrib.toISOString()).toBe('2026-10-09T15:01:00.000Z');
  });
  it('returns times in prayer order', () => {
    const t = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'shafi');
    expectStrictlyOrdered(PRAYER_ORDER.map((p) => t[p].getTime()));
  });
  it('puts Hanafi Asr later than Shafi Asr', () => {
    const shafi = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'shafi');
    const hanafi = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'hanafi');
    expect(hanafi.asr.getTime()).toBeGreaterThan(shafi.asr.getTime());
  });
  it('Mecca is not estimated', () => {
    expect(getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'shafi').estimated).toBe(false);
  });
});

describe('getNextPrayer', () => {
  it('returns the next prayer later today', () => {
    const next = getNextPrayer(new Date('2026-10-09T15:30:00Z'), MECCA, 'UmmAlQura', 'shafi');
    expect(next?.name).toBe('isha');
  });
  it("returns tomorrow's fajr after isha", () => {
    const now = new Date('2026-10-09T20:00:00Z'); // 16:00 in New York, still 2026-10-09 locally
    const next = getNextPrayer(now, MECCA, 'UmmAlQura', 'shafi');
    expect(next?.name).toBe('fajr');
    expect(next!.time.getTime()).toBeGreaterThan(now.getTime());
    expect(next!.time.toISOString().startsWith('2026-10-10')).toBe(true);
  });
  it('returns a finite, future time at Tromso midsummer late evening', () => {
    const now = new Date(2026, 5, 21, 23, 30);
    const next = getNextPrayer(now, TROMSO, 'MuslimWorldLeague', 'shafi');
    expect(next).not.toBeNull();
    expect(Number.isFinite(next!.time.getTime())).toBe(true);
    expect(next!.time.getTime()).toBeGreaterThan(now.getTime());
  });
});

describe('pickNext (invalid-time guard)', () => {
  const NAN = new Date(NaN);
  const at = (h: number) => new Date(2026, 9, 9, h);
  const atTomorrow = (h: number) => new Date(2026, 9, 10, h);
  const day = (mk: (h: number) => Date): DailyPrayerTimes => ({
    fajr: mk(5), sunrise: mk(6), dhuhr: mk(12), asr: mk(15), maghrib: mk(18), isha: mk(20), estimated: false,
  });

  it('skips NaN times today and picks the next valid one', () => {
    const today = { ...day(at), dhuhr: NAN };
    expect(pickNext(at(13), today, day(atTomorrow))).toEqual({ name: 'asr', time: at(15) });
  });
  it('falls through to tomorrow when no valid time remains today', () => {
    const today = { ...day(at), asr: NAN, maghrib: NAN, isha: NAN };
    const next = pickNext(at(19), today, day(atTomorrow));
    expect(next).toEqual({ name: 'fajr', time: atTomorrow(5) });
  });
  it('skips a NaN tomorrow fajr', () => {
    const tomorrow = { ...day(atTomorrow), fajr: NAN };
    const next = pickNext(at(21), day(at), tomorrow);
    expect(next).toEqual({ name: 'dhuhr', time: atTomorrow(12) });
  });
  it('never returns a tomorrow time that is already in the past', () => {
    const tomorrow = { ...day(atTomorrow), fajr: new Date(2026, 9, 9, 20, 30) }; // before `now`
    expect(pickNext(at(21), day(at), tomorrow)).toEqual({ name: 'dhuhr', time: atTomorrow(12) });
  });
  it('returns null when every candidate is NaN or in the past', () => {
    const allNaN = { fajr: NAN, sunrise: NAN, dhuhr: NAN, asr: NAN, maghrib: NAN, isha: NAN, estimated: false };
    expect(pickNext(at(13), allNaN, allNaN)).toBeNull();
    // Everything today is past or NaN, and tomorrow's only valid times are also before now.
    const pastToday = { ...day(at), dhuhr: NAN, asr: NAN, maghrib: NAN, isha: NAN };
    const pastTomorrow = day(() => new Date(2026, 9, 9, 1));
    expect(pickNext(at(21), pastToday, pastTomorrow)).toBeNull();
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

describe('hemisphere-correct high-latitude rule', () => {
  it('Punta Arenas (-53) gets the same rule as a northern 53 degree city', () => {
    expect(highLatitudeRuleFor(PUNTA_ARENAS.latitude)).toBe(highLatitudeRuleFor(53));
    expect(highLatitudeRuleFor(PUNTA_ARENAS.latitude)).not.toBe('middleofthenight');
  });
  it('Punta Arenas in June has strictly ordered, finite times', () => {
    const t = getPrayerTimes(new Date(2026, 5, 21), PUNTA_ARENAS, 'MuslimWorldLeague', 'shafi');
    expectStrictlyOrdered(sixMs(t));
    expect(t.estimated).toBe(false);
  });
  it('Oslo and Reykjavik in June are finite and strictly ordered', () => {
    for (const loc of [OSLO, REYKJAVIK]) {
      const t = getPrayerTimes(new Date(2026, 5, 21), loc, 'MuslimWorldLeague', 'shafi');
      expectStrictlyOrdered(sixMs(t));
    }
  });
});

describe('nearest-latitude fallback for polar days', () => {
  it.each([
    ['June', new Date(2026, 5, 21)],
    ['December', new Date(2026, 11, 21)],
  ])('Tromso %s: all six finite, strictly ordered, estimated', (_label, date) => {
    const t = getPrayerTimes(date, TROMSO, 'MuslimWorldLeague', 'shafi');
    expectStrictlyOrdered(sixMs(t));
    expect(t.estimated).toBe(true);
  });
  it.each([
    ['December', new Date(2026, 11, 21)],
    ['June', new Date(2026, 5, 21)],
  ])('McMurdo %s: all six finite, strictly ordered, estimated', (_label, date) => {
    const t = getPrayerTimes(date, MCMURDO, 'MuslimWorldLeague', 'shafi');
    expectStrictlyOrdered(sixMs(t));
    expect(t.estimated).toBe(true);
  });
  it('estimated Tromso times equal the computation at latitude +60', () => {
    const date = new Date(2026, 5, 21);
    const estimated = getPrayerTimes(date, TROMSO, 'MuslimWorldLeague', 'shafi');
    const atSixty = getPrayerTimes(date, { latitude: 60, longitude: TROMSO.longitude }, 'MuslimWorldLeague', 'shafi');
    expect(atSixty.estimated).toBe(false);
    expect(sixMs(estimated)).toEqual(sixMs(atSixty));
  });
  it('estimated McMurdo times equal the computation at latitude -60', () => {
    const date = new Date(2026, 11, 21);
    const estimated = getPrayerTimes(date, MCMURDO, 'MuslimWorldLeague', 'shafi');
    const atMinusSixty = getPrayerTimes(date, { latitude: -60, longitude: MCMURDO.longitude }, 'MuslimWorldLeague', 'shafi');
    expect(atMinusSixty.estimated).toBe(false);
    expect(sixMs(estimated)).toEqual(sixMs(atMinusSixty));
  });
});
