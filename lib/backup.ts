import type { DateKey } from './day';
import { convertLegacyNafs } from './legacy';
import {
  DEFAULT_SETTINGS,
  initialState,
  IMPROVEMENT_AREAS,
  KNOWLEDGE_LEVELS,
  MOODS,
  PRACTICE_LEVELS,
  PRAYER_NAMES,
  type CalcMethodId,
  type DateLog,
  type MadhabId,
  type Lang,
  type PersistedState,
  type PlanDayLog,
  type Profile,
  type SavedLocation,
  type Settings,
} from './model';
import type { ImprovementArea, KnowledgeLevel, MoodType, PracticeLevel, PrayerName } from './types';

export type BackupError = 'invalid_json' | 'not_awdah' | 'unsupported_version' | 'invalid_shape';
export type BackupResult = { ok: true; data: PersistedState } | { ok: false; error: BackupError };

const LANGS: Lang[] = ['en', 'ar', 'ur', 'id', 'tr'];
const THEMES: Settings['theme'][] = ['system', 'light', 'dark'];
const CALC_METHODS: CalcMethodId[] = [
  'MuslimWorldLeague', 'Egyptian', 'Karachi', 'UmmAlQura', 'Dubai',
  'MoonsightingCommittee', 'NorthAmerica', 'Kuwait', 'Qatar',
  'Singapore', 'Tehran', 'Turkey',
];
const MADHABS: MadhabId[] = ['shafi', 'hanafi'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PLAN_RE = /^\d+:\d+$/;
const TIME_RE = /^\d{2}:\d{2}$/;

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const oneOf = <T extends string>(v: unknown, allowed: readonly T[]): T | undefined =>
  allowed.find((a) => a === v);
const str = (v: unknown, fallback: string): string => (typeof v === 'string' ? v : fallback);
const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback);
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

export function serializeBackup(state: PersistedState, now: Date): string {
  return JSON.stringify({ app: 'awdah', schema: 1, exportedAt: now.toISOString(), data: state }, null, 2);
}

function normalizeProfile(v: unknown): Profile | null {
  if (!isObj(v)) return null;
  const areas = Array.isArray(v.focusAreas)
    ? [...new Set(v.focusAreas.filter((a): a is ImprovementArea => IMPROVEMENT_AREAS.includes(a)))]
    : [];
  return {
    name: str(v.name, ''),
    prayerHabit: oneOf(v.prayerHabit, PRACTICE_LEVELS) ?? 'some',
    knowledgeLevel: oneOf(v.knowledgeLevel, KNOWLEDGE_LEVELS) ?? 'beginner',
    focusAreas: areas,
    dailyMinutes: finite(v.dailyMinutes) && v.dailyMinutes > 0 ? v.dailyMinutes : 30,
  };
}

function normalizeLocation(v: unknown): SavedLocation | null {
  if (!isObj(v) || !finite(v.latitude) || !finite(v.longitude)) return null;
  return {
    latitude: v.latitude,
    longitude: v.longitude,
    label: str(v.label, ''),
    countryCode: typeof v.countryCode === 'string' ? v.countryCode : null,
  };
}

function normalizeSettings(v: unknown): Settings {
  const s = isObj(v) ? v : {};
  const r = isObj(s.reminders) ? s.reminders : {};
  const d = DEFAULT_SETTINGS;
  return {
    language: oneOf(s.language, LANGS) ?? null,
    theme: oneOf(s.theme, THEMES) ?? d.theme,
    location: normalizeLocation(s.location),
    calcMethod: oneOf(s.calcMethod, CALC_METHODS) ?? null,
    madhab: oneOf(s.madhab, MADHABS) ?? null,
    reminders: {
      daily: bool(r.daily, d.reminders.daily),
      dailyTime: typeof r.dailyTime === 'string' && TIME_RE.test(r.dailyTime) ? r.dailyTime : d.reminders.dailyTime,
      prayers: bool(r.prayers, d.reminders.prayers),
    },
  };
}

