import { buildProfile, canAdvance, clampMinutes, toggleFocusArea, type OnboardingDraft } from '../onboarding';

const full: OnboardingDraft = {
  name: '  Amina ', prayerHabit: 'some', knowledgeLevel: 'beginner', focusAreas: ['prayer'], dailyMinutes: 10,
};

describe('clampMinutes', () => {
  it('clamps to integer 5..120', () => {
    expect(clampMinutes(1)).toBe(5);
    expect(clampMinutes(500)).toBe(120);
    expect(clampMinutes(12.6)).toBe(13);
    expect(clampMinutes(NaN)).toBe(5);
    expect(clampMinutes(30)).toBe(30);
  });
});

describe('toggleFocusArea', () => {
  it('adds, removes and caps at three', () => {
    expect(toggleFocusArea([], 'quran')).toEqual(['quran']);
    expect(toggleFocusArea(['quran'], 'quran')).toEqual([]);
    expect(toggleFocusArea(['quran', 'dhikr', 'family'], 'charity')).toEqual(['quran', 'dhikr', 'family']);
    expect(toggleFocusArea(['quran', 'dhikr', 'family'], 'dhikr')).toEqual(['quran', 'family']);
  });
});

describe('canAdvance', () => {
  const empty: OnboardingDraft = { name: '', prayerHabit: null, knowledgeLevel: null, focusAreas: [], dailyMinutes: null };
  it('allows optional steps', () => {
    for (const s of ['welcome', 'language', 'name', 'intention'] as const) expect(canAdvance(s, empty)).toBe(true);
  });
  it('requires answers on required steps', () => {
    expect(canAdvance('habit', empty)).toBe(false);
    expect(canAdvance('knowledge', empty)).toBe(false);
    expect(canAdvance('focus', empty)).toBe(false);
    expect(canAdvance('time', empty)).toBe(false);
    expect(canAdvance('habit', full)).toBe(true);
    expect(canAdvance('focus', full)).toBe(true);
    expect(canAdvance('time', full)).toBe(true);
  });
});

describe('buildProfile', () => {
  it('trims the name and clamps minutes', () => {
    expect(buildProfile({ ...full, dailyMinutes: 999 })).toEqual({
      name: 'Amina', prayerHabit: 'some', knowledgeLevel: 'beginner', focusAreas: ['prayer'], dailyMinutes: 120,
    });
  });
  it('returns null when answers are missing', () => {
    expect(buildProfile({ ...full, prayerHabit: null })).toBeNull();
    expect(buildProfile({ ...full, dailyMinutes: null })).toBeNull();
    expect(buildProfile({ ...full, focusAreas: [] })).toBeNull();
  });
});
