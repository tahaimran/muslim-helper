import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, I18nManager, useColorScheme } from 'react-native';
import type { Lang } from '../lib/model';
import { useAppStore } from '../lib/store';
import { fontFamily, lineHeightFor, type FontRole } from './fonts';
import { colorsFor, type ColorScheme, type ThemeColors } from './tokens';
import { useLang } from './useLang';

export interface Theme {
  scheme: ColorScheme;
  colors: ThemeColors;
  lang: Lang;
  isRTL: boolean;
  font: (role: FontRole) => string;
  lineHeight: (size: number) => number;
  reduceMotion: boolean;
}

export function resolveScheme(
  pref: 'system' | 'light' | 'dark',
  system: ColorScheme | null | undefined,
): ColorScheme {
  return pref === 'system' ? (system ?? 'light') : pref;
}

const ThemeContext = createContext<Theme | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const pref = useAppStore((s) => s.settings.theme);
  const system = useColorScheme();
  const lang = useLang();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (active) setReduceMotion(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  const scheme = resolveScheme(pref, system === 'dark' ? 'dark' : system === 'light' ? 'light' : null);
  const isRTL = I18nManager.isRTL;

  const value = useMemo<Theme>(
    () => ({
      scheme,
      colors: colorsFor(scheme),
      lang,
      isRTL,
      font: (role) => fontFamily(lang, role),
      lineHeight: (size) => lineHeightFor(lang, size),
      reduceMotion,
    }),
    [scheme, lang, isRTL, reduceMotion],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within AppThemeProvider');
  return ctx;
}
