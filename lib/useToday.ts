import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { toDateKey, type DateKey } from './day';

/** Today's date key; refreshes when the app returns to the foreground and every minute. */
export function useToday(): DateKey {
  const [today, setToday] = useState<DateKey>(() => toDateKey(new Date()));

  useEffect(() => {
    const refresh = () => setToday(toDateKey(new Date()));
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') refresh();
    });
    const timer = setInterval(refresh, 60_000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, []);

  return today;
}
