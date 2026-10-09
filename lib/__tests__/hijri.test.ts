import { toHijri } from '../hijri';

describe('toHijri (Umm al-Qura)', () => {
  it('matches known dates', () => {
    expect(toHijri(new Date(2026, 1, 18))).toEqual({ year: 1447, month: 9, day: 1 }); // 1 Ramadan 1447
    expect(toHijri(new Date(2025, 2, 1))).toEqual({ year: 1446, month: 9, day: 1 }); // 1 Ramadan 1446
    expect(toHijri(new Date(2025, 5, 26))).toEqual({ year: 1447, month: 1, day: 1 }); // 1 Muharram 1447
  });
  it('returns null instead of throwing outside the supported range', () => {
    expect(toHijri(new Date(1800, 0, 1))).toBeNull();
  });
});
