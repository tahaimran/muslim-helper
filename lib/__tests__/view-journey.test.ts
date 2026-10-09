import { DAYS } from '../../content/days';
import { addDays } from '../day';
import { initialState, planDayKey, type PersistedState, type Profile } from '../model';
import { buildJourneyVM } from '../view/journey';

const START = '2026-10-01';

const profile = (p: Partial<Profile> = {}): Profile => ({
  name: 'Amina', prayerHabit: 'most', knowledgeLevel: 'intermediate',
  focusAreas: [], dailyMinutes: 60, ...p,
});

function state(): PersistedState {
  const s = initialState();
  s.profile = profile();
  s.planStartDate = START;
  return s;
}

const statusOf = (vm: ReturnType<typeof buildJourneyVM>, day: number) =>
  vm.weeks.flatMap((w) => w.days).find((d) => d.day === day)!.status;

describe('buildJourneyVM', () => {
  const today = addDays(START, 9); // day 10

  it('derives statuses at day 10 with mixed progress', () => {
    const s = state();
    s.planDays[planDayKey(1, 1)] = { completedTaskIds: DAYS[0].tasks.map((t) => t.id) };
    s.planDays[planDayKey(1, 2)] = { completedTaskIds: [DAYS[1].tasks[0].id] };
    const vm = buildJourneyVM(s, today);
    expect(vm.cycle).toBe(1);
    expect(vm.currentDay).toBe(10);
    expect(vm.phase).toBe('journey');
    expect(statusOf(vm, 1)).toBe('complete');
    expect(statusOf(vm, 2)).toBe('partial');
    expect(statusOf(vm, 3)).toBe('open');
    expect(statusOf(vm, 10)).toBe('today');
    expect(statusOf(vm, 11)).toBe('locked');
    expect(statusOf(vm, 30)).toBe('locked');
    expect(vm.weeks[0].doneCount).toBe(1);
  });

  it('shows today as complete when all of its tasks are done', () => {
    const s = state();
    s.planDays[planDayKey(1, 10)] = { completedTaskIds: DAYS[9].tasks.map((t) => t.id) };
    expect(statusOf(buildJourneyVM(s, today), 10)).toBe('complete');
  });

  it('lists all 30 days across 4 weeks, week 4 with 9 days', () => {
    const vm = buildJourneyVM(state(), today);
    expect(vm.weeks.map((w) => w.days.length)).toEqual([7, 7, 7, 9]);
    expect(vm.weeks.flatMap((w) => w.days.map((d) => d.day))).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(vm.weeks[0].title).toBe('Foundation');
    expect(vm.weeks[0].days[0].theme).toBe(DAYS[0].theme);
  });

  it('has no today status in istiqamah and no locked days', () => {
    const vm = buildJourneyVM(state(), addDays(START, 40));
    expect(vm.phase).toBe('istiqamah');
    const all = vm.weeks.flatMap((w) => w.days);
    expect(all.some((d) => d.status === 'today')).toBe(false);
    expect(all.some((d) => d.status === 'locked')).toBe(false);
  });
});
