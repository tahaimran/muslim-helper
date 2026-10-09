import { timeUntil } from '../view/nextPrayer';

describe('timeUntil', () => {
  const now = new Date(2026, 0, 5, 10, 0, 0);
  it('splits into hours and minutes, rounding up partial minutes', () => {
    expect(timeUntil(now, new Date(2026, 0, 5, 11, 20, 0))).toEqual({ h: 1, m: 20 });
    expect(timeUntil(now, new Date(2026, 0, 5, 10, 0, 30))).toEqual({ h: 0, m: 1 });
    expect(timeUntil(now, new Date(2026, 0, 5, 12, 0, 0))).toEqual({ h: 2, m: 0 });
  });
  it('never goes negative', () => {
    expect(timeUntil(now, new Date(2026, 0, 5, 9, 0, 0))).toEqual({ h: 0, m: 0 });
  });
});
