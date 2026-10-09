import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';
import type { CalcMethodId, MadhabId, Settings } from './model';
import type { PrayerName } from './types';

export const PRAYER_ORDER: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export interface DailyPrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
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
  const params = CalculationMethod[method]();
  params.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  const t = new PrayerTimes(new Coordinates(coords.latitude, coords.longitude), date, params);
  return { fajr: t.fajr, sunrise: t.sunrise, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha };
}

export function getNextPrayer(
  now: Date,
  coords: Coords,
  method: CalcMethodId,
  madhab: MadhabId
): { name: PrayerName; time: Date } {
  const today = getPrayerTimes(now, coords, method, madhab);
  for (const name of PRAYER_ORDER) {
    if (today[name].getTime() > now.getTime()) return { name, time: today[name] };
  }
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { name: 'fajr', time: getPrayerTimes(tomorrow, coords, method, madhab).fajr };
}
