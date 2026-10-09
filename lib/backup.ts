import type { DateKey } from './day';
import { convertLegacyNafs } from './legacy';
import type { PersistedState } from './model';

export type BackupError = 'invalid_json' | 'not_awdah' | 'unsupported_version' | 'invalid_shape';
export type BackupResult = { ok: true; data: PersistedState } | { ok: false; error: BackupError };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export function serializeBackup(state: PersistedState, now: Date): string {
  return JSON.stringify({ app: 'awdah', schema: 1, exportedAt: now.toISOString(), data: state }, null, 2);
}

function isValidState(d: unknown): d is PersistedState {
  if (!isObj(d)) return false;
  if (d.schema !== 1) return false;
  if (!(d.profile === null || isObj(d.profile))) return false;
  if (!isObj(d.settings)) return false;
  if (typeof d.cycle !== 'number' || !Number.isInteger(d.cycle) || d.cycle < 1) return false;
  if (!(d.planStartDate === null || (typeof d.planStartDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.planStartDate)))) return false;
  if (!isObj(d.planDays) || !Object.values(d.planDays).every((p) => isObj(p) && Array.isArray(p.completedTaskIds))) return false;
  if (!isObj(d.dates) || !Object.values(d.dates).every((x) => isObj(x) && Array.isArray(x.prayers) && isObj(x.tasbih))) return false;
  if (!isObj(d.milestones)) return false;
  return true;
}

export function parseBackup(json: string, today: DateKey): BackupResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'invalid_json' };
  }
  if (!isObj(parsed)) return { ok: false, error: 'not_awdah' };

  if (parsed.app !== 'awdah') {
    if ('state' in parsed) {
      const legacy = convertLegacyNafs(parsed.state, today);
      return legacy ? { ok: true, data: legacy } : { ok: false, error: 'invalid_shape' };
    }
    return { ok: false, error: 'not_awdah' };
  }
  if (parsed.schema !== 1) return { ok: false, error: 'unsupported_version' };
  if (!isValidState(parsed.data)) return { ok: false, error: 'invalid_shape' };
  return { ok: true, data: parsed.data };
}
