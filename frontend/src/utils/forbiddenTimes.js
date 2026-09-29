/**
 * The three windows in which voluntary salah is prohibited — while the sun rises, at its
 * zenith (zawal) and while it sets — derived from the day's times. Approximate; mirrors
 * `mobile/src/lib/forbiddenTimes.ts`.
 */
const SUNRISE_MINUTES = 15;
const ZAWAL_MINUTES = 6;
const SUNSET_MINUTES = 15;

const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const fromMinutes = (total) => {
  const m = ((Math.round(total) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/** [{ key: 'sunrise'|'zawal'|'sunset', start, end }] */
export function forbiddenWindows(times) {
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

export function activeForbiddenWindow(times, now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  return forbiddenWindows(times).find((w) => mins >= toMinutes(w.start) && mins < toMinutes(w.end)) ?? null;
}
