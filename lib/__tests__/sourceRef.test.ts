import { localizeSourceRef } from '../sourceRef';

describe('localizeSourceRef', () => {
  it('keeps Latin names for en, id and tr', () => {
    for (const l of ['en', 'id', 'tr'] as const) expect(localizeSourceRef('Bukhari 1; Muslim 1907', l)).toBe('Bukhari 1; Muslim 1907');
  });
  it('writes Arabic names for ar', () => {
    expect(localizeSourceRef('Bukhari 1; Muslim 1907', 'ar')).toBe('البخاري 1; مسلم 1907');
    expect(localizeSourceRef('Abu Dawud 1521, sahih', 'ar')).toBe('أبو داود 1521, sahih');
    expect(localizeSourceRef('Quran 2:255', 'ar')).toBe('القرآن 2:255');
  });
  it('writes Urdu names for ur', () => {
    expect(localizeSourceRef('Ibn Majah 925; Tirmidhi 55', 'ur')).toBe('ابن ماجہ 925; ترمذی 55');
  });
});
