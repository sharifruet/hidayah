/**
 * Calendar-date helpers in the device's local time zone.
 *
 * Never derive "today" from `toISOString()` — that is the UTC date, which in Bangladesh
 * (UTC+6) is still yesterday between midnight and 6 AM.
 */

/** "YYYY-MM-DD" for the given instant in the device's local time zone. */
export function localISODate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Local midnight of a "YYYY-MM-DD" string (`new Date('YYYY-MM-DD')` would parse it as UTC). */
export function parseLocalISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Local date `days` after `date` (negative for before), at local midnight. */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}
