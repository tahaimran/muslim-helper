import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import i18n from '../i18n';
import { appStore, getPersisted } from '../store';
import { serializeBackup } from '../backup';
import { backupFileName } from '../backupName';
import { toDateKey } from '../day';

// Uses the SDK 54 object API (File/Paths) from 'expo-file-system'; the legacy module is deprecated.

const MAX_BYTES = 5 * 1024 * 1024;

function removeQuietly(file: File): void {
  try {
    if (file.exists) file.delete();
  } catch {
    // best effort: the cache is cleared by the system anyway
  }
}

export async function exportBackup(): Promise<{ ok: true } | { ok: false; reason: 'unavailable' | 'failed' }> {
  try {
    if (Platform.OS === 'web' || !(await Sharing.isAvailableAsync())) return { ok: false, reason: 'unavailable' };
    const now = new Date();
    const file = new File(Paths.cache, backupFileName(toDateKey(now)));
    // The temp file is removed even when creating or writing it fails part-way.
    try {
      file.create({ overwrite: true });
      file.write(serializeBackup(getPersisted(appStore.getState()), now));
      await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: i18n.t('backup.shareTitle') });
    } finally {
      removeQuietly(file);
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'failed' };
  }
}

export async function pickBackup(): Promise<{ ok: true; json: string } | { ok: false; reason: 'cancelled' | 'failed' | 'tooLarge' }> {
  let copy: File | null = null;
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/plain', '*/*'],
      copyToCacheDirectory: true,
    });
    if (res.canceled || !res.assets?.[0]) return { ok: false, reason: 'cancelled' };
    copy = new File(res.assets[0].uri);
    if ((res.assets[0].size ?? copy.size) > MAX_BYTES) return { ok: false, reason: 'tooLarge' };
    const json = await copy.text();
    return { ok: true, json };
  } catch {
    return { ok: false, reason: 'failed' };
  } finally {
    if (copy) removeQuietly(copy);
  }
}
