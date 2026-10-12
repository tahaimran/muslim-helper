import { dateFromKey, formatLongDate, formatShortDate, formatTime } from '../dates';

describe('dates helpers', () => {
  it('dateFromKey gives local noon of the key', () => {
    const d = dateFromKey('2026-03-08');
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 2, 8, 12]);
  });
  it('formatShortDate is day and short month in the language', () => {
    expect(formatShortDate('2026-10-09', 'en')).toBe('Oct 9');
  });
  it('formatLongDate includes the year', () => {
    expect(formatLongDate('2026-10-09', 'en')).toBe('October 9, 2026');
  });
  it('formatTime shows hour and minutes', () => {
    expect(formatTime(new Date(2026, 0, 5, 13, 5), 'en')).toMatch(/^1:05\sPM$/);
  });
  it('falls back instead of throwing on a bad language tag or key', () => {
    expect(formatShortDate('2026-10-09', '!!bad')).toBe('2026-10-09');
    expect(formatShortDate('nope', 'en')).toBe('nope');
    expect(formatTime(new Date(2026, 0, 5, 13, 5), '!!bad')).toBe('13:05');
  });
});
