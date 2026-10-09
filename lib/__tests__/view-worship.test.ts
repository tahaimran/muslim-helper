import { DAYS } from '../../content/days';
import type { DayContent, Dhikr } from '../../content/types';
import {
  BASE_DHIKR_IDS, ROUND_TARGETS, adhkarExpansion, buildDhikrOptions, nextRound, roundProgress,
} from '../view/worship';

const mk = (id: string, count = 10): Dhikr => ({
  id, arabic: `ar-${id}`, transliteration: `tr-${id}`, meaning: `m-${id}`, count, source: null,
});

describe('roundProgress', () => {
  it('is count over target, 0 to 1', () => {
    expect(roundProgress(0, 33)).toBe(0);
    expect(roundProgress(11, 33)).toBeCloseTo(1 / 3);
    expect(roundProgress(33, 33)).toBe(1);
    expect(roundProgress(50, 33)).toBe(1);
  });
  it('is safe for a bad target', () => {
    expect(roundProgress(5, 0)).toBe(0);
  });
});

describe('nextRound', () => {
  it('counts up without completing', () => {
    expect(nextRound(0, 33)).toEqual({ round: 1, complete: false });
    expect(nextRound(31, 33)).toEqual({ round: 32, complete: false });
  });
  it('completes on reaching the target and resets the round to 0', () => {
    expect(nextRound(32, 33)).toEqual({ round: 0, complete: true });
    expect(nextRound(98, 99)).toEqual({ round: 0, complete: true });
  });
  it('treats a lowered target as complete', () => {
    expect(nextRound(60, 33)).toEqual({ round: 0, complete: true });
  });
});

describe('ROUND_TARGETS', () => {
  it('offers 33, 99 and 100', () => {
    expect(ROUND_TARGETS).toEqual([33, 99, 100]);
  });
});

describe('buildDhikrOptions', () => {
  it('starts with the six base dhikr in order, resolved from content', () => {
    const opts = buildDhikrOptions(DAYS, null);
    expect(opts.slice(0, 6).map((o) => o.id)).toEqual([...BASE_DHIKR_IDS]);
    expect(opts[0].arabic).toBeTruthy();
    expect(opts[0].transliteration).toBeTruthy();
  });
  it('appends other dhikr from today, de-duplicated', () => {
    const day = {
      morningDhikr: [mk('subhanallah'), mk('extra_a')],
      eveningDhikr: [mk('extra_a'), mk('extra_b')],
    } as unknown as DayContent;
    const ids = buildDhikrOptions(DAYS, day).map((o) => o.id);
    expect(ids.slice(6)).toEqual(['extra_a', 'extra_b']);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('skips a base id missing from content instead of crashing', () => {
    const ids = buildDhikrOptions([], null).map((o) => o.id);
    expect(ids).toEqual([]);
  });
});

describe('adhkarExpansion', () => {
  const at = (h: number, m = 0) => new Date(2026, 9, 9, h, m);
  it('uses the clock when there are no prayer times', () => {
    expect(adhkarExpansion(at(7), null)).toBe('morning');
    expect(adhkarExpansion(at(11, 59), null)).toBe('morning');
    expect(adhkarExpansion(at(13), null)).toBeNull();
    expect(adhkarExpansion(at(16), null)).toBe('evening');
    expect(adhkarExpansion(at(22), null)).toBe('evening');
  });
  it('uses dhuhr and asr when known', () => {
    const times = { dhuhr: at(13), asr: at(17) };
    expect(adhkarExpansion(at(12, 59), times)).toBe('morning');
    expect(adhkarExpansion(at(14), times)).toBeNull();
    expect(adhkarExpansion(at(17), times)).toBe('evening');
  });
  it('falls back to the clock for invalid times', () => {
    const bad = { dhuhr: new Date(NaN), asr: new Date(NaN) };
    expect(adhkarExpansion(at(8), bad)).toBe('morning');
  });
});
