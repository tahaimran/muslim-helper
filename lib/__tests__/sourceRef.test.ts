import { localizeSourceRef, sourceLabel } from '../sourceRef';

describe('localizeSourceRef', () => {
  it('keeps Latin names for en, id and tr', () => {
    for (const l of ['en', 'id', 'tr'] as const) expect(localizeSourceRef('Bukhari 1; Muslim 1907', l)).toBe('Bukhari 1; Muslim 1907');
  });
  it('writes Arabic names for ar', () => {
    expect(localizeSourceRef('Bukhari 1; Muslim 1907', 'ar')).toBe('البخاري 1; مسلم 1907');
    expect(localizeSourceRef('Abu Dawud 1521, sahih', 'ar')).toBe('أبو داود 1521، sahih');
    expect(localizeSourceRef('Quran 2:255', 'ar')).toBe('القرآن 2:255');
  });
  it('writes Urdu names for ur', () => {
    expect(localizeSourceRef('Ibn Majah 925; Tirmidhi 55', 'ur')).toBe('ابن ماجہ 925; ترمذی 55');
  });
  it('writes the az-Zuhd book name in Arabic script', () => {
    expect(localizeSourceRef('Ahmad, az-Zuhd', 'ar')).toBe('أحمد، الزهد');
    expect(localizeSourceRef('Ahmad, az-Zuhd', 'ur')).toBe('احمد، الزہد');
    expect(localizeSourceRef('Ahmad, az-Zuhd', 'en')).toBe('Ahmad, az-Zuhd');
  });
});

describe('sourceLabel', () => {
  const t = (k: string) => ({ 'worship.grade.sahih': 'صحيح', 'worship.grade.hasan': 'hasan' })[k] ?? k;
  it('appends the translated grade to a hadith ref', () => {
    expect(sourceLabel({ ref: 'Bukhari 1', grade: 'sahih' }, t, 'ar')).toBe('البخاري 1، صحيح');
    expect(sourceLabel({ ref: 'Tirmidhi 55', grade: 'hasan' }, t, 'en')).toBe('Tirmidhi 55, hasan');
  });
  it('shows only the localized ref when there is no grade', () => {
    expect(sourceLabel({ ref: 'Quran 94:5-6', grade: null }, t, 'ur')).toBe('قرآن 94:5-6');
    expect(sourceLabel({ ref: 'Ahmad, az-Zuhd', grade: null }, t, 'tr')).toBe('Ahmad, az-Zuhd');
  });
});
