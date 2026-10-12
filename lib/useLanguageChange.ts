import { useCallback } from 'react';
import { applyDirection } from './platform/direction';
import { useAppStore } from './store';
import type { Lang } from './model';

/** Persist a new language and bring the layout direction in line with it. */
export function useLanguageChange(): (lang: Lang) => void {
  const updateSettings = useAppStore((s) => s.updateSettings);
  return useCallback(
    (lang: Lang) => {
      updateSettings({ language: lang });
      void applyDirection(lang);
    },
    [updateSettings],
  );
}
