import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { nearestCity, type City } from './cities';
import { getCurrentCoords } from './platform/location';
import { useAppStore } from './store';

export type LocationError = 'denied' | 'unavailable' | null;

function countryName(code: string, lang: string): string {
  try {
    return new Intl.DisplayNames([lang], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** Saves a location to settings, from the device GPS (snapped to a bundled city for its label) or a chosen city. */
export function useLocationSetup() {
  const { t, i18n } = useTranslation();
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<LocationError>(null);

  const fromGps = useCallback(async (): Promise<boolean> => {
    if (busy) return false;
    setBusy(true);
    setError(null);
    try {
      const res = await getCurrentCoords();
      if (!res.ok) {
        setError(res.reason);
        return false;
      }
      const city = nearestCity(res.latitude, res.longitude);
      updateSettings({
        location: {
          latitude: res.latitude,
          longitude: res.longitude,
          label: t('location.near', { city: city.name }),
          countryCode: city.country,
        },
      });
      return true;
    } finally {
      setBusy(false);
    }
  }, [busy, t, updateSettings]);

  const chooseCity = useCallback(
    (city: City) => {
      setError(null);
      updateSettings({
        location: {
          latitude: city.lat,
          longitude: city.lng,
          label: t('location.cityLabel', { city: city.name, country: countryName(city.country, i18n.language) }),
          countryCode: city.country,
        },
      });
    },
    [i18n.language, t, updateSettings],
  );

  return { busy, error, fromGps, chooseCity };
}
