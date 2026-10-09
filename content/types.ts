import type { DayTask, PrayerName } from '../lib/types';

export type SourceKind = 'quran' | 'hadith' | 'athar';
export type Grade = 'sahih' | 'hasan';

export interface Source {
  kind: SourceKind;
  ref: string; // e.g. 'Bukhari 6464; Muslim 782' or 'Quran 94:5-6' or 'Athar of Umar ibn al-Khattab (Ibn Abi Shaybah 35600)'
  grade: Grade | null; // required for 'hadith'; null for 'quran' and 'athar'
}

export interface SourcedText {
  arabic: string;
  meaning: string;
  transliteration?: string;
  source: Source;
}

export interface Dhikr {
  id: string; // stable, e.g. 'subhanallah', 'sayyid_istighfar'
  arabic: string;
  transliteration: string;
  meaning: string;
  count: number;
  source: Source | null; // null = general dhikr with no specific virtue claimed
}

export interface TasbihTarget {
  dhikrId: string;
  target: number;
}

export interface ContentTask {
  id: string; // `${day}_${slug}`, globally unique
  title: string;
  titleBeginner?: string;
  titleAdvanced?: string;
  category: DayTask['category'];
  tasbih?: TasbihTarget[]; // auto-completes when today's tasbih counts reach every target
}

export interface DayContent {
  day: number;
  theme: string;
  themeArabic: string;
  intro: string;
  morningDhikr: Dhikr[];
  eveningDhikr: Dhikr[];
  quran: { surah: string; surahNumber: number; ayahs: string; note: string };
  prayerFocus: { prayer: PrayerName | 'all'; tip: string; dua?: SourcedText };
  sunnah: { title: string; description: string; source: Source | null };
  character: { trait: string; arabic: string; description: string; action: string };
  hadith: SourcedText;
  reflection: string;
  tasks: ContentTask[];
}

export interface WeekInfo {
  week: number;
  title: string;
  titleArabic: string;
  days: [number, number]; // inclusive range
}
