import { UserProfile, DayPlan, DayTask } from './types';
import { THIRTY_DAY_PLANS } from '../constants/islamicContent';

export function generatePersonalizedPlan(profile: UserProfile): DayPlan[] {
  return THIRTY_DAY_PLANS.map((day) => {
    const personalizedTasks = personalizeTasksForProfile(day.tasks, profile, day.day);
    return {
      ...day,
      tasks: personalizedTasks,
    };
  });
}

function personalizeTasksForProfile(
  tasks: DayTask[],
  profile: UserProfile,
  day: number
): DayTask[] {
  let filtered = [...tasks];

  if (profile.knowledgeLevel === 'beginner') {
    filtered = filtered.map((t) => ({
      ...t,
      title: simplifyTaskTitle(t.title, profile),
    }));
  }

  if (profile.dailyMinutes < 30) {
    filtered = filtered.slice(0, 4);
  } else if (profile.dailyMinutes < 60) {
    filtered = filtered.slice(0, 5);
  }

  return filtered;
}

function simplifyTaskTitle(title: string, profile: UserProfile): string {
  if (profile.knowledgeLevel === 'beginner') {
    return title.replace('all Sunnah prayers', '2 Sunnah prayers').replace('12 Sunnah rakah', '4 Sunnah rakah');
  }
  return title;
}

export function getDayPlan(day: number): DayPlan {
  const index = Math.min(Math.max(day - 1, 0), THIRTY_DAY_PLANS.length - 1);
  return THIRTY_DAY_PLANS[index];
}

export function getWeekNumber(day: number): number {
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
}

export function calculateDayPoints(completedTaskIds: string[], tasks: DayTask[]): number {
  return completedTaskIds.reduce((total, id) => {
    const task = tasks.find((t) => t.id === id);
    return total + (task?.points ?? 0);
  }, 0);
}

export function calculateTotalPoints(
  dayProgress: Record<number, { completedTaskIds: string[] }>
): number {
  let total = 0;
  Object.entries(dayProgress).forEach(([dayStr, progress]) => {
    const day = parseInt(dayStr);
    const plan = getDayPlan(day);
    total += calculateDayPoints(progress.completedTaskIds, plan.tasks);
  });
  return total;
}

export function getDaysCompleted(dayProgress: Record<number, { completedTaskIds: string[] }>): number {
  return Object.values(dayProgress).filter((p) => p.completedTaskIds.length > 0).length;
}

export function getOverallProgress(dayProgress: Record<number, { completedTaskIds: string[] }>): number {
  return (getDaysCompleted(dayProgress) / 30) * 100;
}

export function getLevelTitle(totalPoints: number): { level: string; arabic: string } {
  if (totalPoints < 200) return { level: 'Beginner Seeker', arabic: 'المبتدئ' };
  if (totalPoints < 500) return { level: 'Dedicated Student', arabic: 'الطالب' };
  if (totalPoints < 1000) return { level: 'Sincere Worshipper', arabic: 'العابد' };
  if (totalPoints < 2000) return { level: 'Devoted Believer', arabic: 'المؤمن' };
  return { level: 'Champion of the Deen', arabic: 'المجاهد' };
}
