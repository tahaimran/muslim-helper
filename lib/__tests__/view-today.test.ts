import { DAYS } from '../../content/days';
import { addDays } from '../day';
import { initialState, planDayKey, type PersistedState, type Profile } from '../model';
import { createAppStore } from '../store';
import { buildDayVM, buildTodayVM, istiqamahJournalDay } from '../view/today';

const START = '2026-10-01';

const profile = (p: Partial<Profile> = {}): Profile => ({
  name: 'Amina', prayerHabit: 'most', knowledgeLevel: 'intermediate',
  focusAreas: [], dailyMinutes: 60, ...p,
});

function state(p: Partial<Profile> = {}): PersistedState {
  const s = initialState();
  s.profile = profile(p);
  s.planStartDate = START;
  return s;
}

describe('buildTodayVM', () => {
  it('is day 1 of the journey on the start date', () => {
    const vm = buildTodayVM(state(), START);
    expect(vm.phase).toBe('journey');
    expect(vm.day?.day).toBe(1);
    expect(vm.day?.content.day).toBe(1);
    expect(vm.day?.tasks.map((t) => t.id)).toEqual(DAYS[0].tasks.map((t) => t.id));
    expect(vm.istiqamah).toBeNull();
    expect(vm.today).toBe(START);
  });

  it('advances the day with the calendar', () => {
    expect(buildTodayVM(state(), addDays(START, 1)).day?.day).toBe(2);
    expect(buildTodayVM(state(), addDays(START, 4)).day?.day).toBe(5);
  });

  it('trims tasks for 10 minutes a day', () => {
    const vm = buildTodayVM(state({ dailyMinutes: 10 }), START);
    expect(vm.day?.tasks.length).toBe(3);
    const ids = DAYS[0].tasks.map((t) => t.id);
    for (const t of vm.day!.tasks) expect(ids).toContain(t.id);
  });

  it('marks completed tasks done', () => {
    const s = state();
    const first = DAYS[0].tasks[0].id;
    s.planDays[planDayKey(1, 1)] = { completedTaskIds: [first] };
    const task = buildTodayVM(s, START).day!.tasks.find((t) => t.id === first)!;
    expect(task.done).toBe(true);
    expect(task.lockedByTasbih).toBe(false);
  });

  it('marks a tasbih task done and locked when today\'s counts reach every target', () => {
    const s = state();
    const tasbihTask = DAYS[0].tasks.find((t) => t.tasbih && t.tasbih.length > 0)!;
    const partial: Record<string, number> = {};
    tasbihTask.tasbih!.forEach((tg, i) => { partial[tg.dhikrId] = i === 0 ? tg.target - 1 : tg.target; });
    s.dates[START] = { active: true, prayers: [], tasbih: partial };
    let task = buildTodayVM(s, START).day!.tasks.find((t) => t.id === tasbihTask.id)!;
    expect(task.done).toBe(false);

    const full: Record<string, number> = {};
    tasbihTask.tasbih!.forEach((tg) => { full[tg.dhikrId] = tg.target; });
    s.dates[START] = { active: true, prayers: [], tasbih: full };
    task = buildTodayVM(s, START).day!.tasks.find((t) => t.id === tasbihTask.id)!;
    expect(task.done).toBe(true);
    expect(task.lockedByTasbih).toBe(true);

    // Not locked when the user also checked it manually.
    s.planDays[planDayKey(1, 1)] = { completedTaskIds: [tasbihTask.id] };
    task = buildTodayVM(s, START).day!.tasks.find((t) => t.id === tasbihTask.id)!;
    expect(task.done).toBe(true);
    expect(task.lockedByTasbih).toBe(false);
  });

  it('reports prayers done today and the streak', () => {
    const s = state();
    s.dates[addDays(START, 1)] = { active: true, prayers: [], tasbih: {} };
    s.dates[addDays(START, 2)] = { active: true, prayers: ['fajr', 'dhuhr'], tasbih: {} };
    const vm = buildTodayVM(s, addDays(START, 2));
    expect(vm.prayersDone).toEqual(['fajr', 'dhuhr']);
    expect(vm.streak).toBe(2);
    expect(vm.daysShownUp).toBe(2);
  });

  it('welcomes back after 3 days away', () => {
    const s = state();
    s.dates[START] = { active: true, prayers: [], tasbih: {} };
    expect(buildTodayVM(s, addDays(START, 2)).welcomeBack).toBe(false);
    expect(buildTodayVM(s, addDays(START, 3)).welcomeBack).toBe(true);
  });

  it('enters istiqamah after day 30 with a rotating hadith and no day', () => {
    const s = state();
    const today = addDays(START, 31);
    s.dates[today] = { active: true, prayers: [], tasbih: { morning_adhkar: 1 } };
    const vm = buildTodayVM(s, today);
    expect(vm.phase).toBe('istiqamah');
    expect(vm.day).toBeNull();
    expect(vm.istiqamah).not.toBeNull();
    expect(vm.istiqamah!.reflectionKey).toBe(31);
    expect(vm.istiqamah!.hadith).toBe(DAYS[31 % 30].hadith);
    expect(vm.istiqamah!.morningDone).toBe(true);
    expect(vm.istiqamah!.eveningDone).toBe(false);
    expect(vm.istiqamah!.journal).toBe('');

    s.planDays[planDayKey(1, istiqamahJournalDay(31))] = { completedTaskIds: [], journal: 'Steady' };
    expect(buildTodayVM(s, today).istiqamah!.journal).toBe('Steady');
  });

  it('shows Learn Salah for a beginner on day 1 only within the first week', () => {
    expect(buildTodayVM(state({ knowledgeLevel: 'beginner' }), START).showLearnSalah).toBe(true);
    expect(buildTodayVM(state({ knowledgeLevel: 'beginner' }), addDays(START, 7)).showLearnSalah).toBe(false);
    expect(buildTodayVM(state(), START).showLearnSalah).toBe(false);
  });

  it('returns no day (without crashing) when that day has no content yet', () => {
    const missing = DAYS.length + 1;
    if (missing > 30) return; // all content present
    const vm = buildTodayVM(state(), addDays(START, missing - 1));
    expect(vm.phase).toBe('journey');
    expect(vm.day).toBeNull();
    expect(vm.istiqamah).toBeNull();
  });
});

