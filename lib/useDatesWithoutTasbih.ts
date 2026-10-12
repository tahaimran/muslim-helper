import { useRef } from 'react';
import type { DateKey } from './day';
import type { DateLog } from './model';
import { stripTasbih } from './selectors';
import { useAppStore } from './store';

/**
 * The per-date logs (active flag and prayers) without tasbih counts. The result keeps its
 * identity while only tasbih counts change, so tasbih taps do not re-render the caller.
 */
export function useDatesWithoutTasbih(): Record<DateKey, DateLog> {
  const cache = useRef<Record<DateKey, DateLog> | null>(null);
  return useAppStore((s) => (cache.current = stripTasbih(s.dates, cache.current)));
}
