import { Achievement, AppState } from './types';
import { getDaysCompleted } from './planGenerator';

export const ACHIEVEMENTS: Achievement[] = [
  // Prayer achievements
  { id: 'prayer_1', title: 'First Step', titleArabic: 'الخطوة الأولى', description: 'Complete your first prayer task', category: 'prayer', icon: '🕌', requirement: 1, checkProgress: (s) => countCategoryTasks(s, 'prayer') },
  { id: 'prayer_5', title: 'Consistent Worshipper', titleArabic: 'المصلي المنتظم', description: 'Complete 5 prayer tasks', category: 'prayer', icon: '🕌', requirement: 5, checkProgress: (s) => countCategoryTasks(s, 'prayer') },
  { id: 'prayer_15', title: 'Prayer Guardian', titleArabic: 'حارس الصلاة', description: 'Complete 15 prayer tasks', category: 'prayer', icon: '🕌', requirement: 15, checkProgress: (s) => countCategoryTasks(s, 'prayer') },
  { id: 'prayer_30', title: 'Salah Champion', titleArabic: 'بطل الصلاة', description: 'Complete 30 prayer tasks', category: 'prayer', icon: '🕌', requirement: 30, checkProgress: (s) => countCategoryTasks(s, 'prayer') },

  // Quran achievements
  { id: 'quran_1', title: 'Quran Opener', titleArabic: 'فاتح القرآن', description: 'Complete your first Quran task', category: 'quran', icon: '📖', requirement: 1, checkProgress: (s) => countCategoryTasks(s, 'quran') },
  { id: 'quran_5', title: 'Quran Reader', titleArabic: 'قارئ القرآن', description: 'Complete 5 Quran tasks', category: 'quran', icon: '📖', requirement: 5, checkProgress: (s) => countCategoryTasks(s, 'quran') },
  { id: 'quran_15', title: 'Quran Student', titleArabic: 'طالب القرآن', description: 'Complete 15 Quran tasks', category: 'quran', icon: '📖', requirement: 15, checkProgress: (s) => countCategoryTasks(s, 'quran') },
  { id: 'quran_30', title: 'Quran Companion', titleArabic: 'رفيق القرآن', description: 'Complete 30 Quran tasks', category: 'quran', icon: '📖', requirement: 30, checkProgress: (s) => countCategoryTasks(s, 'quran') },

  // Dhikr achievements
  { id: 'dhikr_1', title: 'Rememberer', titleArabic: 'الذاكر', description: 'Complete your first dhikr task', category: 'dhikr', icon: '📿', requirement: 1, checkProgress: (s) => countCategoryTasks(s, 'dhikr') },
  { id: 'dhikr_10', title: 'Dhikr Lover', titleArabic: 'محب الذكر', description: 'Complete 10 dhikr tasks', category: 'dhikr', icon: '📿', requirement: 10, checkProgress: (s) => countCategoryTasks(s, 'dhikr') },
  { id: 'dhikr_30', title: 'Dhikr Master', titleArabic: 'أستاذ الذكر', description: 'Complete 30 dhikr tasks', category: 'dhikr', icon: '📿', requirement: 30, checkProgress: (s) => countCategoryTasks(s, 'dhikr') },

  // Sunnah achievements
  { id: 'sunnah_1', title: 'Sunnah Follower', titleArabic: 'متبع السنة', description: 'Complete your first sunnah task', category: 'sunnah', icon: '🌙', requirement: 1, checkProgress: (s) => countCategoryTasks(s, 'sunnah') },
  { id: 'sunnah_10', title: 'Sunnah Practitioner', titleArabic: 'ممارس السنة', description: 'Complete 10 sunnah tasks', category: 'sunnah', icon: '🌙', requirement: 10, checkProgress: (s) => countCategoryTasks(s, 'sunnah') },
  { id: 'sunnah_30', title: 'Sunnah Scholar', titleArabic: 'عالم السنة', description: 'Complete 30 sunnah tasks', category: 'sunnah', icon: '🌙', requirement: 30, checkProgress: (s) => countCategoryTasks(s, 'sunnah') },

  // Character achievements
  { id: 'char_1', title: 'Character Builder', titleArabic: 'باني الأخلاق', description: 'Complete your first character task', category: 'character', icon: '💎', requirement: 1, checkProgress: (s) => countCategoryTasks(s, 'character') },
  { id: 'char_10', title: 'Noble Character', titleArabic: 'حسن الخلق', description: 'Complete 10 character tasks', category: 'character', icon: '💎', requirement: 10, checkProgress: (s) => countCategoryTasks(s, 'character') },
  { id: 'char_30', title: 'Akhlaq Master', titleArabic: 'أستاذ الأخلاق', description: 'Complete 30 character tasks', category: 'character', icon: '💎', requirement: 30, checkProgress: (s) => countCategoryTasks(s, 'character') },

  // Streak achievements
  { id: 'streak_3', title: 'Consistent', titleArabic: 'منتظم', description: 'Maintain a 3-day streak', category: 'streak', icon: '🔥', requirement: 3, checkProgress: (s) => s.streakDays },
  { id: 'streak_7', title: 'Week Warrior', titleArabic: 'محارب الأسبوع', description: 'Maintain a 7-day streak', category: 'streak', icon: '🔥', requirement: 7, checkProgress: (s) => s.streakDays },
  { id: 'streak_14', title: 'Halfway Hero', titleArabic: 'بطل النصف', description: 'Maintain a 14-day streak', category: 'streak', icon: '🔥', requirement: 14, checkProgress: (s) => s.streakDays },
  { id: 'streak_30', title: 'Unbreakable', titleArabic: 'لا يُقهر', description: 'Maintain a 30-day streak', category: 'streak', icon: '🔥', requirement: 30, checkProgress: (s) => s.streakDays },

  // Milestone achievements
  { id: 'milestone_7', title: 'First Week Complete', titleArabic: 'الأسبوع الأول', description: 'Complete 7 days of the program', category: 'milestone', icon: '⭐', requirement: 7, checkProgress: (s) => getDaysCompleted(s.dayProgress) },
  { id: 'milestone_14', title: 'Halfway There', titleArabic: 'في المنتصف', description: 'Complete 14 days of the program', category: 'milestone', icon: '⭐', requirement: 14, checkProgress: (s) => getDaysCompleted(s.dayProgress) },
  { id: 'milestone_21', title: 'Three Weeks Strong', titleArabic: 'ثلاثة أسابيع', description: 'Complete 21 days of the program', category: 'milestone', icon: '⭐', requirement: 21, checkProgress: (s) => getDaysCompleted(s.dayProgress) },
  { id: 'milestone_30', title: 'Journey Complete', titleArabic: 'اكتمال الرحلة', description: 'Complete all 30 days', category: 'milestone', icon: '🏆', requirement: 30, checkProgress: (s) => getDaysCompleted(s.dayProgress) },
];

function countCategoryTasks(state: AppState, category: string): number {
  let count = 0;
  for (const progress of Object.values(state.dayProgress)) {
    for (const taskId of progress.completedTaskIds) {
      if (taskId.startsWith(category)) count++;
    }
  }
  return count;
}

export function getUnlockedAchievements(state: AppState): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.checkProgress(state) >= a.requirement);
}

export function getLockedAchievements(state: AppState): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.checkProgress(state) < a.requirement);
}

export function getAchievementProgress(achievement: Achievement, state: AppState): number {
  return Math.min(achievement.checkProgress(state), achievement.requirement);
}
