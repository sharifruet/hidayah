/**
 * Localized date-fns formatting for display. date-fns ships bn/tr/id locales; Urdu has none
 * in date-fns v2, so it falls back to English month/day names (use `formatDate` from
 * `format.js` — Intl-based — where Urdu names matter). Bangla output also gets Bangla digits.
 *
 * Only for *display*: keep plain `format(date, 'yyyy-MM-dd')` for API params, keys and storage.
 */
import { format } from 'date-fns';
import { bn, tr, id, enUS } from 'date-fns/locale';
import { localDigits } from './format.js';

const LOCALES = { en: enUS, bn, tr, id, ur: enUS };

export function dateFnsLocale(language) {
  return LOCALES[language] || enUS;
}

export function formatDateL(date, pattern, language) {
  if (!date) return '';
  return localDigits(format(date, pattern, { locale: dateFnsLocale(language) }), language);
}
