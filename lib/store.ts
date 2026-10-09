import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { toDateKey, type DateKey } from './day';
import { convertLegacyNafs, LEGACY_NAFS_KEY } from './legacy';
import type { MilestoneId } from './milestones';
import {
  emptyDateLog, initialState, planDayKey,
  type DateLog, type PersistedState, type PlanDayLog, type Profile, type Settings,
} from './model';
import type { MoodType, PrayerName } from './types';

export const STORE_KEY = 'awdah_state';

export interface AppActions {
  completeOnboarding(profile: Profile, today: DateKey): void;
  toggleTask(day: number, taskId: string, today: DateKey): void;
  togglePrayer(date: DateKey, prayer: PrayerName): void;
  setJournal(day: number, text: string, today: DateKey): void;
  setMood(day: number, mood: MoodType | null): void;
  incrementTasbih(date: DateKey, dhikrId: string, by?: number): void;
  resetTasbih(date: DateKey, dhikrId: string): void;
  updateProfile(partial: Partial<Profile>): void;
  updateSettings(partial: Partial<Settings>): void;
  startNextCycle(today: DateKey): void;
  unlockMilestones(ids: MilestoneId[], today: DateKey): void;
  replaceAll(data: PersistedState): void;
  resetAll(): void;
}

export type AppStore = PersistedState & AppActions;

const PERSISTED_KEYS: (keyof PersistedState)[] = [
  'schema', 'profile', 'settings', 'cycle', 'planStartDate', 'planDays', 'dates', 'milestones',
];

export function getPersisted(s: AppStore): PersistedState {
  const out: Record<string, unknown> = {};
  for (const k of PERSISTED_KEYS) out[k] = s[k];
  return out as unknown as PersistedState;
}

function withDate(
  dates: Record<DateKey, DateLog>,
  key: DateKey,
  change: (log: DateLog) => DateLog
): Record<DateKey, DateLog> {
  return { ...dates, [key]: change(dates[key] ?? emptyDateLog()) };
}

const markActive = (log: DateLog): DateLog => ({ ...log, active: true });

export function createAppStore() {
  return createStore<AppStore>()(
    persist(
      (set) => {
        const updateDay = (s: AppStore, day: number, change: (log: PlanDayLog) => PlanDayLog) => {
          const key = planDayKey(s.cycle, day);
          return { ...s.planDays, [key]: change(s.planDays[key] ?? { completedTaskIds: [] }) };
        };

        return {
          ...initialState(),

          completeOnboarding: (profile, today) => set({ profile, planStartDate: today, cycle: 1 }),

          toggleTask: (day, taskId, today) =>
            set((s) => {
              const done = (s.planDays[planDayKey(s.cycle, day)]?.completedTaskIds ?? []).includes(taskId);
              return {
                planDays: updateDay(s, day, (log) => ({
                  ...log,
                  completedTaskIds: done
                    ? log.completedTaskIds.filter((id) => id !== taskId)
                    : [...log.completedTaskIds, taskId],
                })),
                dates: done ? s.dates : withDate(s.dates, today, markActive),
              };
            }),

          togglePrayer: (date, prayer) =>
            set((s) => ({
              dates: withDate(s.dates, date, (log) =>
                log.prayers.includes(prayer)
                  ? { ...log, prayers: log.prayers.filter((p) => p !== prayer) }
                  : { ...log, active: true, prayers: [...log.prayers, prayer] }
              ),
            })),

          setJournal: (day, text, today) =>
            set((s) => ({
              planDays: updateDay(s, day, (log) => ({ ...log, journal: text })),
              dates: text.trim().length > 0 ? withDate(s.dates, today, markActive) : s.dates,
            })),

          setMood: (day, mood) =>
            set((s) => ({
              planDays: updateDay(s, day, (log) => {
                const next: PlanDayLog = { ...log };
                if (mood) next.mood = mood;
                else delete next.mood;
                return next;
              }),
            })),

          incrementTasbih: (date, dhikrId, by = 1) =>
            set((s) => ({
              dates: withDate(s.dates, date, (log) => ({
                ...log,
                active: true,
                tasbih: { ...log.tasbih, [dhikrId]: (log.tasbih[dhikrId] ?? 0) + by },
              })),
            })),

          resetTasbih: (date, dhikrId) =>
            set((s) => ({
              dates: withDate(s.dates, date, (log) => ({ ...log, tasbih: { ...log.tasbih, [dhikrId]: 0 } })),
            })),

          updateProfile: (partial) =>
            set((s) => (s.profile ? { profile: { ...s.profile, ...partial } } : {})),

          updateSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),

          startNextCycle: (today) => set((s) => ({ cycle: s.cycle + 1, planStartDate: today })),

          unlockMilestones: (ids, today) =>
            set((s) => {
              const milestones = { ...s.milestones };
              for (const id of ids) if (!milestones[id]) milestones[id] = today;
              return { milestones };
            }),

          replaceAll: (data) => set({ ...data }),

          resetAll: () =>
            set((s) => {
              const fresh = initialState();
              fresh.settings.language = s.settings.language;
              fresh.settings.theme = s.settings.theme;
              return fresh;
            }),
        };
      },
      {
        name: STORE_KEY,
        version: 1,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (s) => getPersisted(s),
      }
    )
  );
}

export const appStore = createAppStore();

export function useAppStore<T>(selector: (s: AppStore) => T): T {
  return useStore(appStore, selector);
}

export async function importLegacyIfNeeded(
  store: ReturnType<typeof createAppStore> = appStore,
  today: DateKey = toDateKey(new Date())
): Promise<boolean> {
  if (store.getState().profile) return false;
  try {
    const raw = await AsyncStorage.getItem(LEGACY_NAFS_KEY);
    if (!raw) return false;
    const converted = convertLegacyNafs(JSON.parse(raw), today);
    if (!converted) return false;
    store.getState().replaceAll(converted);
    await AsyncStorage.removeItem(LEGACY_NAFS_KEY);
    return true;
  } catch {
    return false;
  }
}
