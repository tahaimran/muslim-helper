import type { DateKey } from './day';

/** File name for a backup made on the given local day, e.g. awdah-backup-2026-10-09.json. */
export function backupFileName(today: DateKey): string {
  return `awdah-backup-${today}.json`;
}
