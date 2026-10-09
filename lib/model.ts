import type { DateKey } from './day';
import type { ImprovementArea, KnowledgeLevel, MoodType, PracticeLevel, PrayerName } from './types';

export const PRACTICE_LEVELS: readonly PracticeLevel[] = ['none', 'some', 'most', 'all'];
export const KNOWLEDGE_LEVELS: readonly KnowledgeLevel[] = ['beginner', 'intermediate', 'advanced'];
export const IMPROVEMENT_AREAS: readonly ImprovementArea[] = [
  'prayer', 'quran', 'dhikr', 'fasting', 'character', 'family', 'knowledge', 'charity',
];
export const MOODS: readonly MoodType[] = ['grateful', 'peaceful', 'struggling', 'motivated', 'reflective'];
export const PRAYER_NAMES: readonly PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export type Lang = 'en' | 'ar' | 'ur' | 'id' | 'tr';

export type CalcMethodId =
  | 'MuslimWorldLeague' | 'Egyptian' | 'Karachi' | 'UmmAlQura' | 'Dubai'
  | 'MoonsightingCommittee' | 'NorthAmerica' | 'Kuwait' | 'Qatar'
  | 'Singapore' | 'Tehran' | 'Turkey';

export type MadhabId = 'shafi' | 'hanafi';

export interface Profile {
  name: string;
  prayerHabit: PracticeLevel;
  knowledgeLevel: KnowledgeLevel;
  focusAreas: ImprovementArea[];
  dailyMinutes: number;
}

export interface SavedLocation {
  latitude: number;
  longitude: number;
  label: string;
  countryCode: string | null;
}

export interface Settings {
  language: Lang | null; // null = follow device
  theme: 'system' | 'light' | 'dark';
  location: SavedLocation | null;
  calcMethod: CalcMethodId | null; // null = auto by country
  madhab: MadhabId | null; // null = auto by country
  reminders: { daily: boolean; dailyTime: string; prayers: boolean };
}

export interface PlanDayLog {
  completedTaskIds: string[];
  journal?: string;
  mood?: MoodType;
}

export interface DateLog {
  active: boolean;
  prayers: PrayerName[];
  tasbih: Record<string, number>;
}

export interface PersistedState {
  schema: 1;
  profile: Profile | null;
  settings: Settings;
  cycle: number;
  planStartDate: DateKey | null;
  planDays: Record<string, PlanDayLog>; // key: planDayKey(cycle, day)
  dates: Record<DateKey, DateLog>;
  milestones: Record<string, DateKey>; // id -> date unlocked
}

export const DEFAULT_SETTINGS: Settings = {
  language: null,
  theme: 'system',
  location: null,
  calcMethod: null,
  madhab: null,
  reminders: { daily: false, dailyTime: '20:00', prayers: false },
};

export function initialState(): PersistedState {
  return {
    schema: 1,
    profile: null,
    settings: { ...DEFAULT_SETTINGS, reminders: { ...DEFAULT_SETTINGS.reminders } },
    cycle: 1,
    planStartDate: null,
    planDays: {},
    dates: {},
    milestones: {},
  };
}

export function emptyDateLog(): DateLog {
  return { active: false, prayers: [], tasbih: {} };
}

export function planDayKey(cycle: number, day: number): string {
  return `${cycle}:${day}`;
}

export const CALC_METHODS: readonly CalcMethodId[] = [
  'MuslimWorldLeague', 'Egyptian', 'Karachi', 'UmmAlQura', 'Dubai', 'MoonsightingCommittee',
  'NorthAmerica', 'Kuwait', 'Qatar', 'Singapore', 'Tehran', 'Turkey',
];
