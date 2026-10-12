import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/**
 * The current time, refreshed every minute and whenever the app returns to the foreground.
 * With `enabled` false no timer runs and the first value is kept.
 */
export function useNow(enabled = true): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!enabled) return;
    const refresh = () => setNow(new Date());
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') refresh();
    });
    const timer = setInterval(refresh, 60_000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, [enabled]);
  return now;
}
