import { countdownLine } from '../view/nextPrayer';

describe('countdownLine', () => {
  const now = new Date(2026, 0, 5, 10, 0, 0);
  it('uses hours and minutes when both are present', () => {
    expect(countdownLine(now, new Date(2026, 0, 5, 11, 20))).toEqual({ key: 'today.nextIn', h: 1, m: 20 });
  });
  it('drops "0 min" for whole hours', () => {
    expect(countdownLine(now, new Date(2026, 0, 5, 12, 0))).toEqual({ key: 'today.nextInHours', h: 2, m: 0 });
  });
  it('uses minutes only under an hour', () => {
    expect(countdownLine(now, new Date(2026, 0, 5, 10, 45))).toEqual({ key: 'today.nextInMin', h: 0, m: 45 });
  });
  it('has no countdown when the time has arrived', () => {
    expect(countdownLine(now, now)).toEqual({ key: 'today.nextPrayer', h: 0, m: 0 });
  });
});
