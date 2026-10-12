import type { Lang } from './model';

// Collection names shown in Arabic script for the Arabic and Urdu UIs. Other languages keep the
// Latin names. Numbers and punctuation are left untouched.
const NAMES: Partial<Record<Lang, Record<string, string>>> = {
  ar: {
    'Abu Dawud': 'أبو داود',
    'Ibn Majah': 'ابن ماجه',
    "Nasa'i": 'النسائي',
    Bukhari: 'البخاري',
    Muslim: 'مسلم',
    Tirmidhi: 'الترمذي',
    Ahmad: 'أحمد',
    Quran: 'القرآن',
  },
  ur: {
    'Abu Dawud': 'ابو داؤد',
    'Ibn Majah': 'ابن ماجہ',
    "Nasa'i": 'نسائی',
    Bukhari: 'بخاری',
    Muslim: 'مسلم',
    Tirmidhi: 'ترمذی',
    Ahmad: 'احمد',
    Quran: 'قرآن',
  },
};

const PATTERN = /Abu Dawud|Ibn Majah|Nasa'i|Bukhari|Muslim|Tirmidhi|Ahmad|Quran/g;

/** Writes hadith/Quran source names in the reader's script (Arabic and Urdu only). */
export function localizeSourceRef(ref: string, lang: Lang): string {
  const names = NAMES[lang];
  return names ? ref.replace(PATTERN, (m) => names[m] ?? m) : ref;
}
