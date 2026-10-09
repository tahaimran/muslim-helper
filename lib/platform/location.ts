import * as Location from 'expo-location';

export type CoordsResult =
  | { ok: true; latitude: number; longitude: number }
  | { ok: false; reason: 'denied' | 'unavailable' };

const TIMEOUT_MS = 10_000;

/**
 * One-shot foreground GPS fix. Asks for foreground permission only and never
 * reverse-geocodes (that would send coordinates to a remote service).
 */
export async function getCurrentCoords(): Promise<CoordsResult> {
  try {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') return { ok: false, reason: 'denied' };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), TIMEOUT_MS);
    });
    const fix = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    fix.catch(() => {}); // a late rejection after the timeout must not go unhandled
    let pos: Awaited<typeof fix> | null;
    try {
      pos = await Promise.race([fix, timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
    if (!pos) return { ok: false, reason: 'unavailable' };
    return { ok: true, latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}
