import { needsDirectionChange } from '../direction';

describe('needsDirectionChange', () => {
  it('is false when direction already matches', () => {
    expect(needsDirectionChange('en', false)).toBe(false);
    expect(needsDirectionChange('tr', false)).toBe(false);
    expect(needsDirectionChange('ar', true)).toBe(false);
    expect(needsDirectionChange('ur', true)).toBe(false);
  });
  it('is true when switching between LTR and RTL languages', () => {
    expect(needsDirectionChange('ar', false)).toBe(true);
    expect(needsDirectionChange('ur', false)).toBe(true);
    expect(needsDirectionChange('en', true)).toBe(true);
    expect(needsDirectionChange('id', true)).toBe(true);
  });
});
