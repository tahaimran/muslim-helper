import { convertLegacyNafs } from '../legacy';

const legacy = {
  isOnboarded: true,
  userProfile: {
    name: 'Aisha', age: 20, gender: 'female', knowledgeLevel: 'beginner',
    prayerConsistency: 'some', improvementAreas: ['prayer', 'quran'], dailyMinutes: 20,
    personalGoal: 'x', challenges: 'y', commitmentLevel: 3,
    createdAt: '2026-09-01T10:00:00.000Z', planStartDate: '2026-09-01T10:00:00.000Z',
  },
  currentDay: 1,
  dayProgress: {
    1: { day: 1, completedTaskIds: ['1_fajr', '1_fatihah'], journalEntry: 'my niyyah', mood: 'grateful', prayersCompleted: ['fajr', 'dhuhr'] },
  },
  totalPoints: 35, streakDays: 1, lastActiveDate: 'Tue Sep 01 2026',
};

describe('convertLegacyNafs', () => {
  it('maps profile, plan days, prayers and activity', () => {
    const s = convertLegacyNafs(legacy, '2026-10-09')!;
    expect(s.profile).toEqual({
      name: 'Aisha', prayerHabit: 'some', knowledgeLevel: 'beginner',
      focusAreas: ['prayer', 'quran'], dailyMinutes: 20,
    });
    expect(s.planStartDate).toBe('2026-09-01');
    expect(s.planDays['1:1']).toEqual({ completedTaskIds: ['1_fajr', '1_fatihah'], journal: 'my niyyah', mood: 'grateful' });
    expect(s.dates['2026-09-01']).toEqual({ active: true, prayers: ['fajr', 'dhuhr'], tasbih: {} });
    expect(s.cycle).toBe(1);
  });
  it('returns null for non-onboarded or garbage input', () => {
    expect(convertLegacyNafs(null, '2026-10-09')).toBeNull();
    expect(convertLegacyNafs('hello', '2026-10-09')).toBeNull();
    expect(convertLegacyNafs({ isOnboarded: false }, '2026-10-09')).toBeNull();
  });
  it('survives missing fields', () => {
    const s = convertLegacyNafs({ isOnboarded: true, dayProgress: { x: {}, 2: { completedTaskIds: 'bad' } } }, '2026-10-09')!;
    expect(s.planStartDate).toBe('2026-10-09');
    expect(s.profile?.name).toBe('');
    expect(s.profile?.dailyMinutes).toBe(30);
    expect(Object.keys(s.planDays)).toEqual([]);
  });
});
