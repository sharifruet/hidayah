/**
 * The three windows in which voluntary salah is prohibited (makruh tahrimi): while the sun
 * rises, at its zenith (zawal) and while it sets. Derived from the day's calculated times:
 *
 * - sunrise: from sunrise until ~15 minutes after (the sun "a spear's length" high)
 * - zawal:   the few minutes before Dhuhr begins (Dhuhr is set 1 min after solar noon)
 * - sunset:  from ~15 minutes before sunset until the sun has fully set
 */
import type { PrayerTimesResponse } from './services/prayer';

export type ForbiddenKey = 'sunrise' | 'zawal' | 'sunset';

export interface ForbiddenWindow {
  key: ForbiddenKey;
  start: string;
  end: string;
}

const SUNRISE_MINUTES = 15;
const ZAWAL_MINUTES = 6;
const SUNSET_MINUTES = 15;

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number): string {
  const m = ((Math.round(total) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

export function forbiddenWindows(times?: PrayerTimesResponse['times']): ForbiddenWindow[] {
  if (!times?.sunrise || !times.dhuhr || !times.sunset) return [];
  const sunrise = toMinutes(times.sunrise);
  const dhuhr = toMinutes(times.dhuhr);
  const sunset = toMinutes(times.sunset);
  return [
    { key: 'sunrise', start: fromMinutes(sunrise), end: fromMinutes(sunrise + SUNRISE_MINUTES) },
    { key: 'zawal', start: fromMinutes(dhuhr - ZAWAL_MINUTES), end: fromMinutes(dhuhr) },
    { key: 'sunset', start: fromMinutes(sunset - SUNSET_MINUTES), end: fromMinutes(sunset) },
  ];
}

/** The window `now` falls in, if any. */
export function activeForbiddenWindow(times: PrayerTimesResponse['times'] | undefined, now: Date = new Date()): ForbiddenWindow | null {
  const mins = now.getHours() * 60 + now.getMinutes();
  return forbiddenWindows(times).find((w) => mins >= toMinutes(w.start) && mins < toMinutes(w.end)) ?? null;
}
