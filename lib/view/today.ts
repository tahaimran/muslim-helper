import { DAYS } from '../../content/days';
import type { ContentTask, DayContent, SourcedText } from '../../content/types';
import {
  daysBetween, daysSinceLastActive, getPlanPosition, getStreak, shouldWelcomeBack,
  PLAN_LENGTH, type DateKey, type Phase,
} from '../day';
import { activeDateSet } from '../milestones';
import { planDayKey, type PersistedState, type Profile } from '../model';
import { personalizeTasks, shouldShowLearnSalah } from '../plan';
import type { MoodType, PrayerName } from '../types';

export interface TaskVM extends ContentTask {
  done: boolean;
  lockedByTasbih: boolean;
}

export interface DayVM {
  day: number;
  cycle: number;
  content: DayContent;
  tasks: TaskVM[];
  journal: string;
  mood: MoodType | null;
  editable: boolean;
  isFuture: boolean;
}

export interface IstiqamahVM {
  hadith: SourcedText;
  morningDone: boolean;
  eveningDone: boolean;
  /**
   * Days since the plan started. The istiqamah reflection for today is stored as a plan day
   * under `planDayKey(cycle, PLAN_LENGTH + reflectionKey)` (see `istiqamahJournalDay`), so it
   * never collides with the 30 journey days.
   */
  reflectionKey: number;
  /** Today's istiqamah reflection text. */
  journal: string;
}

export interface TodayVM {
  phase: Phase;
  today: DateKey;
  streak: number;
  daysShownUp: number;
  welcomeBack: boolean;
  showLearnSalah: boolean;
  prayersDone: PrayerName[];
  /** Null in istiqamah, or when the current day's content is not available yet. */
  day: DayVM | null;
  /** Null in the journey phase. */
  istiqamah: IstiqamahVM | null;
}

// Used only if the profile is missing (the Today screen is gated behind onboarding).
const FALLBACK_PROFILE: Profile = {
  name: '', prayerHabit: 'most', knowledgeLevel: 'intermediate', focusAreas: [], dailyMinutes: 60,
};

/** The plan-day number under which the istiqamah reflection for `reflectionKey` is stored. */
export function istiqamahJournalDay(reflectionKey: number): number {
  return PLAN_LENGTH + reflectionKey;
}

function currentPlanDay(state: PersistedState, today: DateKey) {
  return getPlanPosition(state.planStartDate ?? today, today);
}

/** Null when no content exists for `day` (content may still be in progress). */
export function buildDayVM(state: PersistedState, day: number, today: DateKey): DayVM | null {
  const content = DAYS[day - 1] as DayContent | undefined;
  if (!content) return null;

  const { cycle } = state;
  const profile = state.profile ?? FALLBACK_PROFILE;
  const position = currentPlanDay(state, today);
  const isCurrent = position.phase === 'journey' && day === position.day;
  const isFuture = position.phase === 'journey' && day > position.day;

  const log = state.planDays[planDayKey(cycle, day)];
  const completed = new Set(log?.completedTaskIds ?? []);
  const tasbih = state.dates[today]?.tasbih ?? {};

  const tasks: TaskVM[] = personalizeTasks(content.tasks, profile, cycle).map((task) => {
    const manual = completed.has(task.id);
    const byTasbih =
      isCurrent &&
      !!task.tasbih &&
      task.tasbih.length > 0 &&
      task.tasbih.every((tg) => (tasbih[tg.dhikrId] ?? 0) >= tg.target);
    return { ...task, done: manual || byTasbih, lockedByTasbih: byTasbih && !manual };
  });

  return {
    day,
    cycle,
    content,
    tasks,
    journal: log?.journal ?? '',
    mood: log?.mood ?? null,
    editable: !isFuture,
    isFuture,
  };
}

export function buildTodayVM(state: PersistedState, today: DateKey): TodayVM {
  const position = currentPlanDay(state, today);
  const active = activeDateSet(state);
  const profile = state.profile ?? FALLBACK_PROFILE;
  const dateLog = state.dates[today];

  let istiqamah: IstiqamahVM | null = null;
  if (position.phase === 'istiqamah') {
    const elapsed = Math.max(0, daysBetween(state.planStartDate ?? today, today));
    const rotated = DAYS[elapsed % PLAN_LENGTH] ?? DAYS[elapsed % DAYS.length];
    istiqamah = {
      hadith: rotated.hadith,
      morningDone: (dateLog?.tasbih.morning_adhkar ?? 0) >= 1,
      eveningDone: (dateLog?.tasbih.evening_adhkar ?? 0) >= 1,
      reflectionKey: elapsed,
      journal: state.planDays[planDayKey(state.cycle, istiqamahJournalDay(elapsed))]?.journal ?? '',
    };
  }

  return {
    phase: position.phase,
    today,
    streak: getStreak(active, today),
    daysShownUp: active.size,
    welcomeBack: shouldWelcomeBack(daysSinceLastActive(active, today)),
    showLearnSalah: shouldShowLearnSalah(profile, position.day, state.cycle),
    prayersDone: dateLog?.prayers ?? [],
    day: position.phase === 'journey' ? buildDayVM(state, position.day, today) : null,
    istiqamah,
  };
}
