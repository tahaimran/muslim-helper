import { DevSettings, I18nManager, Platform } from 'react-native';
import { directionPlan } from '../direction';
import { isRTL } from '../i18n';
import type { Lang } from '../model';
import { flushPersist } from '../store';

export type DirectionResult = 'unchanged' | 'reloading' | 'restart-required';

// Production builds do not ship expo-updates (it needs EAS Update configuration), so a
// direction change in a release build asks the user to restart; dev builds reload directly.
let restartPending = false;
const listeners = new Set<() => void>();

export function isRestartPending(): boolean {
  return restartPending;
}

export function subscribeRestartPending(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setPending(v: boolean) {
  if (restartPending === v) return;
  restartPending = v;
  listeners.forEach((l) => l());
}

export function needsDirectionChange(lang: Lang): boolean {
  return isRTL(lang) !== I18nManager.isRTL;
}

export async function applyDirection(lang: Lang): Promise<DirectionResult> {
  const canReload = __DEV__ && typeof DevSettings?.reload === 'function';
  const plan = directionPlan(lang, I18nManager.isRTL, Platform.OS, canReload);
  // Always written: idempotent, and reverting to the live direction resets a stale native flag.
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(plan.force);
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    document.documentElement.dir = plan.force ? 'rtl' : 'ltr';
  }
  setPending(plan.action === 'banner');
  if (plan.action === 'none') return 'unchanged';
  if (plan.action === 'reload') {
    try {
      await flushPersist(); // make sure the language choice is on disk before the bundle reloads
      DevSettings.reload();
      return 'reloading';
    } catch {
      setPending(true);
    }
  }
  return 'restart-required';
}
