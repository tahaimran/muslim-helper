import { CITIES, nearestCity, searchCities } from '../cities';

describe('cities data', () => {
  it('has well-formed, unique entries', () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(250);
    const seen = new Set<string>();
    for (const c of CITIES) {
      expect(c.name.trim().length).toBeGreaterThan(0);
      expect(c.country).toMatch(/^[A-Z]{2}$/);
      expect(c.lat).toBeGreaterThanOrEqual(-90);
      expect(c.lat).toBeLessThanOrEqual(90);
      expect(c.lng).toBeGreaterThanOrEqual(-180);
      expect(c.lng).toBeLessThanOrEqual(180);
      const key = `${c.name}|${c.country}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });
});

describe('nearestCity', () => {
  it('finds London and Karachi', () => {
    expect(nearestCity(51.51, -0.13).name).toBe('London');
    expect(nearestCity(24.86, 67.0).country).toBe('PK');
  });
});

describe('searchCities', () => {
  it('ranks prefix matches first', () => {
    expect(searchCities('ist')[0].name).toBe('Istanbul');
  });
  it('finds Ankara', () => {
    expect(searchCities('Ankara').some((c) => c.name === 'Ankara')).toBe(true);
  });
  it('ignores diacritics and case', () => {
    expect(searchCities('dusseldorf').some((c) => c.name === 'Düsseldorf')).toBe(true);
    expect(searchCities('DÜSSEL').some((c) => c.name === 'Düsseldorf')).toBe(true);
  });
  it('falls back to substring, respects limit, empty query is empty', () => {
    expect(searchCities('bul').some((c) => c.name === 'Istanbul')).toBe(true);
    expect(searchCities('a', 5).length).toBe(5);
    expect(searchCities('  ')).toEqual([]);
  });
});
