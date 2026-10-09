import citiesData from '../content/cities.json';

export interface City {
  name: string;
  country: string; // ISO 3166-1 alpha-2
  lat: number;
  lng: number;
}

export const CITIES: City[] = citiesData as City[];

const EARTH_RADIUS_KM = 6371;
const rad = (deg: number) => (deg * Math.PI) / 180;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** The bundled city closest to the given point (great-circle distance). */
export function nearestCity(lat: number, lng: number): City {
  let best = CITIES[0];
  let bestDist = Infinity;
  for (const c of CITIES) {
    const d = haversineKm(lat, lng, c.lat, c.lng);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}

const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const FOLDED = CITIES.map((c) => ({ city: c, key: fold(c.name) }));

/** Case- and diacritic-insensitive search: prefix matches first, then substring matches. */
export function searchCities(query: string, limit = 30): City[] {
  const q = fold(query);
  if (!q) return [];
  const prefix: City[] = [];
  const inner: City[] = [];
  for (const { city, key } of FOLDED) {
    if (key.startsWith(q)) prefix.push(city);
    else if (key.includes(q)) inner.push(city);
  }
  return [...prefix, ...inner].slice(0, limit);
}