describe('buildDayVM', () => {
  it('keeps past days editable and future days read-only', () => {
    const s = state();
    const today = addDays(START, 2); // day 3
    const past = buildDayVM(s, 1, today)!;
    const future = buildDayVM(s, 5, today)!;
    expect(past.editable).toBe(true);
    expect(past.isFuture).toBe(false);
    expect(future.editable).toBe(false);
    expect(future.isFuture).toBe(true);
  });

  it('applies tasbih auto-completion only to the current plan day', () => {
    const s = state();
    const tasbihTask = DAYS[0].tasks.find((t) => t.tasbih && t.tasbih.length > 0)!;
    const today = addDays(START, 1);
    const full: Record<string, number> = {};
    tasbihTask.tasbih!.forEach((tg) => { full[tg.dhikrId] = tg.target; });
    s.dates[today] = { active: true, prayers: [], tasbih: full };
    const task = buildDayVM(s, 1, today)!.tasks.find((t) => t.id === tasbihTask.id)!;
    expect(task.done).toBe(false);
  });

  it('carries the journal and mood for that day', () => {
    const s = state();
    s.planDays[planDayKey(1, 1)] = { completedTaskIds: [], journal: 'Bismillah', mood: 'grateful' };
    const vm = buildDayVM(s, 1, START)!;
    expect(vm.journal).toBe('Bismillah');
    expect(vm.mood).toBe('grateful');
    expect(vm.cycle).toBe(1);
  });

  it('returns null for a day with no content', () => {
    expect(buildDayVM(state(), 99, START)).toBeNull();
  });
});

describe('day detail toggling', () => {
  it("writes the viewed day's log but marks today (not that day) active", () => {
    const today = addDays(START, 5);
    const store = createAppStore();
    store.getState().completeOnboarding(profile(), START);
    const id = DAYS[1].tasks[0].id;
    store.getState().toggleTask(2, id, today);
    const s = store.getState();
    expect(s.planDays[planDayKey(1, 2)].completedTaskIds).toEqual([id]);
    expect(s.dates[today].active).toBe(true);
    expect(s.dates[addDays(START, 1)]).toBeUndefined();
  });
});
