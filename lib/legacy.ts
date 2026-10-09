import { addDays, toDateKey, type DateKey } from './day';
import { initialState, planDayKey, type PersistedState, type Profile } from './model';
import type { ImprovementArea, KnowledgeLevel, MoodType, PracticeLevel, PrayerName } from './types';

export const LEGACY_NAFS_KEY = 'nafs_app_state';

const PRACTICE: PracticeLevel[] = ['none', 'some', 'most', 'all'];
const KNOWLEDGE: KnowledgeLevel[] = ['beginner', 'intermediate', 'advanced'];
const AREAS: ImprovementArea[] = ['prayer', 'quran', 'dhikr', 'fasting', 'character', 'family', 'knowledge', 'charity'];
const MOODS: MoodType[] = ['grateful', 'peaceful', 'struggling', 'motivated', 'reflective'];
const PRAYERS: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const oneOf = <T extends string>(v: unknown, allowed: T[], fallback: T): T =>
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
    prayerHabit: oneOf(up.prayerConsistency, PRACTICE, 'some'),
    knowledgeLevel: oneOf(up.knowledgeLevel, KNOWLEDGE, 'beginner'),
    focusAreas: strings(up.improvementAreas).filter((a): a is ImprovementArea => AREAS.includes(a as ImprovementArea)),
    dailyMinutes: typeof up.dailyMinutes === 'number' && up.dailyMinutes > 0 ? up.dailyMinutes : 30,
  };

  const state = initialState();
  state.profile = profile;
  state.planStartDate = parseStart(up.planStartDate, today);

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

    const prayers = strings(value.prayersCompleted).filter((p): p is PrayerName => PRAYERS.includes(p as PrayerName));
    const active = completedTaskIds.length > 0 || prayers.length > 0 || (journal ?? '').trim().length > 0;
    if (active || prayers.length > 0) {
      state.dates[addDays(state.planStartDate, day - 1)] = { active, prayers, tasbih: {} };
    }
  }
  return state;
}
