// Tabular-approximation Gregorian → Hijri conversion (Kuwaiti algorithm style).
// Good enough for calendar display; not for religious rulings requiring moon-sighting —
// which is why the user can shift it ±2 days (Bangladesh often starts a month a day
// after Saudi Arabia). Every conversion applies that saved offset by default.
import { storage } from './storage';
import { addDays } from './dates';
import { localDigits } from './format';
import { tr } from '../data/translations';
import type { LanguageCode } from './constants';

export const HIJRI_OFFSET_KEY = 'app_hijri_offset';
export const HIJRI_OFFSET_RANGE = [-2, -1, 0, 1, 2] as const;

/** The user's moon-sighting adjustment in days (-2…2). */
export function getHijriOffset(): number {
  const n = Number(storage.getString(HIJRI_OFFSET_KEY) ?? 0);
  return Number.isInteger(n) && n >= -2 && n <= 2 ? n : 0;
}

export const HIJRI_MONTH_NAMES_EN = [
  'Muharram',
  'Safar',
  "Rabi' al-awwal",
  "Rabi' al-thani",
  'Jumada al-ula',
  'Jumada al-akhirah',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qa'dah",
  'Dhu al-Hijjah',
];

export const HIJRI_MONTH_NAMES_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

export const HIJRI_MONTH_NAMES_BN = [
  'মুহাররম',
  'সফর',
  'রবিউল আউয়াল',
  'রবিউস সানি',
  'জমাদিউল আউয়াল',
  'জমাদিউস সানি',
  'রজব',
  'শাবান',
  'রমজান',
  'শাওয়াল',
  'জিলকদ',
  'জিলহজ',
];

export const HIJRI_MONTH_NAMES_UR = [
  'محرم',
  'صفر',
  'ربیع الاول',
  'ربیع الثانی',
  'جمادی الاول',
  'جمادی الثانی',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذوالقعدہ',
  'ذوالحجہ',
];

export const HIJRI_MONTH_NAMES_TR = [
  'Muharrem',
  'Safer',
  'Rebiülevvel',
  'Rebiülahir',
  'Cemaziyelevvel',
  'Cemaziyelahir',
  'Recep',
  'Şaban',
  'Ramazan',
  'Şevval',
  'Zilkade',
  'Zilhicce',
];

export const HIJRI_MONTH_NAMES_ID = [
  'Muharram',
  'Safar',
  'Rabiul Awal',
  'Rabiul Akhir',
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rajab',
  'Syakban',
  'Ramadan',
  'Syawal',
  'Zulkaidah',
  'Zulhijah',
];

const HIJRI_MONTH_NAMES: Record<string, string[]> = {
  en: HIJRI_MONTH_NAMES_EN,
  bn: HIJRI_MONTH_NAMES_BN,
  ur: HIJRI_MONTH_NAMES_UR,
  tr: HIJRI_MONTH_NAMES_TR,
  id: HIJRI_MONTH_NAMES_ID,
};

/** Month name in the UI language (English transliteration for anything unknown). */
export function hijriMonthName(month: number, language: string): string {
  return (HIJRI_MONTH_NAMES[language] ?? HIJRI_MONTH_NAMES_EN)[month - 1] ?? '';
}

/** "12 রমজান ১৪৪৭ হিজরি" / "12 Ramadan 1447 AH" in the UI language. */
export function formatHijriDate(
  h: { day: number; month: number; year: number },
  language: LanguageCode,
  { era = true, day = true }: { era?: boolean; day?: boolean } = {}
): string {
  const parts = [day ? String(h.day) : '', hijriMonthName(h.month, language), String(h.year), era ? tr('hijri_era', language) : '']
    .filter(Boolean)
    .join(' ');
  return localDigits(parts, language);
}

export interface HijriDate {
  year: number;
  month: number; // 1-12
  day: number;
  monthNameEn: string;
  monthNameAr: string;
}

export function gregorianToHijri(input: Date, offset: number = getHijriOffset()): HijriDate {
  const date = offset ? addDays(input, offset) : input;
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();

  // (month - 14) / 12 must truncate toward zero like the algorithm's integer division —
  // flooring it shifts every date from March to December by two days.
  const jd =
    Math.floor((1461 * (gYear + 4800 + Math.trunc((gMonth - 14) / 12))) / 4) +
    Math.floor((367 * (gMonth - 2 - 12 * Math.trunc((gMonth - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((gYear + 4900 + Math.trunc((gMonth - 14) / 12)) / 100)) / 4) +
    gDay -
    32075;

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const hMonth = Math.floor((24 * l3) / 709);
  const hDay = l3 - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  return {
    year: hYear,
    month: hMonth,
    day: hDay,
    monthNameEn: HIJRI_MONTH_NAMES_EN[hMonth - 1] || '',
    monthNameAr: HIJRI_MONTH_NAMES_AR[hMonth - 1] || '',
  };
}

/** Rough day-count until the 1st of a given Hijri month (used for "days until Ramadan" banners). */
export function daysUntilHijriMonth(targetMonth: number, from: Date = new Date()): number {
  const HIJRI_YEAR_DAYS = 354.36667;
  const current = gregorianToHijri(from);
  let monthsAway = targetMonth - current.month;
  if (monthsAway < 0 || (monthsAway === 0 && current.day > 1)) monthsAway += 12;
  const avgMonthDays = HIJRI_YEAR_DAYS / 12;
  const daysAway = Math.round(monthsAway * avgMonthDays - (current.day - 1));
  return Math.max(daysAway, 0);
}

/**
 * Local date of the next occurrence (on or after `from`) of a Hijri month/day, honouring
 * the offset. Returns null only if none falls within ~13 months (can't happen for valid input).
 */
export function nextGregorianForHijri(month: number, day: number, from: Date = new Date(), offset = getHijriOffset()): Date | null {
  const start = addDays(from, 0);
  for (let i = 0; i < 400; i++) {
    const d = addDays(start, i);
    const h = gregorianToHijri(d, offset);
    if (h.month === month && h.day === day) return d;
  }
  return null;
}

/** All local dates of the Hijri month containing / following `from` for `month` (e.g. Ramadan). */
export function hijriMonthDays(month: number, from: Date = new Date(), offset = getHijriOffset()): Date[] {
  const today = gregorianToHijri(from, offset);
  const first =
    today.month === month ? addDays(from, 1 - today.day) : nextGregorianForHijri(month, 1, from, offset);
  if (!first) return [];
  const days: Date[] = [];
  for (let i = 0; i < 30; i++) {
    const d = addDays(first, i);
    if (gregorianToHijri(d, offset).month !== month) break;
    days.push(d);
  }
  return days;
}
