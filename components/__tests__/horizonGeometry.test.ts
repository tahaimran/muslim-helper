import {
  NODE_ANGLES,
  arcGeometry,
  arcPath,
  minNodeSpacing,
  nodePositions,
  pointAtAngle,
  sunAngle,
  sunDisplayAngle,
  sunPosition,
} from '../horizonGeometry';
import type { DailyPrayerTimes } from '../../lib/prayerTimes';

const at = (h: number, m = 0) => new Date(2026, 9, 9, h, m);
const times: DailyPrayerTimes = {
  fajr: at(5),
  sunrise: at(6, 30),
  dhuhr: at(12),
  asr: at(15),
  maghrib: at(18),
  isha: at(20),
  estimated: false,
};

const W = 348;
const H = 72;

describe('arcGeometry', () => {
  it('spans the width minus the inset on each side, with the given height', () => {
    const g = arcGeometry(W, H, false);
    expect(g.cx).toBe(W / 2);
    expect(g.rx).toBe((W - 48) / 2);
    expect(g.ry).toBe(H);
    expect(g.cy).toBe(H);
  });

  it('never yields a negative radius for tiny widths', () => {
    expect(arcGeometry(10, H, false).rx).toBe(0);
  });

  it('builds a semi-ellipse path from start to end', () => {
    expect(arcPath(arcGeometry(W, H, false))).toBe(`M 24 72 A 150 72 0 0 1 324 72`);
  });
});

describe('nodePositions', () => {
  it('uses evenly spaced fixed angles from the start end to the far end', () => {
    expect(NODE_ANGLES).toEqual([165, 127.5, 90, 52.5, 15]);
  });

  it('keeps adjacent nodes far enough apart for their labels', () => {
    const p = nodePositions(arcGeometry(W, H, false));
    expect(p.dhuhr.x - p.fajr.x).toBeGreaterThanOrEqual(44);
    expect(p.asr.x - p.dhuhr.x).toBeGreaterThanOrEqual(44);
    expect(p.maghrib.x - p.asr.x).toBeGreaterThanOrEqual(44);
    expect(p.isha.x - p.maghrib.x).toBeGreaterThanOrEqual(44);
  });

  it('puts Fajr low at the start (left) and Isha low at the end (right) in LTR', () => {
    const p = nodePositions(arcGeometry(W, H, false));
    expect(p.fajr.x).toBeLessThan(p.dhuhr.x);
    expect(p.isha.x).toBeGreaterThan(p.dhuhr.x);
    expect(p.fajr.x).toBeLessThan(W / 4);
    expect(p.isha.x).toBeGreaterThan((3 * W) / 4);
    expect(p.fajr.y).toBeCloseTo(p.isha.y, 6);
    expect(p.fajr.y).toBeGreaterThan(p.asr.y);
  });

  it('is balanced: Asr at the apex, the other nodes symmetric about the centre', () => {
    const p = nodePositions(arcGeometry(W, H, false));
    expect(p.asr.x).toBeCloseTo(W / 2, 6);
    expect(p.asr.y).toBeCloseTo(0, 6);
    expect(p.dhuhr.x + p.maghrib.x).toBeCloseTo(W, 6);
    expect(p.dhuhr.y).toBeCloseTo(p.maghrib.y, 6);
    expect(p.fajr.x + p.isha.x).toBeCloseTo(W, 6);
  });

  it('minNodeSpacing returns the smallest gap between adjacent node centres', () => {
    const p = nodePositions(arcGeometry(W, H, false));
    expect(minNodeSpacing(p)).toBeCloseTo(p.dhuhr.x - p.fajr.x, 6);
    expect(minNodeSpacing(nodePositions(arcGeometry(W, H, true)))).toBeCloseTo(p.dhuhr.x - p.fajr.x, 6);
    expect(minNodeSpacing(nodePositions(arcGeometry(200, H, false)))).toBeLessThan(44);
  });

  it('is ordered start to end along x in LTR', () => {
    const p = nodePositions(arcGeometry(W, H, false));
    expect(p.fajr.x).toBeLessThan(p.dhuhr.x);
    expect(p.dhuhr.x).toBeLessThan(p.asr.x);
    expect(p.asr.x).toBeLessThan(p.maghrib.x);
    expect(p.maghrib.x).toBeLessThan(p.isha.x);
  });

  it('mirrors x in RTL so Fajr sits at the right end', () => {
    const ltr = nodePositions(arcGeometry(W, H, false));
    const rtl = nodePositions(arcGeometry(W, H, true));
    for (const k of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const) {
      expect(rtl[k].x).toBeCloseTo(W - ltr[k].x, 6);
      expect(rtl[k].y).toBeCloseTo(ltr[k].y, 6);
    }
    expect(rtl.fajr.x).toBeGreaterThan(rtl.isha.x);
  });
});

