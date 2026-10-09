import { evaluateMilestones, activeDateSet } from '../milestones';
import { initialState, planDayKey, type PersistedState } from '../model';
import { addDays } from '../day';
import type { PrayerName } from '../types';

const ALL: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function withActiveDays(n: number, end = '2026-10-09', prayers: PrayerName[] = []): PersistedState {
  const s = initialState();
  for (let i = 0; i < n; i++) {
    s.dates[addDays(end, -i)] = { active: true, prayers, tasbih: {} };
  }
  return s;
}

describe('evaluateMilestones', () => {
  it('returns nothing for a fresh state', () => {
    expect(evaluateMilestones(initialState(), '2026-10-09')).toEqual([]);
  });
  it('unlocks first_step on the first active day', () => {
    expect(evaluateMilestones(withActiveDays(1), '2026-10-09')).toEqual(['first_step']);
  });
  it('unlocks day-count and streak milestones', () => {
    const ids = evaluateMilestones(withActiveDays(7), '2026-10-09');
    expect(ids).toEqual(expect.arrayContaining(['first_step', 'three_days', 'week_one', 'streak_7']));
  });
  it('unlocks prayer milestones', () => {
    const ids = evaluateMilestones(withActiveDays(7, '2026-10-09', ALL), '2026-10-09');
    expect(ids).toEqual(expect.arrayContaining(['first_full_salah_day', 'fajr_7']));
  });
  it('does not return already unlocked milestones', () => {
    const s = withActiveDays(1);
    s.milestones.first_step = '2026-10-01';
    expect(evaluateMilestones(s, '2026-10-09')).toEqual([]);
  });
  it('ignores inactive dates', () => {
    const s = initialState();
    s.dates['2026-10-09'] = { active: false, prayers: [], tasbih: {} };
    expect(activeDateSet(s).size).toBe(0);
  });
  it('unlocks first_reflection only for non-blank journals', () => {
    const s = initialState();
    s.planDays[planDayKey(1, 1)] = { completedTaskIds: [], journal: '   ' };
    expect(evaluateMilestones(s, '2026-10-09')).not.toContain('first_reflection');
    s.planDays[planDayKey(1, 1)].journal = 'Bismillah';
    expect(evaluateMilestones(s, '2026-10-09')).toContain('first_reflection');
  });
  it('sums tasbih across dates', () => {
    const s = initialState();
    s.dates['2026-10-08'] = { active: true, prayers: [], tasbih: { subhanallah: 600 } };
    s.dates['2026-10-09'] = { active: true, prayers: [], tasbih: { alhamdulillah: 400 } };
    expect(evaluateMilestones(s, '2026-10-09')).toContain('tasbih_1000');
  });
  it('counts halfway only in the current cycle, journey_complete in any cycle', () => {
    const s = initialState();
    for (let d = 1; d <= 30; d++) s.planDays[planDayKey(1, d)] = { completedTaskIds: [`${d}_x`] };
    s.cycle = 2;
    const ids = evaluateMilestones(s, '2026-10-09');
    expect(ids).toContain('journey_complete');
    expect(ids).not.toContain('halfway');
  });
});
