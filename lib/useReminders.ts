import { useCallback } from 'react';
import { showToast } from '@/components/Toast';
import i18n from './i18n';
import type { Settings } from './model';
import { appStore } from './store';
import { ensurePermission, notificationsSupported } from './platform/notify';

type Reminders = Settings['reminders'];

/** Reminder toggles: enabling asks for permission and reverts (with a gentle toast) on denial. */
export function useReminders() {
  const update = useCallback(async (patch: Partial<Reminders>) => {
    const enabling = patch.daily === true || patch.prayers === true;
    if (enabling) {
      if (!notificationsSupported()) {
        showToast(i18n.t('reminders.unavailable'), 'error');
        return;
      }
      if (!(await ensurePermission())) {
        showToast(i18n.t('reminders.denied'), 'error');
        return;
      }
    }
    const { settings, updateSettings } = appStore.getState(); // re-read after the permission prompt
    // The root layout re-plans notifications whenever reminders change.
    updateSettings({ reminders: { ...settings.reminders, ...patch } });
  }, []);
  return update;
}
