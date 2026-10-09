import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAppStore, getPersisted, importLegacyIfNeeded, STORE_KEY, waitForHydration } from '../store';
import { LEGACY_NAFS_KEY } from '../legacy';
import { DEFAULT_SETTINGS, type Profile } from '../model';

const profile: Profile = { name: 'Yusuf', prayerHabit: 'some', knowledgeLevel: 'beginner', focusAreas: ['prayer'], dailyMinutes: 20 };
const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('app store', () => {
  it('completes onboarding with a plan start date', () => {
    const store = createAppStore();
    store.getState().completeOnboarding(profile, '2026-10-09');
    const s = store.getState();
    expect(s.profile).toEqual(profile);
    expect(s.planStartDate).toBe('2026-10-09');
    expect(s.cycle).toBe(1);
  });

  it('toggles tasks per cycle/day and marks the date active', () => {
    const store = createAppStore();
    store.getState().completeOnboarding(profile, '2026-10-09');
    store.getState().toggleTask(1, '1_fajr', '2026-10-09');
    expect(store.getState().planDays['1:1'].completedTaskIds).toEqual(['1_fajr']);
    expect(store.getState().dates['2026-10-09'].active).toBe(true);
    store.getState().toggleTask(1, '1_fajr', '2026-10-09');
    expect(store.getState().planDays['1:1'].completedTaskIds).toEqual([]);
    expect(store.getState().dates['2026-10-09'].active).toBe(true); // unchecking never clears activity
  });

  it('toggles prayers on a date', () => {
    const store = createAppStore();
    store.getState().togglePrayer('2026-10-09', 'fajr');
    expect(store.getState().dates['2026-10-09']).toEqual({ active: true, prayers: ['fajr'], tasbih: {} });
    store.getState().togglePrayer('2026-10-09', 'fajr');
    expect(store.getState().dates['2026-10-09'].prayers).toEqual([]);
  });

  it('saves journal and mood; blank journal does not mark activity', () => {
    const store = createAppStore();
    store.getState().setJournal(2, '   ', '2026-10-09');
    expect(store.getState().dates['2026-10-09']).toBeUndefined();
    store.getState().setJournal(2, 'Alhamdulillah', '2026-10-09');
    store.getState().setMood(2, 'peaceful');
    expect(store.getState().planDays['1:2']).toEqual({ completedTaskIds: [], journal: 'Alhamdulillah', mood: 'peaceful' });
    store.getState().setMood(2, null);
    expect(store.getState().planDays['1:2'].mood).toBeUndefined();
  });

  it('counts and resets tasbih', () => {
    const store = createAppStore();
    store.getState().incrementTasbih('2026-10-09', 'subhanallah');
    store.getState().incrementTasbih('2026-10-09', 'subhanallah', 32);
    expect(store.getState().dates['2026-10-09'].tasbih.subhanallah).toBe(33);
    store.getState().resetTasbih('2026-10-09', 'subhanallah');
    expect(store.getState().dates['2026-10-09'].tasbih.subhanallah).toBe(0);
  });

  it('starts the next cycle without losing history', () => {
    const store = createAppStore();
    store.getState().completeOnboarding(profile, '2026-09-01');
    store.getState().toggleTask(1, '1_fajr', '2026-09-01');
    store.getState().startNextCycle('2026-10-09');
    const s = store.getState();
    expect(s.cycle).toBe(2);
    expect(s.planStartDate).toBe('2026-10-09');
    expect(s.planDays['1:1'].completedTaskIds).toEqual(['1_fajr']);
  });

  it('unlocks milestones once, keeping the first date', () => {
    const store = createAppStore();
    store.getState().unlockMilestones(['first_step'], '2026-10-01');
    store.getState().unlockMilestones(['first_step', 'three_days'], '2026-10-09');
    expect(store.getState().milestones).toEqual({ first_step: '2026-10-01', three_days: '2026-10-09' });
  });

  it('merges settings and keeps language/theme on reset', () => {
    const store = createAppStore();
    store.getState().completeOnboarding(profile, '2026-10-09');
    store.getState().updateSettings({ language: 'ur', theme: 'dark', calcMethod: 'Karachi' });
    store.getState().resetAll();
    const s = store.getState();
    expect(s.profile).toBeNull();
    expect(s.settings.language).toBe('ur');
    expect(s.settings.theme).toBe('dark');
    expect(s.settings.calcMethod).toBeNull();
  });

  it('persists to AsyncStorage and rehydrates', async () => {
    const a = createAppStore();
    a.getState().completeOnboarding(profile, '2026-10-09');
    await flush();
    expect(await AsyncStorage.getItem(STORE_KEY)).toContain('Yusuf');
    const b = createAppStore();
    await b.persist.rehydrate();
    expect(b.getState().profile?.name).toBe('Yusuf');
    expect(getPersisted(b.getState())).not.toHaveProperty('toggleTask');
  });

  it('imports legacy Nafs data once when no profile exists', async () => {
    await AsyncStorage.setItem(LEGACY_NAFS_KEY, JSON.stringify({
      isOnboarded: true,
      userProfile: { name: 'Old', planStartDate: '2026-09-01T00:00:00.000Z' },
      dayProgress: { 1: { completedTaskIds: ['1_fajr'] } },
    }));
    const store = createAppStore();
    await store.persist.rehydrate();
    expect(await importLegacyIfNeeded(store, '2026-10-09')).toBe(true);
    expect(store.getState().profile?.name).toBe('Old');
    expect(await importLegacyIfNeeded(store, '2026-10-09')).toBe(false);
  });

  it('does not import legacy data over an existing profile', async () => {
    await AsyncStorage.setItem(LEGACY_NAFS_KEY, JSON.stringify({ isOnboarded: true, userProfile: { name: 'Old' } }));
    const store = createAppStore();
    store.getState().completeOnboarding(profile, '2026-10-09');
    expect(await importLegacyIfNeeded(store, '2026-10-09')).toBe(false);
    expect(store.getState().profile?.name).toBe('Yusuf');
  });

  it('waits for hydration before the legacy guard, keeping a persisted profile', async () => {
    const seeded = createAppStore();
    seeded.getState().completeOnboarding(profile, '2026-10-09');
    await flush();
    await AsyncStorage.setItem(LEGACY_NAFS_KEY, JSON.stringify({ isOnboarded: true, userProfile: { name: 'Old' } }));
    const store = createAppStore();
    expect(await importLegacyIfNeeded(store, '2026-10-09')).toBe(false);
    expect(store.getState().profile?.name).toBe('Yusuf');
  });

  it('fills missing persisted settings (e.g. reminders) with defaults on rehydrate', async () => {
    await AsyncStorage.setItem(STORE_KEY, JSON.stringify({
      state: { profile, settings: { language: 'ur' } },
      version: 1,
    }));
    const store = createAppStore();
    await store.persist.rehydrate();
    const s = store.getState().settings;
    expect(s.language).toBe('ur');
    expect(s.reminders).toEqual(DEFAULT_SETTINGS.reminders);
    expect(s.theme).toBe(DEFAULT_SETTINGS.theme);
  });

  it('waitForHydration resolves true once hydrated', async () => {
    const store = createAppStore();
    expect(await waitForHydration(store)).toBe(true);
    expect(await waitForHydration(store)).toBe(true);
  });

  it('waitForHydration resolves false on timeout when hydration never finishes', async () => {
    const never = { getItem: () => new Promise<string | null>(() => {}), setItem: async () => {}, removeItem: async () => {} };
    const store = createAppStore(never);
    expect(await waitForHydration(store, 10)).toBe(false);
  });

  it('importLegacyIfNeeded does not import when hydration times out', async () => {
    const never = { getItem: () => new Promise<string | null>(() => {}), setItem: async () => {}, removeItem: async () => {} };
    const store = createAppStore(never);
    expect(await importLegacyIfNeeded(store, '2026-10-09', 10)).toBe(false);
  });
});
