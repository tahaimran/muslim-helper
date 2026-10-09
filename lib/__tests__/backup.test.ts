import { parseBackup, serializeBackup } from '../backup';
import { initialState } from '../model';

const sample = () => {
  const s = initialState();
  s.profile = { name: 'Maryam', prayerHabit: 'most', knowledgeLevel: 'intermediate', focusAreas: ['dhikr'], dailyMinutes: 30 };
  s.planStartDate = '2026-10-01';
  s.planDays['1:1'] = { completedTaskIds: ['1_fajr'], journal: 'hi' };
  s.dates['2026-10-01'] = { active: true, prayers: ['fajr'], tasbih: { subhanallah: 33 } };
  return s;
};

describe('backup', () => {
  it('round-trips', () => {
    const json = serializeBackup(sample(), new Date('2026-10-09T10:00:00Z'));
    expect(JSON.parse(json)).toMatchObject({ app: 'awdah', schema: 1, exportedAt: '2026-10-09T10:00:00.000Z' });
    expect(parseBackup(json, '2026-10-09')).toEqual({ ok: true, data: sample() });
  });
  it('rejects invalid json', () => {
    expect(parseBackup('{nope', '2026-10-09')).toEqual({ ok: false, error: 'invalid_json' });
  });
  it('rejects other apps', () => {
    expect(parseBackup(JSON.stringify({ hello: 1 }), '2026-10-09')).toEqual({ ok: false, error: 'not_awdah' });
  });
  it('rejects newer schema versions', () => {
    expect(parseBackup(JSON.stringify({ app: 'awdah', schema: 2, data: {} }), '2026-10-09')).toEqual({ ok: false, error: 'unsupported_version' });
  });
  it('rejects malformed data', () => {
    const bad = { app: 'awdah', schema: 1, data: { ...sample(), dates: 'oops' } };
    expect(parseBackup(JSON.stringify(bad), '2026-10-09')).toEqual({ ok: false, error: 'invalid_shape' });
    const badCycle = { app: 'awdah', schema: 1, data: { ...sample(), cycle: 0 } };
    expect(parseBackup(JSON.stringify(badCycle), '2026-10-09')).toEqual({ ok: false, error: 'invalid_shape' });
  });
  it('accepts old Nafs exports', () => {
    const old = { state: { isOnboarded: true, userProfile: { name: 'Old' }, dayProgress: {} }, exportedAt: 'x', version: 1 };
    const res = parseBackup(JSON.stringify(old), '2026-10-09');
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.data.profile?.name).toBe('Old');
  });
});
