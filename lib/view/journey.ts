import { DAYS, WEEKS } from '../../content/days';
import { getPlanPosition, type DateKey, type Phase } from '../day';
import type { PersistedState } from '../model';
import { buildDayVM } from './today';

export type DayStatus = 'complete' | 'partial' | 'open' | 'today' | 'locked';
export interface JourneyDayVM { day: number; theme: string; themeArabic: string; status: DayStatus }
export interface JourneyWeekVM { week: number; title: string; titleArabic: string; days: JourneyDayVM[]; doneCount: number }

function statusFor(state: PersistedState, day: number, currentDay: number, phase: Phase, today: DateKey): DayStatus {
  if (phase === 'journey' && day > currentDay) return 'locked';
  const tasks = buildDayVM(state, day, today)?.tasks ?? [];
  const done = tasks.filter((t) => t.done).length;
  if (tasks.length > 0 && done >= tasks.length) return 'complete';
  if (phase === 'journey' && day === currentDay) return 'today';
  return done >= 1 ? 'partial' : 'open';
}

export function buildJourneyVM(
  state: PersistedState,
  today: DateKey,
): { cycle: number; currentDay: number; phase: Phase; weeks: JourneyWeekVM[] } {
  const { day: currentDay, phase } = getPlanPosition(state.planStartDate ?? today, today);
  const weeks = WEEKS.map((w): JourneyWeekVM => {
    const days: JourneyDayVM[] = [];
    for (let d = w.days[0]; d <= w.days[1]; d++) {
      days.push({
        day: d,
        theme: DAYS[d - 1]?.theme ?? '',
        themeArabic: DAYS[d - 1]?.themeArabic ?? '',
        status: statusFor(state, d, currentDay, phase, today),
      });
    }
    return {
      week: w.week, title: w.title, titleArabic: w.titleArabic, days,
      doneCount: days.filter((d) => d.status === 'complete').length,
    };
  });
  return { cycle: state.cycle, currentDay, phase, weeks };
}
