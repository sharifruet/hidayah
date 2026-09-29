/**
 * Locale-aware display of numbers and times. Bangla gets Bangla numerals (০–৯) and 12-hour
 * times prefixed with the part of day (ভোর ৪:৫২, দুপুর ১২:০৫, সন্ধ্যা ৬:১০) — how clocks are
 * read aloud in Bangladesh. Other languages get 12-hour "4:52 AM" (or 24-hour if chosen).
 *
 * Internal data stays "HH:MM" / ASCII digits; only format at the point of display.
 * Mirrors `mobile/src/lib/format.ts`.
 */

export const TIME_FORMAT_KEY = 'app_time_format';

/** '12h' (default) or '24h'. */
export function getTimeFormat() {
  try {
    return localStorage.getItem(TIME_FORMAT_KEY) === '24h' ? '24h' : '12h';
  } catch {
    return '12h';
  }
}

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** Replace ASCII digits with the language's own numerals (Bangla only, for now). */
export function localDigits(input, language) {
  const s = String(input);
  return language === 'bn' ? s.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]) : s;
}

/** Whole or decimal number with South Asian grouping for bn ("১২,৩৪৫"). */
export function formatNumber(n, language, maxFractionDigits = 0) {
  const s = n.toLocaleString('en-IN', { maximumFractionDigits: maxFractionDigits });
  return localDigits(s, language);
}

/** Bangla part-of-day for an hour 0–23. */
export function bnDayPeriod(hour) {
  if (hour >= 4 && hour < 6) return 'ভোর';
  if (hour >= 6 && hour < 12) return 'সকাল';
  if (hour >= 12 && hour < 15) return 'দুপুর';
  if (hour >= 15 && hour < 17) return 'বিকাল';
  if (hour >= 17 && hour < 20) return 'সন্ধ্যা';
  return 'রাত';
}

/**
 * "HH:MM" → display time. `withPeriod: false` drops the ভোর/AM label (for tight columns
 * where the context already makes it obvious).
 */
export function formatTime(
  hhmm,
  language,
  format = getTimeFormat(),
  { withPeriod = true } = {}
) {
  if (!hhmm || !/^\d{1,2}:\d{2}/.test(hhmm)) return '--:--';
  const [h, m] = hhmm.split(':').map(Number);
  const mm = String(m).padStart(2, '0');
  if (format === '24h') return localDigits(`${String(h).padStart(2, '0')}:${mm}`, language);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  if (language === 'bn') {
    const t = localDigits(`${h12}:${mm}`, language);
    return withPeriod ? `${bnDayPeriod(h)} ${t}` : t;
  }
  return withPeriod ? `${h12}:${mm} ${h < 12 ? 'AM' : 'PM'}` : `${h12}:${mm}`;
}

/** Same as `formatTime` for a Date. */
export function formatClock(date, language, format = getTimeFormat()) {
  return formatTime(`${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`, language, format);
}

/** Minutes → "1h 20m" / "১ ঘণ্টা ২০ মিনিট". */
export function formatDuration(totalMinutes, language) {
  const mins = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (language === 'bn') {
    return localDigits(h > 0 ? `${h} ঘণ্টা ${m} মিনিট` : `${m} মিনিট`, language);
  }
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Seconds → "H:MM:SS" countdown in the language's numerals. */
export function formatCountdownSeconds(totalSeconds, language) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return localDigits(`${hh}:${mm}:${ss}`, language);
}

/** BCP-47 locale for each UI language — use for every `toLocale*String` display call. */
export const DATE_LOCALES = { en: 'en-US', bn: 'bn-BD', ur: 'ur-PK', tr: 'tr-TR', id: 'id-ID' };

export function localeFor(language) {
  return DATE_LOCALES[language] || DATE_LOCALES.en;
}

/**
 * Localized date via Intl (`toLocaleDateString`). `date` may be a Date or an ISO string
 * ("YYYY-MM-DD" is treated as a local date, not UTC midnight). Bangla digits are forced for bn.
 */
export function formatDate(date, language, options = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!date) return '';
  let d = date;
  if (typeof date === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(date);
  }
  if (Number.isNaN(d.getTime())) return '';
  return localDigits(d.toLocaleDateString(localeFor(language), options), language);
}

/** Localized "Month YYYY" heading. */
export function formatMonthYear(date, language) {
  return formatDate(date, language, { month: 'long', year: 'numeric' });
}

/**
 * Pick a localized data field: returns `bnValue` when the UI is Bangla and it is non-empty,
 * otherwise `fallback`. For *data* (names, translations stored per language) — UI strings
 * belong in `tr()` keys.
 */
export function bnOr(language, bnValue, fallback) {
  return language === 'bn' && bnValue ? bnValue : fallback;
}