describe('sun', () => {
  it('is clamped to the Fajr node before Fajr', () => {
    expect(sunAngle(at(3), times)).toBe(165);
  });

  it('rests 14px beyond the Fajr node, towards the start edge, before Fajr', () => {
    for (const rtl of [false, true]) {
      const g = arcGeometry(W, H, rtl);
      const s = sunPosition(g, at(3), times);
      const f = nodePositions(g).fajr;
      expect(Math.hypot(s.x - f.x, s.y - f.y)).toBeCloseTo(14, 0);
      expect(s.y).toBeGreaterThan(f.y);
      if (rtl) expect(s.x).toBeGreaterThan(f.x);
      else expect(s.x).toBeLessThan(f.x);
    }
    expect(sunDisplayAngle(arcGeometry(W, H, false), at(3), times)).toBeGreaterThan(165);
  });

  it('is clamped to the Isha node after Isha', () => {
    expect(sunAngle(at(23, 30), times)).toBe(15);
  });

  it('rests 14px beyond the Isha node, towards the far edge, after Isha', () => {
    for (const rtl of [false, true]) {
      const g = arcGeometry(W, H, rtl);
      const s = sunPosition(g, at(23, 30), times);
      const i = nodePositions(g).isha;
      expect(Math.hypot(s.x - i.x, s.y - i.y)).toBeCloseTo(14, 0);
      if (rtl) expect(s.x).toBeLessThan(i.x);
      else expect(s.x).toBeGreaterThan(i.x);
    }
    expect(sunDisplayAngle(arcGeometry(W, H, false), at(23, 30), times)).toBeLessThan(15);
  });

  it('shows the sun exactly on its interpolated angle between Fajr and Isha', () => {
    const g = arcGeometry(W, H, false);
    expect(sunDisplayAngle(g, at(13, 30), times)).toBeCloseTo(108.75, 6);
    expect(sunDisplayAngle(g, at(12), times)).toBe(127.5);
  });

  it('never pushes the resting sun past the ends of the arc', () => {
    const g = arcGeometry(60, 8, false);
    expect(sunDisplayAngle(g, at(3), times)).toBeLessThanOrEqual(180);
    expect(sunDisplayAngle(g, at(23, 30), times)).toBeGreaterThanOrEqual(0);
  });

  it('sits exactly on a node at that prayer time', () => {
    expect(sunAngle(at(12), times)).toBe(127.5);
    expect(sunAngle(at(15), times)).toBe(90);
  });

  it('interpolates between neighbouring prayers', () => {
    // halfway between Dhuhr (12:00, 127.5deg) and Asr (15:00, 90deg)
    expect(sunAngle(at(13, 30), times)).toBeCloseTo(108.75, 6);
    // a quarter of the way from Fajr (05:00, 165deg) to Dhuhr (12:00, 127.5deg)
    expect(sunAngle(at(6, 45), times)).toBeCloseTo(155.625, 6);
  });

  it('pointAtAngle mirrors around the centre in RTL', () => {
    const l = pointAtAngle(arcGeometry(W, H, false), 70);
    const r = pointAtAngle(arcGeometry(W, H, true), 70);
    expect(r.x).toBeCloseTo(W - l.x, 6);
    expect(r.y).toBeCloseTo(l.y, 6);
  });
});
