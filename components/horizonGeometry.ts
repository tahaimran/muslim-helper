import { PRAYER_ORDER, type DailyPrayerTimes } from '../lib/prayerTimes';
import type { PrayerName } from '../lib/types';

/**
 * Fixed, evenly spaced node angles in PRAYER_ORDER (degrees; 180 = start end, 90 = top, 0 = far end).
 * The arc shows the day's sequence: Fajr low at the start, Isha low at the far end, Asr at the apex.
 */
export const NODE_ANGLES: readonly number[] = [165, 127.5, 90, 52.5, 15];

export interface ArcGeometry {
  width: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  isRTL: boolean;
}

export interface Point {
  x: number;
  y: number;
}

/** Semi-ellipse spanning `width` minus `inset` on each side; its baseline is at y = height and its top at y = 0. */
export function arcGeometry(width: number, height: number, isRTL: boolean, inset = 24): ArcGeometry {
  return { width, cx: width / 2, cy: height, rx: Math.max(0, (width - inset * 2) / 2), ry: height, isRTL };
}

/** Point on the arc at `deg`; x is mirrored around the centre in RTL so the start end is on the right. */
export function pointAtAngle(g: ArcGeometry, deg: number): Point {
  'worklet';
  const rad = (deg * Math.PI) / 180;
  const x = g.cx + g.rx * Math.cos(rad);
  return { x: g.isRTL ? g.width - x : x, y: g.cy - g.ry * Math.sin(rad) };
}

export function arcPath(g: ArcGeometry): string {
  const a = g.cx - g.rx;
  const b = g.cx + g.rx;
  return `M ${a} ${g.cy} A ${g.rx} ${g.ry} 0 0 1 ${b} ${g.cy}`;
}

export function nodePositions(g: ArcGeometry): Record<PrayerName, Point> {
  const out = {} as Record<PrayerName, Point>;
  PRAYER_ORDER.forEach((p, i) => {
    out[p] = pointAtAngle(g, NODE_ANGLES[i]);
  });
  return out;
}

/** Sun angle for `now`: clamped to Fajr before Fajr and to Isha after Isha, linearly interpolated between neighbours. */
export function sunAngle(now: Date, times: DailyPrayerTimes): number {
  const t = now.getTime();
  const ts = PRAYER_ORDER.map((p) => times[p].getTime());
  if (t <= ts[0]) return NODE_ANGLES[0];
  const last = ts.length - 1;
  if (t >= ts[last]) return NODE_ANGLES[last];
  for (let i = 0; i < last; i++) {
    if (t < ts[i + 1]) {
      const span = ts[i + 1] - ts[i];
      const f = span > 0 ? (t - ts[i]) / span : 0;
      return NODE_ANGLES[i] + (NODE_ANGLES[i + 1] - NODE_ANGLES[i]) * f;
    }
  }
  return NODE_ANGLES[last];
}

export function sunPosition(g: ArcGeometry, now: Date, times: DailyPrayerTimes): Point {
  return pointAtAngle(g, sunAngle(now, times));
}

/** Smallest horizontal distance between adjacent node centres (caps touch-target width so targets never overlap). */
export function minNodeSpacing(nodes: Record<PrayerName, Point>): number {
  let min = Infinity;
  for (let i = 1; i < PRAYER_ORDER.length; i++) {
    min = Math.min(min, Math.abs(nodes[PRAYER_ORDER[i]].x - nodes[PRAYER_ORDER[i - 1]].x));
  }
  return min;
}
