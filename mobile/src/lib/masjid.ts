import { formatDistanceToNow, format, parseISO } from 'date-fns';

import { tr } from '../data/translations';
import type { LanguageCode } from './constants';
import { JAMAH_PRAYERS, type JamahPrayer, type JamahTimes, type JamahUpdate } from './services/masjids';

export const TIME_HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Form state for the six jamah fields: '' means "not set / clear". */
export type JamahForm = Record<JamahPrayer, string>;

export function prayerLabel(prayer: JamahPrayer, language: LanguageCode): string {
  return prayer === 'jumuah' ? tr('masjid_jumuah', language) : tr(`prayer_${prayer}`, language);
}

export function relativeTime(iso?: string | null): string {
  if (!iso) return '';
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return '';
  }
}

export function absoluteTime(iso?: string | null): string {
  if (!iso) return '';
  try {
    return format(parseISO(iso), 'dd MMM yyyy, HH:mm');
  } catch {
    return '';
  }
}

export function formatDistance(km?: number | null): string {
  if (km == null) return '';
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** Minutes from `a` to `b` ('HH:MM'); null if either is missing. */
export function minutesBetween(a?: string | null, b?: string | null): number | null {
  if (!a || !b) return null;
  const [ah, am] = a.split(':').map(Number);
  const [bh, bm] = b.split(':').map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}

export function jamahToForm(jamah?: JamahTimes | null): JamahForm {
  return Object.fromEntries(JAMAH_PRAYERS.map((p) => [p, jamah?.[p] ?? ''])) as JamahForm;
}

/** '' → null so the API clears the prayer; non-empty values are sent as-is. */
export function jamahFormToUpdate(form: JamahForm): JamahUpdate {
  return Object.fromEntries(JAMAH_PRAYERS.map((p) => [p, form[p] ? form[p] : null])) as JamahUpdate;
}

/** Only the set prayers, for a create payload. */
export function jamahFormToTimes(form: JamahForm): JamahTimes | undefined {
  const entries = JAMAH_PRAYERS.filter((p) => form[p]).map((p) => [p, form[p]]);
  return entries.length ? (Object.fromEntries(entries) as JamahTimes) : undefined;
}

export function jamahFormIsValid(form: JamahForm): boolean {
  return JAMAH_PRAYERS.every((p) => !form[p] || TIME_HH_MM.test(form[p]));
}

/**
 * Normalise raw keypad input into "HH:MM" as the user types:
 * strips non-digits and inserts the colon after two digits.
 */
export function maskTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}
