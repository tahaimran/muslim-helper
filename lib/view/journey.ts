import { DAYS, WEEKS } from '../../content/days';
import { localizeDay, localizeWeek } from '../../content/i18n';
import { getPlanPosition, type DateKey, type Phase } from '../day';
import type { Lang, PersistedState } from '../model';
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
  lang: Lang = 'en',
): { cycle: number; currentDay: number; phase: Phase; weeks: JourneyWeekVM[] } {
  const { day: currentDay, phase } = getPlanPosition(state.planStartDate ?? today, today);
  const weeks = WEEKS.map((src): JourneyWeekVM => {
    const w = localizeWeek(src, lang);
    const days: JourneyDayVM[] = [];
    for (let d = w.days[0]; d <= w.days[1]; d++) {
      const dc = DAYS[d - 1] ? localizeDay(DAYS[d - 1], lang) : undefined;
      days.push({
        day: d,
        theme: dc?.theme ?? '',
        themeArabic: dc?.themeArabic ?? '',
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
