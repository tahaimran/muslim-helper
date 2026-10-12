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

describe('searchCities aliases', () => {
  it('finds cities by their common alternative names', () => {
    expect(searchCities('Mecca')[0].name).toBe('Makkah');
    expect(searchCities('makka')[0].name).toBe('Makkah');
    expect(searchCities('Medina')[0].name).toBe('Madinah');
    expect(searchCities('Al-Quds')[0].name).toBe('Jerusalem');
    expect(searchCities('Calcutta')[0].name).toBe('Kolkata');
    expect(searchCities('bombay')[0].name).toBe('Mumbai');
    expect(searchCities('Madras')[0].name).toBe('Chennai');
    expect(searchCities('Bangalore')[0].name).toBe('Bengaluru');
    expect(searchCities('Rangoon')[0].name).toBe('Yangon');
  });
  it('lists a city once even when its name and alias both match', () => {
    const hits = searchCities('mad').filter((c) => c.name === 'Madinah');
    expect(hits).toHaveLength(1);
  });
  it('keeps aliases well-formed', () => {
    for (const c of CITIES) {
      if (c.aliases === undefined) continue;
      expect(Array.isArray(c.aliases)).toBe(true);
      for (const a of c.aliases) expect(a.trim().length).toBeGreaterThan(0);
    }
  });
});
