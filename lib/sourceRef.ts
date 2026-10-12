import type { Grade } from '../content/types';
import type { Lang } from './model';

// Collection and book names shown in Arabic script for the Arabic and Urdu UIs. Other languages
// keep the Latin names. Numbers are left untouched; ", " becomes the Arabic comma "، ".
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
    'az-Zuhd': 'الزهد',
    ', ': '، ',
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
    'az-Zuhd': 'الزہد',
    ', ': '، ',
  },
};

const PATTERN = /Abu Dawud|Ibn Majah|Nasa'i|Bukhari|Muslim|Tirmidhi|Ahmad|Quran|az-Zuhd|, /g;

/** Writes hadith/Quran source names in the reader's script (Arabic and Urdu only). */
export function localizeSourceRef(ref: string, lang: Lang): string {
  const names = NAMES[lang];
  return names ? ref.replace(PATTERN, (m) => names[m] ?? m) : ref;
}

/**
 * The caption under a text: its localized reference, plus the translated grade for hadith
 * (e.g. "Bukhari 1, sahih"). `t` is the i18n translate function.
 */
export function sourceLabel(
  source: { ref: string; grade: Grade | null },
  t: (key: string) => string,
  lang: Lang,
): string {
  const ref = localizeSourceRef(source.ref, lang);
  if (!source.grade) return ref;
  const comma = NAMES[lang] ? '، ' : ', ';
  return `${ref}${comma}${t(`worship.grade.${source.grade}`)}`;
}
