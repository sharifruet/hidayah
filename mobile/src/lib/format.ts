/**
 * Locale-aware display of numbers and times. Bangla gets Bangla numerals (০–৯) and 12-hour
 * times prefixed with the part of day (ভোর ৪:৫২, দুপুর ১২:০৫, সন্ধ্যা ৬:১০) — how clocks are
 * read aloud in Bangladesh. Other languages get 12-hour "4:52 AM" (or 24-hour if chosen).
 *
 * Internal data stays "HH:MM" / ASCII digits; only format at the point of display.
 * Mirrors `frontend/src/utils/format.js`.
 */
import { formatDistanceToNow, type Locale } from 'date-fns';
import { bn, id, tr } from 'date-fns/locale';

import { storage } from './storage';
import { LOCALE_MAP, type LanguageCode } from './constants';

export type TimeFormat = '12h' | '24h';
export const TIME_FORMAT_KEY = 'app_time_format';

export function getTimeFormat(): TimeFormat {
  return storage.getString(TIME_FORMAT_KEY) === '24h' ? '24h' : '12h';
}

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** Replace ASCII digits with the language's own numerals (Bangla only, for now). */
export function localDigits(input: string | number, language: LanguageCode | string): string {
  const s = String(input);
  return language === 'bn' ? s.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]) : s;
}

/** Whole or decimal number with South Asian grouping for bn ("১২,৩৪৫"). */
export function formatNumber(n: number, language: LanguageCode | string, maxFractionDigits = 0): string {
  const s = n.toLocaleString('en-IN', { maximumFractionDigits: maxFractionDigits });
  return localDigits(s, language);
}

/** Bangla part-of-day for an hour 0–23. */
export function bnDayPeriod(hour: number): string {
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
  hhmm: string | null | undefined,
  language: LanguageCode | string,
  format: TimeFormat = getTimeFormat(),
  { withPeriod = true }: { withPeriod?: boolean } = {}
): string {
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
export function formatClock(date: Date, language: LanguageCode | string, format: TimeFormat = getTimeFormat()): string {
  return formatTime(`${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`, language, format);
}

const DURATION_UNITS: Record<string, { h: string; m: string }> = {
  en: { h: 'h', m: 'm' },
  bn: { h: ' ঘণ্টা', m: ' মিনিট' },
  ur: { h: ' گھنٹے', m: ' منٹ' },
  tr: { h: ' sa', m: ' dk' },
  id: { h: ' jam', m: ' menit' },
};

/** Minutes → "1h 20m" / "১ ঘণ্টা ২০ মিনিট" / "1 sa 20 dk". */
export function formatDuration(totalMinutes: number, language: LanguageCode | string): string {
  const mins = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const u = DURATION_UNITS[language] ?? DURATION_UNITS.en;
  return localDigits(h > 0 ? `${h}${u.h} ${m}${u.m}` : `${m}${u.m}`, language);
}

/** `Date#toLocaleDateString` in the UI language, with the language's numerals. */
export function formatDate(date: Date, language: LanguageCode, options: Intl.DateTimeFormatOptions): string {
  return localDigits(date.toLocaleDateString(LOCALE_MAP[language] ?? 'en-US', options), language);
}

/** Seconds → "H:MM:SS" countdown in the language's numerals. */
export function formatCountdownSeconds(totalSeconds: number, language: LanguageCode | string): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return localDigits(`${hh}:${mm}:${ss}`, language);
}

// date-fns has no Urdu locale; ur falls back to English.
const DATE_FNS_LOCALES: Partial<Record<string, Locale>> = { bn, tr, id };

/** "3 days ago" / "৩ দিন আগে" / "3 gün önce" in the UI language. */
export function formatRelative(date: Date | number, language: LanguageCode | string): string {
  return localDigits(formatDistanceToNow(date, { addSuffix: true, locale: DATE_FNS_LOCALES[language] }), language);
}
