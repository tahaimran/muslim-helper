import { useCallback, useEffect, useRef, useState } from 'react';
import { showToast } from '@/components/Toast';
import i18n from './i18n';
import { parseBackup } from './backup';
import { toDateKey } from './day';
import type { PersistedState } from './model';
import { appStore } from './store';
import { exportBackup, pickBackup } from './platform/backupFile';
import { rescheduleFromStore } from './platform/notify';

const CONFIRM_WINDOW_MS = 6000;

/** Save/restore backup files. Restore is two steps: pick a valid file, then tap again to replace. */
export function useBackup() {
  const [pending, setPending] = useState<PersistedState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const save = useCallback(async () => {
    const r = await exportBackup();
    if (!r.ok) showToast(i18n.t(r.reason === 'unavailable' ? 'backup.unavailable' : 'backup.saveFailed'), 'error');
  }, []);

  const restore = useCallback(async () => {
    if (pending) {
      const data = pending;
      if (timer.current) clearTimeout(timer.current);
      setPending(null);
      appStore.getState().replaceAll(data);
      await rescheduleFromStore();
      showToast(i18n.t('backup.restored'));
      return;
    }
    const picked = await pickBackup();
    if (!picked.ok) {
      if (picked.reason === 'failed') showToast(i18n.t('backup.error.read'), 'error');
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
  }, [pending]);

  return { save, restore, confirming: pending !== null };
}
