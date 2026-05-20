export type Gender = 'male' | 'female';
export type KnowledgeLevel = 'beginner' | 'intermediate' | 'advanced';
export type PracticeLevel = 'none' | 'some' | 'most' | 'all';
export type ImprovementArea =
  | 'prayer'
  | 'quran'
  | 'dhikr'
  | 'fasting'
  | 'character'
  | 'family'
  | 'knowledge'
  | 'charity';

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export type MoodType = 'grateful' | 'peaceful' | 'struggling' | 'motivated' | 'reflective';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  knowledgeLevel: KnowledgeLevel;
  prayerConsistency: PracticeLevel;
  improvementAreas: ImprovementArea[];
  dailyMinutes: number;
  personalGoal: string;
  challenges: string;
  commitmentLevel: number;
  createdAt: string;
  planStartDate: string;
}

export interface DhikrItem {
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
}

export interface QuranGoal {
  surah: string;
  surahNumber: number;
  ayahs: string;
  description: string;
  translation: string;
}

export interface PrayerFocus {
  prayer: string;
  tip: string;
  sunnahRakah?: number;
  arabicDua?: string;
  duaTransliteration?: string;
  duaTranslation?: string;
}

export interface SunnahPractice {
  title: string;
  description: string;
  source: string;
}

export interface CharacterGoal {
  trait: string;
  arabicTerm: string;
  description: string;
  action: string;
}

export interface Hadith {
  text: string;
  source: string;
  arabic?: string;
}

export interface DayPlan {
  day: number;
  theme: string;
  themeArabic: string;
  themeDescription: string;
  morningDhikr: DhikrItem[];
  quranGoal: QuranGoal;
  prayerFocus: PrayerFocus;
  sunnahPractice: SunnahPractice;
  characterGoal: CharacterGoal;
  eveningDhikr: DhikrItem[];
  hadith: Hadith;
  reflectionQuestion: string;
  tasks: DayTask[];
}

export interface DayTask {
  id: string;
  title: string;
  category: 'prayer' | 'quran' | 'dhikr' | 'sunnah' | 'character' | 'reflection';
  points: number;
}

export interface TaskCompletion {
  taskId: string;
  completedAt: string;
}

export interface DayProgress {
  day: number;
  completedTaskIds: string[];
  journalEntry?: string;
  completedAt?: string;
  prayersCompleted?: PrayerName[];
  mood?: MoodType;
  dhikrCounts?: Record<string, number>;
  quranMinutesRead?: number;
}

export interface AppState {
  isOnboarded: boolean;
  userProfile: UserProfile | null;
  currentDay: number;
  dayProgress: Record<number, DayProgress>;
  totalPoints: number;
  streakDays: number;
  lastActiveDate: string;
  unlockedAchievements?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  category: 'prayer' | 'quran' | 'dhikr' | 'sunnah' | 'character' | 'streak' | 'milestone';
  icon: string;
  requirement: number;
  checkProgress: (state: AppState) => number;
}

export interface DuaCategory {
  id: string;
  title: string;
  titleArabic: string;
  duas: DuaItem[];
}

export interface DuaItem {
  title: string;
  titleArabic: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source?: string;
  occasion?: string;
}
