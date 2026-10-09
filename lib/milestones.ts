import { getStreak, PLAN_LENGTH, type DateKey } from './day';
import { planDayKey, type PersistedState } from './model';

export const MILESTONE_IDS = [
  'first_step',
  'first_full_salah_day',
  'three_days',
  'week_one',
  'streak_7',
  'fajr_7',
  'first_reflection',
  'tasbih_1000',
  'halfway',
  'journey_complete',
] as const;

export type MilestoneId = (typeof MILESTONE_IDS)[number];

export function activeDateSet(state: PersistedState): Set<DateKey> {
  return new Set(Object.keys(state.dates).filter((k) => state.dates[k].active));
}

function daysWithTasks(state: PersistedState, cycle: number): number {
  let n = 0;
  for (let d = 1; d <= PLAN_LENGTH; d++) {
    if ((state.planDays[planDayKey(cycle, d)]?.completedTaskIds.length ?? 0) > 0) n++;
  }
  return n;
}

export function evaluateMilestones(state: PersistedState, today: DateKey): MilestoneId[] {
  const active = activeDateSet(state);
  const dateLogs = Object.values(state.dates);
  const journals = Object.values(state.planDays).some((p) => (p.journal ?? '').trim().length > 0);
  const tasbihTotal = dateLogs.reduce(
    (sum, log) => sum + Object.values(log.tasbih).reduce((a, b) => a + b, 0),
    0
  );
  const fajrDays = dateLogs.filter((log) => log.prayers.includes('fajr')).length;
  const fullSalahDay = dateLogs.some((log) => new Set(log.prayers).size === 5);
  let anyCycleComplete = false;
  for (let c = 1; c <= state.cycle; c++) {
    if (daysWithTasks(state, c) >= PLAN_LENGTH) anyCycleComplete = true;
  }

  const met: Record<MilestoneId, boolean> = {
    first_step: active.size >= 1,
    first_full_salah_day: fullSalahDay,
    three_days: active.size >= 3,
    week_one: active.size >= 7,
    streak_7: getStreak(active, today) >= 7,
    fajr_7: fajrDays >= 7,
    first_reflection: journals,
    tasbih_1000: tasbihTotal >= 1000,
    halfway: daysWithTasks(state, state.cycle) >= 15,
    journey_complete: anyCycleComplete,
  };

  return MILESTONE_IDS.filter((id) => met[id] && !state.milestones[id]);
}
