import {
  toDateKey, addDays, daysBetween, getPlanPosition, getStreak,
  daysSinceLastActive, shouldWelcomeBack, PLAN_LENGTH,
} from '../day';

describe('date keys', () => {
  it('uses the local calendar date', () => {
    expect(toDateKey(new Date(2026, 2, 8, 23, 30))).toBe('2026-03-08');
    expect(toDateKey(new Date(2026, 0, 5, 0, 1))).toBe('2026-01-05');
  });
  it('adds days across month, leap and DST boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2026-03-08', 1)).toBe('2026-03-09'); // US DST start
    expect(addDays('2026-11-01', 1)).toBe('2026-11-02'); // US DST end
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
  it('counts whole days between keys, DST-safe', () => {
    expect(daysBetween('2026-03-07', '2026-03-09')).toBe(2);
    expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2);
    expect(daysBetween('2026-01-10', '2026-01-10')).toBe(0);
    expect(daysBetween('2026-01-10', '2026-01-08')).toBe(-2);
  });
});

describe('getPlanPosition', () => {
  it('starts on day 1', () => {
    expect(getPlanPosition('2026-10-01', '2026-10-01')).toEqual({ day: 1, phase: 'journey' });
  });
  it('advances by calendar day', () => {
    expect(getPlanPosition('2026-10-01', '2026-10-15')).toEqual({ day: 15, phase: 'journey' });
    expect(getPlanPosition('2026-10-01', '2026-10-30')).toEqual({ day: 30, phase: 'journey' });
  });
  it('enters istiqamah after day 30', () => {
    expect(getPlanPosition('2026-10-01', '2026-10-31')).toEqual({ day: PLAN_LENGTH, phase: 'istiqamah' });
    expect(getPlanPosition('2026-10-01', '2027-03-01')).toEqual({ day: PLAN_LENGTH, phase: 'istiqamah' });
  });
  it('never goes below day 1 if the clock moved backwards', () => {
    expect(getPlanPosition('2026-10-10', '2026-10-01')).toEqual({ day: 1, phase: 'journey' });
  });
});

describe('getStreak', () => {
  const set = (...k: string[]) => new Set(k);
  it('counts consecutive days ending today', () => {
    expect(getStreak(set('2026-10-07', '2026-10-08', '2026-10-09'), '2026-10-09')).toBe(3);
  });
  it('still counts through yesterday if today has no activity yet', () => {
    expect(getStreak(set('2026-10-07', '2026-10-08'), '2026-10-09')).toBe(2);
  });
  it('is 0 after a missed day', () => {
    expect(getStreak(set('2026-10-06'), '2026-10-09')).toBe(0);
  });
  it('stops at a gap', () => {
    expect(getStreak(set('2026-10-05', '2026-10-07', '2026-10-08', '2026-10-09'), '2026-10-09')).toBe(3);
  });
});

describe('welcome back', () => {
  it('measures days since last activity, ignoring future keys', () => {
    expect(daysSinceLastActive(new Set(['2026-10-01', '2026-10-05', '2026-12-01']), '2026-10-09')).toBe(4);
    expect(daysSinceLastActive(new Set(), '2026-10-09')).toBeNull();
  });
  it('welcomes back after 2+ missed days (last active 3+ days ago)', () => {
    expect(shouldWelcomeBack(null)).toBe(false);
    expect(shouldWelcomeBack(1)).toBe(false);
    expect(shouldWelcomeBack(2)).toBe(false);
    expect(shouldWelcomeBack(3)).toBe(true);
  });
});
