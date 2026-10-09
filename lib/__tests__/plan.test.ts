import { personalizeTasks, shouldShowLearnSalah, taskLimit } from '../plan';
import type { Profile } from '../model';
import type { DayTask } from '../types';

const tasks: DayTask[] = [
  { id: '1_fajr', title: 'Pray Fajr with all Sunnah prayers', titleBeginner: 'Pray Fajr', titleAdvanced: 'Pray Fajr + 2 sunnah + adhkar', category: 'prayer', points: 0 },
  { id: '1_bismillah', title: 'Bismillah', category: 'sunnah', points: 0 },
  { id: '1_fatihah', title: 'Fatihah', category: 'quran', points: 0 },
  { id: '1_secret', title: 'Secret deed', category: 'character', points: 0 },
  { id: '1_dhikr', title: 'Evening dhikr', category: 'dhikr', points: 0 },
  { id: '1_reflect', title: 'Reflect', category: 'reflection', points: 0 },
];

const profile = (p: Partial<Profile> = {}): Profile => ({
  name: 'Ali', prayerHabit: 'most', knowledgeLevel: 'intermediate',
  focusAreas: [], dailyMinutes: 60, ...p,
});

describe('taskLimit', () => {
  it('scales with daily minutes', () => {
    expect(taskLimit(5)).toBe(3);
    expect(taskLimit(15)).toBe(4);
    expect(taskLimit(29)).toBe(4);
    expect(taskLimit(30)).toBe(6);
  });
});

describe('personalizeTasks', () => {
  it('keeps all tasks and original order when time allows and no focus', () => {
    expect(personalizeTasks(tasks, profile(), 1).map((t) => t.id)).toEqual(tasks.map((t) => t.id));
  });
  it('puts prayer first, then focus areas, preserving relative order', () => {
    const ids = personalizeTasks(tasks, profile({ focusAreas: ['dhikr', 'quran'] }), 1).map((t) => t.id);
    expect(ids).toEqual(['1_fajr', '1_fatihah', '1_dhikr', '1_bismillah', '1_secret', '1_reflect']);
  });
  it('trims to the time limit', () => {
    expect(personalizeTasks(tasks, profile({ dailyMinutes: 10 }), 1)).toHaveLength(3);
  });
  it('never drops prayer tasks even below the limit', () => {
    const many: DayTask[] = [
      { id: 'a', title: 'A', category: 'prayer', points: 0 },
      { id: 'b', title: 'B', category: 'prayer', points: 0 },
      { id: 'c', title: 'C', category: 'prayer', points: 0 },
      { id: 'd', title: 'D', category: 'prayer', points: 0 },
      { id: 'e', title: 'E', category: 'quran', points: 0 },
    ];
    const ids = personalizeTasks(many, profile({ dailyMinutes: 5 }), 1).map((t) => t.id);
    expect(ids).toEqual(['a', 'b', 'c', 'd']);
  });
  it('uses beginner titles for beginners in cycle 1', () => {
    expect(personalizeTasks(tasks, profile({ knowledgeLevel: 'beginner' }), 1)[0].title).toBe('Pray Fajr');
  });
  it('uses advanced titles from cycle 2', () => {
    expect(personalizeTasks(tasks, profile({ knowledgeLevel: 'beginner' }), 2)[0].title).toBe('Pray Fajr + 2 sunnah + adhkar');
  });
  it('falls back to the base title when a variant is missing', () => {
    expect(personalizeTasks(tasks, profile({ knowledgeLevel: 'beginner' }), 1)[1].title).toBe('Bismillah');
  });
});

describe('shouldShowLearnSalah', () => {
  it('shows for beginners or low prayer habit in the first week of cycle 1', () => {
    expect(shouldShowLearnSalah(profile({ knowledgeLevel: 'beginner' }), 1, 1)).toBe(true);
    expect(shouldShowLearnSalah(profile({ prayerHabit: 'none' }), 7, 1)).toBe(true);
    expect(shouldShowLearnSalah(profile({ prayerHabit: 'some' }), 3, 1)).toBe(true);
  });
  it('hides after day 7, in later cycles, or for practicing users', () => {
    expect(shouldShowLearnSalah(profile({ knowledgeLevel: 'beginner' }), 8, 1)).toBe(false);
    expect(shouldShowLearnSalah(profile({ knowledgeLevel: 'beginner' }), 1, 2)).toBe(false);
    expect(shouldShowLearnSalah(profile(), 1, 1)).toBe(false);
  });
});
