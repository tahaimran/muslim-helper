import { Platform } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { showToast } from '@/components/Toast';
import i18n from './i18n';
import { parseBackup } from './backup';
import { toDateKey } from './day';
import type { PersistedState } from './model';
import { appStore } from './store';
import { exportBackup, pickBackup } from './platform/backupFile';
import { pauseIfPermissionRevoked } from './platform/notify';

const CONFIRM_WINDOW_MS = 10000;

/** Save/restore backup files. Restore is two steps: pick a valid file, then tap again to replace. */
export function useBackup() {
  const [pending, setPending] = useState<PersistedState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const busy = useRef(false);

  const save = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const r = await exportBackup();
      if (!r.ok) showToast(i18n.t(r.reason === 'unavailable' ? 'backup.unavailable' : 'backup.saveFailed'), 'error');
    } finally {
      busy.current = false;
    }
  }, []);

  const restore = useCallback(async () => {
    if (busy.current) return;
    if (Platform.OS === 'web') {
      showToast(i18n.t('backup.unavailable'), 'error');
      return;
    }
    busy.current = true;
    try {
      await doRestore();
    } finally {
      busy.current = false;
    }
  }, [pending]); // eslint-disable-line react-hooks/exhaustive-deps

  async function doRestore() {
    if (pending) {
      const data = pending;
      if (timer.current) clearTimeout(timer.current);
      setPending(null);
      appStore.getState().replaceAll(data);
      // The root layout re-plans notifications when reminders/location change; here we only
      // switch reminders off if the OS permission is gone.
      await pauseIfPermissionRevoked();
      showToast(i18n.t('backup.restored'));
      return;
    }
    const picked = await pickBackup();
    if (!picked.ok) {
      if (picked.reason === 'failed') showToast(i18n.t('backup.error.read'), 'error');
      if (picked.reason === 'tooLarge') showToast(i18n.t('backup.error.tooLarge'), 'error');
      return;
    }
    const parsed = parseBackup(picked.json, toDateKey(new Date()));
    if (!parsed.ok) {
      showToast(i18n.t(`backup.error.${parsed.error}`), 'error');
      return;
    }
    setPending(parsed.data);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPending(null), CONFIRM_WINDOW_MS);
  }

  return { save, restore, confirming: pending !== null };
}
