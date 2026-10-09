import { colorsFor, palette } from '../tokens';
import { getSkyPhase, SKY } from '../sky';
import { fontFamily, lineHeightFor } from '../fonts';
import { contrastRatio } from '../contrast';
import type { DailyPrayerTimes } from '../../lib/prayerTimes';

const at = (h: number, m = 0) => new Date(2026, 9, 9, h, m);
const times: DailyPrayerTimes = {
  fajr: at(5, 0), sunrise: at(6, 20), dhuhr: at(12, 10),
  asr: at(15, 30), maghrib: at(18, 5), isha: at(19, 25),
};

describe('contrast', () => {
  it('computes known ratios', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });
  it.each(['light', 'dark'] as const)('%s theme text passes AA on bg and surface', (scheme) => {
    const c = colorsFor(scheme);
    for (const bg of [c.bg, c.surface]) {
      expect(contrastRatio(c.text, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.textMuted, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.accent, bg)).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(c.gold, bg)).toBeGreaterThanOrEqual(3);
    }
    expect(contrastRatio(c.onAccent, c.accent)).toBeGreaterThanOrEqual(4.5);
  });
  it('sky text passes AA on every gradient stop', () => {
    for (const s of Object.values(SKY)) {
      for (const stop of s.gradient) expect(contrastRatio(s.text, stop)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('exposes the palette', () => {
    expect(palette.layl).toBe('#161A33');
  });
});

describe('getSkyPhase', () => {
  it('follows prayer times', () => {
    expect(getSkyPhase(at(1), times)).toBe('night');
    expect(getSkyPhase(at(5, 30), times)).toBe('fajr');
    expect(getSkyPhase(at(9), times)).toBe('morning');
    expect(getSkyPhase(at(13), times)).toBe('afternoon');
    expect(getSkyPhase(at(16), times)).toBe('asr');
    expect(getSkyPhase(at(18, 30), times)).toBe('maghrib');
    expect(getSkyPhase(at(22), times)).toBe('night');
  });
  it('falls back to clock hours without times', () => {
    expect(getSkyPhase(at(2), null)).toBe('night');
    expect(getSkyPhase(at(5, 30), null)).toBe('fajr');
    expect(getSkyPhase(at(10), null)).toBe('morning');
    expect(getSkyPhase(at(13), null)).toBe('afternoon');
    expect(getSkyPhase(at(16), null)).toBe('asr');
    expect(getSkyPhase(at(19), null)).toBe('maghrib');
    expect(getSkyPhase(at(21), null)).toBe('night');
  });
});

describe('fonts', () => {
  it('uses Nastaliq for Urdu UI and Amiri for Arabic text everywhere', () => {
    expect(fontFamily('ur', 'ui')).toMatch(/NotoNastaliqUrdu/);
    expect(fontFamily('en', 'ui')).toMatch(/ReadexPro/);
    expect(fontFamily('ar', 'ui')).toMatch(/ReadexPro/);
    for (const l of ['en', 'ar', 'ur', 'id', 'tr'] as const) expect(fontFamily(l, 'arabic')).toMatch(/Amiri/);
    expect(fontFamily('en', 'display')).toMatch(/Amiri/);
  });
  it('gives Nastaliq extra line height', () => {
    expect(lineHeightFor('ur', 16)).toBe(32);
    expect(lineHeightFor('en', 16)).toBe(23);
  });
});
