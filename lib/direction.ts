import { isRTL } from './i18n';
import type { Lang } from './model';

/** True when the layout direction of `lang` differs from the direction the app is currently running in. */
export function needsDirectionChange(lang: Lang, currentIsRTL: boolean): boolean {
  return isRTL(lang) !== currentIsRTL;
}
