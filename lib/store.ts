import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { toDateKey, type DateKey } from './day';
import { convertLegacyNafs, LEGACY_NAFS_KEY } from './legacy';
import type { MilestoneId } from './milestones';
import {
  DEFAULT_SETTINGS, emptyDateLog, initialState, planDayKey,
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

type AppStorage = Parameters<typeof createJSONStorage>[0] extends () => infer R ? R : never;

export function createAppStore(storage: AppStorage = AsyncStorage) {
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
        storage: createJSONStorage(() => storage),
        // Every future version bump needs a real migration here.
        migrate: (persisted) => persisted as PersistedState,
        partialize: (s) => getPersisted(s),
        merge: (persisted, current) => {
          const p = (persisted ?? {}) as Partial<PersistedState>;
          const ps: Partial<Settings> = p.settings ?? {};
          return {
            ...current,
            ...p,
            settings: {
              ...DEFAULT_SETTINGS,
              ...ps,
              reminders: { ...DEFAULT_SETTINGS.reminders, ...(ps.reminders ?? {}) },
            },
          };
        },
      }
    )
  );
}

export const appStore = createAppStore();

export function useAppStore<T>(selector: (s: AppStore) => T): T {
  return useStore(appStore, selector);
}

export function waitForHydration(
  store: ReturnType<typeof createAppStore> = appStore,
  timeoutMs = 4000
): Promise<boolean> {
  if (store.persist.hasHydrated()) return Promise.resolve(true);
  return new Promise<boolean>((resolve) => {
    let unsub = () => {};
    const timer = setTimeout(() => {
      unsub();
      resolve(false);
    }, timeoutMs);
    unsub = store.persist.onFinishHydration(() => {
      clearTimeout(timer);
      unsub();
      resolve(true);
    });
    if (store.persist.hasHydrated()) {
      clearTimeout(timer);
      unsub();
      resolve(true);
    }
  });
}

export async function importLegacyIfNeeded(
  store: ReturnType<typeof createAppStore> = appStore,
  today: DateKey = toDateKey(new Date()),
  hydrationTimeoutMs = 4000
): Promise<boolean> {
  if (!(await waitForHydration(store, hydrationTimeoutMs))) return false;
  if (store.getState().profile) return false;
  let converted: PersistedState | null;
  try {
    const raw = await AsyncStorage.getItem(LEGACY_NAFS_KEY);
    if (!raw) return false;
    converted = convertLegacyNafs(JSON.parse(raw), today);
  } catch {
    return false;
  }
  if (!converted) return false;
  store.getState().replaceAll(converted);
  try {
    await AsyncStorage.removeItem(LEGACY_NAFS_KEY);
  } catch {
    // best-effort cleanup; import already applied
  }
  return true;
}

/**
 * Resolve once the current state has been written to storage. Zustand persists
 * asynchronously after setState, so callers about to reload the JS bundle write the
 * snapshot explicitly through the store's own storage (same key, version and shape).
 */
export async function flushPersist(store: typeof appStore = appStore): Promise<void> {
  const opts = store.persist.getOptions();
  await opts.storage?.setItem(STORE_KEY, { state: getPersisted(store.getState()), version: opts.version });
}
