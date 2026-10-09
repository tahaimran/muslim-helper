export const palette = {
  layl: '#161A33', laylRaised: '#20254A', mist: '#F2F4F9', cloud: '#FFFFFF',
  ink: '#1F2340', inkMuted: '#565B78', starlight: '#E9EBF5', starMuted: '#A7ACC9',
  zaytun: '#4A7656', zaytunNight: '#8CC09A', dawnGold: '#B07D17', dawnGoldNight: '#E3B65A',
  lineLight: '#DCE0EC', lineDark: '#30365E', danger: '#B4444F', dangerNight: '#E8848C',
  shadowNight: '#05060F',
} as const;

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  bg: string; surface: string; text: string; textMuted: string;
  accent: string; onAccent: string; control: string; gold: string; line: string; danger: string; shadow: string;
}

export function colorsFor(scheme: ColorScheme): ThemeColors {
  return scheme === 'dark'
    ? { bg: palette.layl, surface: palette.laylRaised, text: palette.starlight, textMuted: palette.starMuted,
        accent: palette.zaytunNight, onAccent: palette.layl, control: palette.starMuted, gold: palette.dawnGoldNight, line: palette.lineDark, danger: palette.dangerNight, shadow: palette.shadowNight }
    : { bg: palette.mist, surface: palette.cloud, text: palette.ink, textMuted: palette.inkMuted,
        accent: palette.zaytun, onAccent: palette.cloud, control: palette.inkMuted, gold: palette.dawnGold, line: palette.lineLight, danger: palette.danger, shadow: palette.ink };
}
