import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import type { DateKey } from './day';
import type { CalcMethodId, MadhabId } from './model';
import { getNextPrayer, getPrayerTimes, resolveCalcSettings, type DailyPrayerTimes } from './prayerTimes';
import { useAppStore } from './store';
import type { PrayerName } from './types';

export interface PrayerTimesState {
  times: DailyPrayerTimes | null;
  next: { name: PrayerName; time: Date } | null;
  method: CalcMethodId;
  madhab: MadhabId;
}

/** Local noon of a date key: a stable instant for that calendar day. */
function noonOf(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}

/**
 * Prayer times for `date` from the saved location (null when none is saved), plus the next
 * upcoming prayer, refreshed every minute and when the app returns to the foreground.
 */
export function usePrayerTimes(date: DateKey): PrayerTimesState {
  const location = useAppStore((s) => s.settings.location);
  const calcMethod = useAppStore((s) => s.settings.calcMethod);
  const madhabPref = useAppStore((s) => s.settings.madhab);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') refresh();
    });
    const timer = setInterval(refresh, 60_000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, []);

  const { method, madhab } = useMemo(
    () => resolveCalcSettings({ calcMethod, madhab: madhabPref }, location?.countryCode ?? null),
    [calcMethod, madhabPref, location?.countryCode],
  );

  const times = useMemo(() => {
    if (!location) return null;
    try {
      return getPrayerTimes(noonOf(date), location, method, madhab);
    } catch {
      return null;
    }
  }, [date, location, method, madhab]);

  const next = useMemo(() => {
    if (!location) return null;
    try {
      return getNextPrayer(now, location, method, madhab);
    } catch {
      return null;
    }
  }, [now, location, method, madhab]);

  return { times, next, method, madhab };
}
