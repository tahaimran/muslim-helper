import { useMemo } from 'react';
import { dateFromKey } from './dates';
import type { DateKey } from './day';
import type { CalcMethodId, MadhabId } from './model';
import { getNextPrayer, getPrayerTimes, resolveCalcSettings, type DailyPrayerTimes } from './prayerTimes';
import { useAppStore } from './store';
import type { PrayerName } from './types';
import { useNow } from './useNow';

export interface PrayerTimesState {
  times: DailyPrayerTimes | null;
  next: { name: PrayerName; time: Date } | null;
  method: CalcMethodId;
  madhab: MadhabId;
}

/**
 * Prayer times for `date` from the saved location (null when none is saved), plus the next
 * upcoming prayer. Pass the caller's `now` so a countdown and the next prayer share one clock;
 * otherwise an internal clock refreshes every minute and when the app returns to the foreground.
 */
export function usePrayerTimes(date: DateKey, now?: Date): PrayerTimesState {
  const location = useAppStore((s) => s.settings.location);
  const calcMethod = useAppStore((s) => s.settings.calcMethod);
  const madhabPref = useAppStore((s) => s.settings.madhab);

  const ownNow = useNow(now === undefined);
  const clock = now ?? ownNow;

  const { method, madhab } = useMemo(
    () => resolveCalcSettings({ calcMethod, madhab: madhabPref }, location?.countryCode ?? null),
    [calcMethod, madhabPref, location?.countryCode],
  );

  const times = useMemo(() => {
    if (!location) return null;
    try {
      return getPrayerTimes(dateFromKey(date), location, method, madhab);
    } catch {
      return null;
    }
  }, [date, location, method, madhab]);

  const next = useMemo(() => {
    if (!location) return null;
    try {
      return getNextPrayer(clock, location, method, madhab);
    } catch {
      return null;
    }
  }, [clock, location, method, madhab]);

  return { times, next, method, madhab };
}
