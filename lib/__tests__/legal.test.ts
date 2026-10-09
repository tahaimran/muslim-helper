import { formatLegalDate, LEGAL_UPDATED } from '../legal';

describe('formatLegalDate', () => {
  it('formats a long date', () => {
    expect(formatLegalDate(LEGAL_UPDATED, 'en')).toContain('2026');
  });
  it('falls back safely', () => {
    expect(formatLegalDate('nope', 'en')).toBe('nope');
    expect(formatLegalDate('2026-10-09', 'not a lang!!')).toBe('2026-10-09');
  });
});
