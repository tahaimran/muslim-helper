import { addDays } from '../day';
import { MILESTONE_IDS } from '../milestones';
import { initialState, type PersistedState } from '../model';
import { buildProgressVM } from '../view/progress';

const TODAY = '2026-10-20';

function withLog(s: PersistedState, date: string, prayers: PersistedState['dates'][string]['prayers'], active = true) {
  s.dates[date] = { active, prayers, tasbih: {} };
}

describe('buildProgressVM', () => {
  it('gives a 35-day heatmap ending today, oldest first', () => {
    const vm = buildProgressVM(initialState(), TODAY);
    expect(vm.heatmap).toHaveLength(35);
    expect(vm.heatmap[34].date).toBe(TODAY);
    expect(vm.heatmap[0].date).toBe(addDays(TODAY, -34));
    expect(vm.heatmap.every((c) => c.count === 0)).toBe(true);
  });

  it('counts prayers per day (0-5)', () => {
    const s = initialState();
    withLog(s, TODAY, ['fajr', 'dhuhr', 'asr']);
    withLog(s, addDays(TODAY, -1), ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']);
    const vm = buildProgressVM(s, TODAY);
    expect(vm.heatmap[34].count).toBe(3);
    expect(vm.heatmap[33].count).toBe(5);
  });

  it('prayersKept30 covers only the last 30 days', () => {
    const s = initialState();
    withLog(s, TODAY, ['fajr', 'dhuhr']);
    withLog(s, addDays(TODAY, -29), ['fajr']);
    withLog(s, addDays(TODAY, -30), ['fajr', 'isha']);
    expect(buildProgressVM(s, TODAY).prayersKept30).toBe(3);
  });

  it('counts days shown up and streak from active dates', () => {
    const s = initialState();
    withLog(s, TODAY, []);
    withLog(s, addDays(TODAY, -1), []);
    withLog(s, addDays(TODAY, -5), []);
    withLog(s, addDays(TODAY, -6), [], false);
    const vm = buildProgressVM(s, TODAY);
    expect(vm.daysShownUp).toBe(3);
    expect(vm.streak).toBe(2);
  });

  it('lists milestones in order with unlock dates', () => {
    const s = initialState();
    s.milestones = { week_one: '2026-10-10' };
    const vm = buildProgressVM(s, TODAY);
    expect(vm.milestones.map((m) => m.id)).toEqual([...MILESTONE_IDS]);
    expect(vm.milestones.find((m) => m.id === 'week_one')?.unlockedOn).toBe('2026-10-10');
    expect(vm.milestones.find((m) => m.id === 'first_step')?.unlockedOn).toBeNull();
  });
});
