import { backupFileName } from '../backupName';

describe('backupFileName', () => {
  it('embeds the local date', () => {
    expect(backupFileName('2026-10-09')).toBe('awdah-backup-2026-10-09.json');
  });
});
