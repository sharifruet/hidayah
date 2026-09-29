import { parseISO } from 'date-fns';
import { fmt, tr } from '../i18n/translations.js';
import { formatClock, formatDate, localDigits, localeFor } from './format.js';

export const JAMAH_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumuah'];

/** Localised label for a jamah prayer key (jumuah isn't in the calculated-times labels). */
export function prayerLabel(key, language) {
  return tr(key === 'jumuah' ? 'masjid_jumuah' : `prayer_${key}`, language);
}

const toDate = (iso) => (typeof iso === 'string' ? parseISO(iso) : iso);

// Largest unit first; the first one the elapsed time reaches is used ("3 days ago").
const RELATIVE_UNITS = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

/** "3 hours ago" style relative time in the UI language; empty string for null. */
export function relativeTime(iso, language = 'en') {
  if (!iso) return '';
  try {
    const d = toDate(iso);
    if (Number.isNaN(d.getTime())) return '';
    const seconds = (d.getTime() - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(localeFor(language), { numeric: 'auto' });
    const [unit, size] = RELATIVE_UNITS.find(([, s]) => Math.abs(seconds) >= s) ?? ['second', 1];
    const value = unit === 'second' ? 0 : Math.round(seconds / size); // < 1 min → "now"
    return localDigits(rtf.format(value, unit), language);
  } catch {
    return '';
  }
}

/** Absolute timestamp for tooltips / secondary text ("12 Mar 2025, 4:05 PM"). */
export function absoluteTime(iso, language = 'en', timeFormat) {
  if (!iso) return '';
  try {
    const d = toDate(iso);
    if (Number.isNaN(d.getTime())) return '';
    const date = formatDate(d, language, { day: 'numeric', month: 'short', year: 'numeric' });
    return `${date}, ${formatClock(d, language, timeFormat)}`;
  } catch {
    return '';
  }
}

/** Distance for display: metres under 1 km, else km (one decimal under 10 km). */
export function formatDistance(km, language = 'en') {
  if (km == null) return '';
  return km < 1
    ? fmt('pr_distance_m', language, { n: localDigits(Math.round(km * 1000), language) })
    : fmt('pr_distance_km', language, { n: localDigits(km.toFixed(km < 10 ? 1 : 0), language) });
}

export function googleMapsUrl(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function directionsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** Minutes between two 'HH:MM' strings (b - a); null if either is missing. */
export function minutesBetween(a, b) {
  if (!a || !b) return null;
  const [ah, am] = a.split(':').map(Number);
  const [bh, bm] = b.split(':').map(Number);
  return (bh * 60 + bm) - (ah * 60 + am);
}

/** Build the jamah body for the API from form state: '' → null (clear). */
export function jamahFormToBody(form) {
  return Object.fromEntries(JAMAH_PRAYERS.map(p => [p, form[p] ? form[p] : null]));
}

/** Form state from a masjid's jamah map (missing → ''). */
export function jamahToForm(jamah = {}) {
  return Object.fromEntries(JAMAH_PRAYERS.map(p => [p, jamah?.[p] || '']));
}
