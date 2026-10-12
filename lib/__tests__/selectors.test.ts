import { isTasbihOnlyChange, stripTasbih } from '../selectors';
import { initialState, type DateLog } from '../model';

const log = (over: Partial<DateLog> = {}): DateLog => ({ active: true, prayers: ['fajr'], tasbih: {}, ...over });

describe('stripTasbih', () => {
  it('drops tasbih counts', () => {
    const out = stripTasbih({ '2026-10-01': log({ tasbih: { a: 3 } }) }, null);
    expect(out['2026-10-01']).toEqual({ active: true, prayers: ['fajr'], tasbih: {} });
  });
  it('reuses the previous result when only tasbih counts changed', () => {
    const prayers = ['fajr' as const];
    const a = stripTasbih({ d: log({ prayers, tasbih: { a: 1 } }) }, null);
    const b = stripTasbih({ d: log({ prayers, tasbih: { a: 2 } }) }, a);
    expect(b).toBe(a);
  });
  it('returns a new result when prayers, active flags or dates change', () => {
    const a = stripTasbih({ d: log() }, null);
    expect(stripTasbih({ d: log({ prayers: ['fajr', 'asr'] }) }, a)).not.toBe(a);
    expect(stripTasbih({ d: log({ active: false, prayers: a.d.prayers }) }, a)).not.toBe(a);
    expect(stripTasbih({ d: log({ prayers: a.d.prayers }), e: log() }, a)).not.toBe(a);
  });
});

describe('isTasbihOnlyChange', () => {
  const base = () => {
    const s = initialState();
    s.dates['2026-10-01'] = log({ tasbih: { a: 1 } });
    return s;
  };
  it('is true when only a tasbih count moved', () => {
    const prev = base();
    const next = { ...prev, dates: { ...prev.dates, '2026-10-01': { ...prev.dates['2026-10-01'], tasbih: { a: 2 } } } };
    expect(isTasbihOnlyChange(prev, next)).toBe(true);
  });
  it('is false when a day becomes active, a new date appears, or another slice changes', () => {
    const prev = base();
    prev.dates['2026-10-01'].active = false;
    const activated = { ...prev, dates: { '2026-10-01': { ...prev.dates['2026-10-01'], active: true, tasbih: { a: 2 } } } };
    expect(isTasbihOnlyChange(prev, activated)).toBe(false);
    const p2 = base();
    expect(isTasbihOnlyChange(p2, { ...p2, dates: { ...p2.dates, '2026-10-02': log() } })).toBe(false);
    expect(isTasbihOnlyChange(p2, { ...p2, planDays: { '1:1': { completedTaskIds: ['x'] } } })).toBe(false);
  });
});
