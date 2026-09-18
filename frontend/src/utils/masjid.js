import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { PRAYER_LABELS, PRAYER_LABELS_BN } from './constants.js';
import { tr } from '../i18n/translations.js';

export const JAMAH_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumuah'];

/** Localised label for a jamah prayer key (jumuah isn't in the calculated-times labels). */
export function prayerLabel(key, language) {
  if (key === 'jumuah') return tr('masjid_jumuah', language);
  return (language === 'bn' ? PRAYER_LABELS_BN : PRAYER_LABELS)[key] || key;
}

/** "3 hours ago" style relative time; empty string for null. */
export function relativeTime(iso) {
  if (!iso) return '';
  try {
    return formatDistanceToNow(typeof iso === 'string' ? parseISO(iso) : iso, { addSuffix: true });
  } catch {
    return '';
  }
}

/** Absolute timestamp for tooltips / secondary text. */
export function absoluteTime(iso) {
  if (!iso) return '';
  try {
    return format(typeof iso === 'string' ? parseISO(iso) : iso, 'dd MMM yyyy, HH:mm');
  } catch {
    return '';
  }
}

export function formatDistance(km) {
  if (km == null) return '';
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
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
