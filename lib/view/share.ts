import { showMeaning } from '../../content/i18n';
import type { SourcedText } from '../../content/types';
import type { Lang } from '../model';

/** Text shared from Today: the meaning for most languages, the Arabic itself for the Arabic UI. */
export function buildShareMessage(text: SourcedText, lang: Lang, footer: string): string {
  return `${showMeaning(lang) ? text.meaning : text.arabic}\n— ${text.source.ref}\n\n${footer}`;
}
