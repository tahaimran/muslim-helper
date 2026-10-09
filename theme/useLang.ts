import { getLocales } from 'expo-localization';
import { resolveLanguage } from '../lib/i18n';
import type { Lang } from '../lib/model';
import { useAppStore } from '../lib/store';

export function useLang(): Lang {
  const pref = useAppStore((s) => s.settings.language);
  return resolveLanguage(pref, getLocales().map((l) => l.languageCode));
}
