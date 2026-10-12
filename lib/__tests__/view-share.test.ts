import { buildShareMessage } from '../view/share';
import type { SourcedText } from '../../content/types';

const text = {
  arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
  meaning: 'Actions are judged by intentions.',
  source: { kind: 'hadith', ref: 'Bukhari 1', grade: 'sahih' },
} as SourcedText;

const t = (k: string) => ({ 'worship.grade.sahih': 'sahih' })[k] ?? k;
const tAr = (k: string) => ({ 'worship.grade.sahih': 'صحيح' })[k] ?? k;

describe('buildShareMessage', () => {
  it('shares the meaning in English with the graded ref', () => {
    expect(buildShareMessage(text, 'en', 'Shared from Awdah', t)).toBe(
      'Actions are judged by intentions.\n— Bukhari 1, sahih\n\nShared from Awdah',
    );
  });
  it('shares the Arabic text with a localized ref in the Arabic UI', () => {
    expect(buildShareMessage(text, 'ar', 'footer', tAr)).toBe(`${text.arabic}\n— البخاري 1، صحيح\n\nfooter`);
  });
});
