import { CalculationMethod, Coordinates, HighLatitudeRule, Madhab, PrayerTimes } from 'adhan';
import { PRAYER_NAMES, type CalcMethodId, type MadhabId, type Settings } from './model';
import type { PrayerName } from './types';

export const PRAYER_ORDER: readonly PrayerName[] = PRAYER_NAMES;

export interface DailyPrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  /** True when the coordinates were clamped to ±60° latitude (polar day/night). */
  estimated: boolean;
}

export interface Coords {
  latitude: number;
  longitude: number;
}

const COUNTRY_METHOD: Record<string, CalcMethodId> = {
  SA: 'UmmAlQura',
  PK: 'Karachi', IN: 'Karachi', BD: 'Karachi', AF: 'Karachi',
  TR: 'Turkey',
  ID: 'Singapore', MY: 'Singapore', SG: 'Singapore', BN: 'Singapore',
  EG: 'Egyptian', SD: 'Egyptian', LY: 'Egyptian',
  AE: 'Dubai', QA: 'Qatar', KW: 'Kuwait',
  US: 'NorthAmerica', CA: 'NorthAmerica',
  IR: 'Tehran',
};

const HANAFI_COUNTRIES = new Set(['PK', 'IN', 'BD', 'AF', 'TR']);

export function resolveCalcSettings(
  settings: Pick<Settings, 'calcMethod' | 'madhab'>,
  countryCode: string | null
): { method: CalcMethodId; madhab: MadhabId } {
  const cc = countryCode?.toUpperCase() ?? '';
  return {
    method: settings.calcMethod ?? COUNTRY_METHOD[cc] ?? 'MuslimWorldLeague',
    madhab: settings.madhab ?? (HANAFI_COUNTRIES.has(cc) ? 'hanafi' : 'shafi'),
  };
}

/**
 * adhan's recommended high-latitude rule depends on latitude magnitude only, so
 * the hemisphere is ignored (southern and northern 53 degrees share a rule).
 */
export function highLatitudeRuleFor(latitude: number) {
  return HighLatitudeRule.recommended(new Coordinates(Math.abs(latitude), 0));
}

const SIX_TIMES = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
const isValidDate = (d: Date) => Number.isFinite(d.getTime());

export function getPrayerTimes(
  date: Date,
  coords: Coords,
  method: CalcMethodId,
  madhab: MadhabId
): DailyPrayerTimes {
  const compute = (latitude: number) => {
    const params = CalculationMethod[method]();
    params.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
    params.highLatitudeRule = highLatitudeRuleFor(latitude);
    const t = new PrayerTimes(new Coordinates(latitude, coords.longitude), date, params);
    return { fajr: t.fajr, sunrise: t.sunrise, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha };
  };
  const exact = compute(coords.latitude);
  if (SIX_TIMES.every((k) => isValidDate(exact[k]))) return { ...exact, estimated: false };
  // Polar day/night. A single NaN switches the WHOLE day to the clamped computation
  // (latitude limited to +/-60 for both times and the rule), which keeps the six
  // times mutually consistent and ordered rather than mixing two calculations.
  const clamped = Math.max(-60, Math.min(60, coords.latitude));
  return { ...compute(clamped), estimated: true };
}

/**
 * Picks the next prayer after `now` from today's and tomorrow's times.
 * Invalid (NaN) and past times are skipped. Returns null when no upcoming valid
 * time exists, so callers in render paths can simply omit the next-prayer line.
 */
export function pickNext(
  now: Date,
  today: DailyPrayerTimes,
  tomorrow: DailyPrayerTimes
): { name: PrayerName; time: Date } | null {
  // Tomorrow's times are not guaranteed to fall after `now` at high latitudes
  // (e.g. Tromso's "tomorrow" fajr can land earlier in local time), so check both.
  for (const day of [today, tomorrow]) {
    for (const name of PRAYER_ORDER) {
      const time = day[name];
      if (isValidDate(time) && time.getTime() > now.getTime()) return { name, time };
    }
  }
  return null;
}

export function getNextPrayer(
  now: Date,
  coords: Coords,
  method: CalcMethodId,
  madhab: MadhabId
): { name: PrayerName; time: Date } | null {
  const today = getPrayerTimes(now, coords, method, madhab);
  const tomorrow = getPrayerTimes(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), coords, method, madhab);
  return pickNext(now, today, tomorrow);
}
