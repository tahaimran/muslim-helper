import { addDays, toDateKey, type DateKey } from './day';
import {
  IMPROVEMENT_AREAS, initialState, KNOWLEDGE_LEVELS, MOODS, planDayKey, PRACTICE_LEVELS, PRAYER_NAMES,
  type PersistedState, type Profile,
} from './model';
import type { ImprovementArea, KnowledgeLevel, MoodType, PracticeLevel, PrayerName } from './types';

export const LEGACY_NAFS_KEY = 'nafs_app_state';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

function parseStart(v: unknown, today: DateKey): DateKey {
  if (typeof v !== 'string') return today;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? today : toDateKey(d);
}

export function convertLegacyNafs(raw: unknown, today: DateKey): PersistedState | null {
  if (!isObj(raw) || raw.isOnboarded !== true) return null;
  const up = isObj(raw.userProfile) ? raw.userProfile : {};

  const profile: Profile = {
    name: typeof up.name === 'string' ? up.name : '',
    prayerHabit: oneOf(up.prayerConsistency, PRACTICE_LEVELS, 'some'),
    knowledgeLevel: oneOf(up.knowledgeLevel, KNOWLEDGE_LEVELS, 'beginner'),
    focusAreas: strings(up.improvementAreas).filter((a): a is ImprovementArea => IMPROVEMENT_AREAS.includes(a as ImprovementArea)),
    dailyMinutes: typeof up.dailyMinutes === 'number' && up.dailyMinutes > 0 ? up.dailyMinutes : 30,
  };

  const state = initialState();
  state.profile = profile;
  const originalStart = parseStart(up.planStartDate, today);
  state.planStartDate = originalStart;
  let maxProgressDay = 0;

  const progress = isObj(raw.dayProgress) ? raw.dayProgress : {};
  for (const [key, value] of Object.entries(progress)) {
    const day = Number(key);
    if (!Number.isInteger(day) || day < 1 || day > 30 || !isObj(value)) continue;
    if (!Array.isArray(value.completedTaskIds)) continue;

    const completedTaskIds = strings(value.completedTaskIds);
    const journal = typeof value.journalEntry === 'string' ? value.journalEntry : undefined;
    const mood = MOODS.includes(value.mood as MoodType) ? (value.mood as MoodType) : undefined;
    state.planDays[planDayKey(1, day)] = {
      completedTaskIds,
      ...(journal !== undefined ? { journal } : {}),
      ...(mood !== undefined ? { mood } : {}),
    };

    if (completedTaskIds.length > 0 && day > maxProgressDay) maxProgressDay = day;

    const prayers = strings(value.prayersCompleted).filter((p): p is PrayerName => PRAYER_NAMES.includes(p as PrayerName));
    const active = completedTaskIds.length > 0 || prayers.length > 0 || (journal ?? '').trim().length > 0;
    if (active || prayers.length > 0) {
      state.dates[addDays(originalStart, day - 1)] = { active, prayers, tasbih: {} };
    }
  }
  // Resume after the user's real progress instead of landing on a late day.
  state.planStartDate = addDays(today, -Math.min(maxProgressDay, 29));
  return state;
}
