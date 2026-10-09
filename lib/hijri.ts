import umalqura from '@umalqura/core';

export interface HijriDate {
  year: number;
  month: number; // 1 = Muharram … 12 = Dhu al-Hijjah
  day: number;
}

export function toHijri(date: Date): HijriDate | null {
  try {
    const h = umalqura(date);
    if (!Number.isFinite(h.hy) || !Number.isFinite(h.hm) || !Number.isFinite(h.hd)) return null;
    return { year: h.hy, month: h.hm, day: h.hd };
  } catch {
    return null;
  }
}
