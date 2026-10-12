import { isRTL } from './i18n';
import type { Lang } from './model';

/** True when the layout direction of `lang` differs from the direction the app is currently running in. */
export function needsDirectionChange(lang: Lang, currentIsRTL: boolean): boolean {
  return isRTL(lang) !== currentIsRTL;
}

export type DirectionAction = 'none' | 'reload' | 'banner';

/**
 * `force` is the value to persist in the native RTL flag (always written, so reverting to the
 * live direction also clears a stale flag). `action` is what the app must do for the live
 * layout to match: nothing, reload (dev only), or ask the user to restart. Web never prompts.
 */
export function directionPlan(
  lang: Lang,
  liveIsRTL: boolean,
  platform: string,
  canReload: boolean,
): { force: boolean; action: DirectionAction } {
  const force = isRTL(lang);
  if (platform === 'web' || !needsDirectionChange(lang, liveIsRTL)) return { force, action: 'none' };
  return { force, action: canReload ? 'reload' : 'banner' };
}
