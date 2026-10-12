import { showMeaning } from '../../content/i18n';
import type { SourcedText } from '../../content/types';
import type { Lang } from '../model';
import { sourceLabel } from '../sourceRef';

/** Text shared from Today: the meaning for most languages, the Arabic itself for the Arabic UI. */
export function buildShareMessage(text: SourcedText, lang: Lang, footer: string, t: (key: string) => string): string {
  return `${showMeaning(lang) ? text.meaning : text.arabic}\n— ${sourceLabel(text.source, t, lang)}\n\n${footer}`;
}
