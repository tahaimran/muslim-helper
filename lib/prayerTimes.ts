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

export function getPrayerTimes(
  date: Date,
  coords: Coords,
  method: CalcMethodId,
  madhab: MadhabId
): DailyPrayerTimes {
  const compute = (lat: number, lon: number) => {
    const params = CalculationMethod[method]();
    params.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
    params.highLatitudeRule = HighLatitudeRule.recommended(coords);
    const t = new PrayerTimes(new Coordinates(lat, lon), date, params);
    return { fajr: t.fajr, sunrise: t.sunrise, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha };
  };
  const exact = compute(coords.latitude, coords.longitude);
  const allFinite = PRAYER_ORDER.every((p) => Number.isFinite(exact[p].getTime()));
  if (allFinite) return { ...exact, estimated: false };
  // Polar day/night: adhan's high-latitude rules can still yield NaN, so
  // fall back to the nearest latitude that has defined times (±60°).
  const clamped = Math.max(-60, Math.min(60, coords.latitude));
  return { ...compute(clamped, coords.longitude), estimated: true };
}

export function getNextPrayer(
  now: Date,
  coords: Coords,
  method: CalcMethodId,
  madhab: MadhabId
): { name: PrayerName; time: Date } {
  const isValid = (d: Date) => Number.isFinite(d.getTime());
  const today = getPrayerTimes(now, coords, method, madhab);
  for (const name of PRAYER_ORDER) {
    if (!isValid(today[name])) continue;
    if (today[name].getTime() > now.getTime()) return { name, time: today[name] };
  }
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const next = getPrayerTimes(tomorrow, coords, method, madhab);
  if (isValid(next.fajr)) return { name: 'fajr', time: next.fajr };
  for (const name of PRAYER_ORDER) {
    if (isValid(next[name])) return { name, time: next[name] };
  }
  return { name: 'fajr', time: next.fajr };
}