function normalizePlanDays(v: unknown): Record<string, PlanDayLog> {
  const out: Record<string, PlanDayLog> = {};
  if (!isObj(v)) return out;
  for (const [key, raw] of Object.entries(v)) {
    if (!PLAN_RE.test(key) || !isObj(raw) || !Array.isArray(raw.completedTaskIds)) continue;
    const log: PlanDayLog = { completedTaskIds: strings(raw.completedTaskIds) };
    if (typeof raw.journal === 'string') log.journal = raw.journal;
    const mood = oneOf(raw.mood, MOODS);
    if (mood) log.mood = mood;
    out[key] = log;
  }
  return out;
}

function normalizeDates(v: unknown): Record<DateKey, DateLog> {
  const out: Record<DateKey, DateLog> = {};
  if (!isObj(v)) return out;
  for (const [key, raw] of Object.entries(v)) {
    if (!DATE_RE.test(key) || !isObj(raw)) continue;
    const prayers = Array.isArray(raw.prayers)
      ? [...new Set(raw.prayers.filter((p): p is PrayerName => PRAYER_NAMES.includes(p)))]
      : [];
    const tasbih: Record<string, number> = {};
    if (isObj(raw.tasbih)) {
      for (const [name, count] of Object.entries(raw.tasbih)) {
        if (finite(count) && count >= 0) tasbih[name] = count;
      }
    }
    out[key] = { active: bool(raw.active, false), prayers, tasbih };
  }
  return out;
}

function normalizeMilestones(v: unknown): Record<string, DateKey> {
  const out: Record<string, DateKey> = {};
  if (!isObj(v)) return out;
  for (const [id, date] of Object.entries(v)) {
    if (typeof date === 'string' && DATE_RE.test(date)) out[id] = date;
  }
  return out;
}

export function normalizeState(d: Record<string, unknown>): PersistedState {
  const base = initialState();
  return {
    schema: 1,
    profile: normalizeProfile(d.profile),
    settings: normalizeSettings(d.settings),
    cycle: typeof d.cycle === 'number' && Number.isInteger(d.cycle) && d.cycle >= 1 ? d.cycle : base.cycle,
    planStartDate: typeof d.planStartDate === 'string' && DATE_RE.test(d.planStartDate) ? d.planStartDate : base.planStartDate,
    planDays: normalizePlanDays(d.planDays),
    dates: normalizeDates(d.dates),
    milestones: normalizeMilestones(d.milestones),
  };
}

function isValidState(d: Record<string, unknown>): boolean {
  if (d.schema !== 1) return false;
  if (!(d.profile === null || isObj(d.profile))) return false;
  if (!isObj(d.settings)) return false;
  if (typeof d.cycle !== 'number' || !Number.isInteger(d.cycle) || d.cycle < 1) return false;
  if (!(d.planStartDate === null || (typeof d.planStartDate === 'string' && DATE_RE.test(d.planStartDate)))) return false;
  if (!isObj(d.planDays) || !Object.values(d.planDays).every((p) => isObj(p) && Array.isArray(p.completedTaskIds))) return false;
  if (!isObj(d.dates) || !Object.values(d.dates).every((x) => isObj(x) && Array.isArray(x.prayers) && isObj(x.tasbih))) return false;
  if (!isObj(d.milestones)) return false;
  return true;
}

export function parseBackup(json: string, today: DateKey): BackupResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'invalid_json' };
  }
  if (!isObj(parsed)) return { ok: false, error: 'not_awdah' };

  if (parsed.app !== 'awdah') {
    if ('state' in parsed) {
      const legacy = convertLegacyNafs(parsed.state, today);
      return legacy ? { ok: true, data: legacy } : { ok: false, error: 'invalid_shape' };
    }
    return { ok: false, error: 'not_awdah' };
  }
  if (parsed.schema !== 1) return { ok: false, error: 'unsupported_version' };
  const data = parsed.data;
  if (!isObj(data) || !isValidState(data)) return { ok: false, error: 'invalid_shape' };
  return { ok: true, data: normalizeState(data) };
}
