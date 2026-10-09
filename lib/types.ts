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

export interface DayTask {
  id: string;
  title: string;
  titleBeginner?: string;
  titleAdvanced?: string;
  category: 'prayer' | 'quran' | 'dhikr' | 'sunnah' | 'character' | 'reflection';
}
