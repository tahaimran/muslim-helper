import type { Profile } from './model';
import type { DayTask, ImprovementArea } from './types';

const FOCUS_TO_CATEGORY: Record<ImprovementArea, DayTask['category']> = {
  prayer: 'prayer',
  quran: 'quran',
  dhikr: 'dhikr',
  fasting: 'sunnah',
  character: 'character',
  family: 'character',
  charity: 'character',
  knowledge: 'reflection',
};

export function taskLimit(dailyMinutes: number): number {
  if (dailyMinutes < 15) return 3;
  if (dailyMinutes < 30) return 4;
  return 6;
}

export function personalizeTasks(tasks: DayTask[], profile: Profile, cycle: number): DayTask[] {
  const focus = new Set(profile.focusAreas.map((a) => FOCUS_TO_CATEGORY[a]));
  const rank = (t: DayTask) => (t.category === 'prayer' ? 0 : focus.has(t.category) ? 1 : 2);

  const ordered = tasks
    .map((task, index) => ({ task, index }))
    .sort((a, b) => rank(a.task) - rank(b.task) || a.index - b.index)
    .map((x) => x.task);

  const prayerCount = ordered.filter((t) => t.category === 'prayer').length;
  const limit = Math.max(taskLimit(profile.dailyMinutes), prayerCount);

  return ordered.slice(0, limit).map((t) => {
    if (cycle >= 2) return { ...t, title: t.titleAdvanced ?? t.title };
    if (profile.knowledgeLevel === 'beginner') return { ...t, title: t.titleBeginner ?? t.title };
    return t;
  });
}

export function shouldShowLearnSalah(profile: Profile, day: number, cycle: number): boolean {
  if (cycle !== 1 || day > 7) return false;
  return (
    profile.knowledgeLevel === 'beginner' ||
    profile.prayerHabit === 'none' ||
    profile.prayerHabit === 'some'
  );
}
