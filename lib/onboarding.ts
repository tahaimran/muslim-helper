import type { ImprovementArea, PracticeLevel, KnowledgeLevel } from './types';

export const MIN_DAILY_MINUTES = 5;
export const MAX_DAILY_MINUTES = 120;
export const MAX_FOCUS_AREAS = 3;
export const MINUTE_OPTIONS: readonly number[] = [5, 10, 20, 30, 60];
export const ONBOARDING_STEPS = [
  'welcome', 'language', 'name', 'habit', 'knowledge', 'focus', 'time', 'intention',
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

/** Whole minutes within 5..120; non-numeric input falls back to the minimum. */
export function clampMinutes(value: number): number {
  if (!Number.isFinite(value)) return MIN_DAILY_MINUTES;
  return Math.min(MAX_DAILY_MINUTES, Math.max(MIN_DAILY_MINUTES, Math.round(value)));
}

/** Toggles an area, keeping at most MAX_FOCUS_AREAS; a new pick beyond the limit is ignored. */
export function toggleFocusArea(current: readonly ImprovementArea[], area: ImprovementArea): ImprovementArea[] {
  if (current.includes(area)) return current.filter((a) => a !== area);
  if (current.length >= MAX_FOCUS_AREAS) return [...current];
  return [...current, area];
}

export interface OnboardingDraft {
  name: string;
  prayerHabit: PracticeLevel | null;
  knowledgeLevel: KnowledgeLevel | null;
  focusAreas: readonly ImprovementArea[];
  dailyMinutes: number | null;
}

/** Whether the user may leave `step` forward. Welcome, language, name (optional) and intention always can. */
export function canAdvance(step: OnboardingStep, draft: OnboardingDraft): boolean {
  switch (step) {
    case 'habit': return draft.prayerHabit !== null;
    case 'knowledge': return draft.knowledgeLevel !== null;
    case 'focus': return draft.focusAreas.length >= 1 && draft.focusAreas.length <= MAX_FOCUS_AREAS;
    case 'time': return draft.dailyMinutes !== null;
    default: return true;
  }
}

/** Builds the profile to save, or null if required answers are missing. */
export function buildProfile(draft: OnboardingDraft) {
  if (!draft.prayerHabit || !draft.knowledgeLevel || draft.dailyMinutes === null) return null;
  return {
    name: draft.name.trim(),
    prayerHabit: draft.prayerHabit,
    knowledgeLevel: draft.knowledgeLevel,
    focusAreas: [...draft.focusAreas],
    dailyMinutes: clampMinutes(draft.dailyMinutes),
  };
}
