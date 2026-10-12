import { buildShareMessage } from '../view/share';
import type { SourcedText } from '../../content/types';

const text = {
  arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
  meaning: 'Actions are judged by intentions.',
  source: { ref: 'Bukhari 1' },
} as SourcedText;

describe('buildShareMessage', () => {
  it('shares the meaning in English', () => {
    expect(buildShareMessage(text, 'en', 'Shared from Awdah')).toBe(
      'Actions are judged by intentions.\n— Bukhari 1\n\nShared from Awdah',
    );
  });
  it('shares the Arabic text in the Arabic UI', () => {
    expect(buildShareMessage(text, 'ar', 'footer')).toBe(`${text.arabic}\n— Bukhari 1\n\nfooter`);
  });
});
