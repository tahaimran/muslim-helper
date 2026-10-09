import { addDays, getStreak, type DateKey } from '../day';
import { activeDateSet, MILESTONE_IDS, type MilestoneId } from '../milestones';
import type { PersistedState } from '../model';

export interface ProgressVM {
  daysShownUp: number;
  streak: number;
  prayersKept30: number; // prayers logged in the last 30 days
  heatmap: { date: DateKey; count: number }[]; // last 35 days, oldest to newest, count 0-5
  milestones: { id: MilestoneId; unlockedOn: DateKey | null }[];
}

const HEATMAP_DAYS = 35;
const KEPT_WINDOW = 30;

export function buildProgressVM(state: PersistedState, today: DateKey): ProgressVM {
  const active = activeDateSet(state);
  const countFor = (date: DateKey) => Math.min(5, new Set(state.dates[date]?.prayers ?? []).size);

  const heatmap = Array.from({ length: HEATMAP_DAYS }, (_, i) => {
    const date = addDays(today, i - (HEATMAP_DAYS - 1));
    return { date, count: countFor(date) };
  });
  const prayersKept30 = heatmap.slice(HEATMAP_DAYS - KEPT_WINDOW).reduce((sum, c) => sum + c.count, 0);

  return {
    daysShownUp: active.size,
    streak: getStreak(active, today),
    prayersKept30,
    heatmap,
    milestones: MILESTONE_IDS.map((id) => ({ id, unlockedOn: state.milestones[id] ?? null })),
  };
}
