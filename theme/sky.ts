import type { DailyPrayerTimes } from '../lib/prayerTimes';

export type SkyPhase = 'night' | 'fajr' | 'morning' | 'afternoon' | 'asr' | 'maghrib';

const NIGHT_TEXT = '#F4F1FA';
const DAY_TEXT = '#17203A';

export const SKY: Record<SkyPhase, { gradient: [string, string, string]; text: string; textMuted: string; isDark: boolean }> = {
  night:     { gradient: ['#0E1028', '#1B1F45', '#2C3163'], text: NIGHT_TEXT, textMuted: '#B9BCDA', isDark: true },
  fajr:      { gradient: ['#1E2250', '#3E3A72', '#6A5A8E'], text: NIGHT_TEXT, textMuted: '#D3CCE6', isDark: true },
  morning:   { gradient: ['#BFD8EE', '#D9E8F5', '#F1F6FB'], text: DAY_TEXT, textMuted: '#3A4565', isDark: false },
  afternoon: { gradient: ['#A9CBEA', '#C8DDF1', '#E6EFF8'], text: DAY_TEXT, textMuted: '#3A4565', isDark: false },
  asr:       { gradient: ['#E9CF9E', '#F0DDB6', '#F7EBD3'], text: DAY_TEXT, textMuted: '#4A4232', isDark: false },
  maghrib:   { gradient: ['#2E2850', '#5A3F6E', '#7E5577'], text: NIGHT_TEXT, textMuted: '#E2D2E2', isDark: true },
};

function byClock(h: number): SkyPhase {
  if (h < 5) return 'night';
  if (h < 7) return 'fajr';
  if (h < 12) return 'morning';
  if (h < 15) return 'afternoon';
  if (h < 18) return 'asr';
  if (h < 20) return 'maghrib';
  return 'night';
}

export function getSkyPhase(now: Date, times: DailyPrayerTimes | null): SkyPhase {
  if (!times) return byClock(now.getHours());
  const t = now.getTime();
  if (t < times.fajr.getTime()) return 'night';
  if (t < times.sunrise.getTime()) return 'fajr';
  if (t < times.dhuhr.getTime()) return 'morning';
  if (t < times.asr.getTime()) return 'afternoon';
  if (t < times.maghrib.getTime()) return 'asr';
  if (t < times.isha.getTime()) return 'maghrib';
  return 'night';
}
