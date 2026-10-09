import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import id from '../locales/id.json';
import tr from '../locales/tr.json';
import ur from '../locales/ur.json';
import type { Lang } from './model';

export const SUPPORTED_LANGS: readonly Lang[] = ['en', 'ar', 'ur', 'id', 'tr'];
const RTL_LANGS: readonly Lang[] = ['ar', 'ur'];

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
  ur: { translation: ur },
  id: { translation: id },
  tr: { translation: tr },
} as const;

export function isRTL(lang: Lang): boolean {
  return RTL_LANGS.includes(lang);
}

export function resolveLanguage(pref: Lang | null, deviceLanguageCodes: (string | null)[]): Lang {
  if (pref) return pref;
  for (const code of deviceLanguageCodes) {
    const base = code?.toLowerCase().split(/[-_]/)[0];
    const c = base === 'in' ? 'id' : base;
    if (c && (SUPPORTED_LANGS as readonly string[]).includes(c)) return c as Lang;
  }
  return 'en';
}

export async function initI18n(lang: Lang) {
  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: lang,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
  } else if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }
  return i18n;
}

export default i18n;
