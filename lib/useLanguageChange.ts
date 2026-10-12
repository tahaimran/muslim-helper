import { useCallback } from 'react';
import { useAppStore } from './store';
import type { Lang } from './model';

/**
 * Persist a new language. The app shell reacts to every language change (including a restored
 * backup) by switching i18n and bringing the layout direction in line, exactly once.
 */
export function useLanguageChange(): (lang: Lang) => void {
  const updateSettings = useAppStore((s) => s.updateSettings);
  return useCallback((lang: Lang) => updateSettings({ language: lang }), [updateSettings]);
}
