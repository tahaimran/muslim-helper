import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold } from '@expo-google-fonts/noto-nastaliq-urdu';
import { ReadexPro_400Regular, ReadexPro_500Medium, ReadexPro_700Bold } from '@expo-google-fonts/readex-pro';
import type { Lang } from '../lib/model';

export const FONT_ASSETS = {
  ReadexPro_400Regular, ReadexPro_500Medium, ReadexPro_700Bold,
  Amiri_400Regular, Amiri_700Bold,
  NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold,
};

export type FontRole = 'ui' | 'uiMedium' | 'uiBold' | 'display' | 'arabic';

export const TYPE_SCALE = { caption: 12, small: 14, body: 16, heading: 20, title: 25, display: 31, hero: 39 } as const;

export function fontFamily(lang: Lang, role: FontRole): string {
  if (role === 'arabic') return 'Amiri_400Regular';
  if (lang === 'ur') return role === 'ui' ? 'NotoNastaliqUrdu_400Regular' : 'NotoNastaliqUrdu_700Bold';
  switch (role) {
    case 'ui': return 'ReadexPro_400Regular';
    case 'uiMedium': return 'ReadexPro_500Medium';
    case 'uiBold': return 'ReadexPro_700Bold';
    case 'display': return 'Amiri_700Bold';
  }
}

export function lineHeightFor(lang: Lang, size: number): number {
  return Math.round(size * (lang === 'ur' ? 2.0 : 1.45));
}
