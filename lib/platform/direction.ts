import { DevSettings, I18nManager } from 'react-native';
import { needsDirectionChange as needsChange } from '../direction';
import { isRTL } from '../i18n';
import type { Lang } from '../model';

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
  return needsChange(lang, I18nManager.isRTL);
}

export async function applyDirection(lang: Lang): Promise<DirectionResult> {
  if (!needsDirectionChange(lang)) {
    setPending(false);
    return 'unchanged';
  }
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(isRTL(lang));
  if (__DEV__) {
    try {
      DevSettings.reload();
      return 'reloading';
    } catch {
      // fall through to the banner
    }
  }
  setPending(true);
  return 'restart-required';
}
