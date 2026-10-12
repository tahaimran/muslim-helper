import { directionPlan, needsDirectionChange } from '../direction';

describe('needsDirectionChange', () => {
  it('is false when direction already matches', () => {
    expect(needsDirectionChange('en', false)).toBe(false);
    expect(needsDirectionChange('ar', true)).toBe(false);
  });
  it('is true when switching between LTR and RTL languages', () => {
    expect(needsDirectionChange('ar', false)).toBe(true);
    expect(needsDirectionChange('ur', false)).toBe(true);
    expect(needsDirectionChange('en', true)).toBe(true);
    expect(needsDirectionChange('id', true)).toBe(true);
  });
});

describe('directionPlan', () => {
  it('does nothing when the live direction matches', () => {
    expect(directionPlan('en', false, 'ios', false)).toEqual({ force: false, action: 'none' });
    expect(directionPlan('ar', true, 'android', true)).toEqual({ force: true, action: 'none' });
  });
  it('reloads in dev and shows the banner otherwise', () => {
    expect(directionPlan('ar', false, 'ios', true)).toEqual({ force: true, action: 'reload' });
    expect(directionPlan('ur', false, 'android', false)).toEqual({ force: true, action: 'banner' });
  });
  it('revert to the live direction clears the banner and resets the flag', () => {
    expect(directionPlan('en', false, 'ios', false)).toEqual({ force: false, action: 'none' });
    expect(directionPlan('ar', true, 'ios', false)).toEqual({ force: true, action: 'none' });
  });
  it('never prompts on web', () => {
    expect(directionPlan('ar', false, 'web', true)).toEqual({ force: true, action: 'none' });
  });
});

describe('directionPlan on an RTL phone', () => {
  it('choosing an LTR language plans force=false so RTL is also disallowed natively', () => {
    // Arabic phone (live RTL) -> English: force false; applyDirection writes allowRTL(false) too.
    expect(directionPlan('en', true, 'android', false)).toEqual({ force: false, action: 'banner' });
    expect(directionPlan('tr', true, 'ios', true)).toEqual({ force: false, action: 'reload' });
  });
});
