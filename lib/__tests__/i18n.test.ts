import { initI18n, isRTL, resolveLanguage, SUPPORTED_LANGS } from '../i18n';
import en from '../../locales/en.json';
import ar from '../../locales/ar.json';
import ur from '../../locales/ur.json';
import id from '../../locales/id.json';
import tr from '../../locales/tr.json';

function keys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? keys(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`]
  ).sort();
}

describe('i18n', () => {
  it('supports exactly five languages', () => {
    expect(SUPPORTED_LANGS).toEqual(['en', 'ar', 'ur', 'id', 'tr']);
  });
  it('marks Arabic and Urdu as RTL', () => {
    expect(SUPPORTED_LANGS.filter(isRTL)).toEqual(['ar', 'ur']);
  });
  it('prefers the saved choice, then the device, then English', () => {
    expect(resolveLanguage('tr', ['ar'])).toBe('tr');
    expect(resolveLanguage(null, ['fr', 'ur'])).toBe('ur');
    expect(resolveLanguage(null, ['ID'])).toBe('id');
    expect(resolveLanguage(null, ['fr', null])).toBe('en');
    expect(resolveLanguage(null, [])).toBe('en');
    expect(resolveLanguage(null, ['in'])).toBe('id');
    expect(resolveLanguage(null, ['ar-SA'])).toBe('ar');
    expect(resolveLanguage(null, ['tr_TR'])).toBe('tr');
  });
  it('has identical keys in every locale', () => {
    const base = keys(en);
    for (const locale of [ar, ur, id, tr]) expect(keys(locale)).toEqual(base);
  });
  it('initializes and switches language', async () => {
    const i18n = await initI18n('en');
    expect(i18n.t('app.name')).toBe('Awdah');
    await initI18n('ar');
    expect(i18n.language).toBe('ar');
  });
});
