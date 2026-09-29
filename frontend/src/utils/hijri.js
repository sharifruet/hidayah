// Simple Hijri (Islamic) calendar conversion utilities.
// Uses a tabular approximation suitable for calendar display.
// Based on the Kuwaiti algorithm style calculation.
// Every conversion applies the user's ±2-day moon-sighting adjustment (Bangladesh often
// starts a month a day after Saudi Arabia). Mirrors `mobile/src/lib/hijri.ts`.

import { localDigits } from './format.js';

export const HIJRI_OFFSET_KEY = 'app_hijri_offset';
export const HIJRI_OFFSET_RANGE = [-2, -1, 0, 1, 2];

/** The saved moon-sighting adjustment in days (-2…2). */
export function getHijriOffset() {
  try {
    const n = Number(localStorage.getItem(HIJRI_OFFSET_KEY) ?? 0);
    return Number.isInteger(n) && n >= -2 && n <= 2 ? n : 0;
  } catch {
    return 0;
  }
}

/** Local midnight `days` after `date`. */
export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

const HIJRI_MONTH_NAMES_EN = [
  'Muharram',
  'Safar',
  "Rabiʿ al-awwal",
  "Rabiʿ al-thani",
  'Jumada al-ula',
  'Jumada al-akhirah',
  'Rajab',
  "Shaʿban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qadah",
  "Dhu al-Hijjah"
];

const HIJRI_MONTH_NAMES_AR = [
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
  'ذو الحجة'
];

const HIJRI_MONTH_NAMES_BN = [
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
  'জিলহজ'
];

const HIJRI_MONTH_NAMES_UR = [
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
  'ذوالحجہ'
];

const HIJRI_MONTH_NAMES_TR = [
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
  'Zilhicce'
];

const HIJRI_MONTH_NAMES_ID = [
  'Muharram',
  'Safar',
  'Rabiulawal',
  'Rabiulakhir',
  'Jumadilawal',
  'Jumadilakhir',
  'Rajab',
  'Syakban',
  'Ramadan',
  'Syawal',
  'Zulkaidah',
  'Zulhijah'
];

const HIJRI_MONTH_NAMES = {
  en: HIJRI_MONTH_NAMES_EN,
  bn: HIJRI_MONTH_NAMES_BN,
  ur: HIJRI_MONTH_NAMES_UR,
  tr: HIJRI_MONTH_NAMES_TR,
  id: HIJRI_MONTH_NAMES_ID,
};

/** Month name in the UI language (English transliteration for unknown languages). */
export function hijriMonthName(month, language) {
  return (HIJRI_MONTH_NAMES[language] || HIJRI_MONTH_NAMES_EN)[month - 1] || '';
}

/** "12 Rabiʿ al-awwal 1448" / "১২ রবিউল আউয়াল ১৪৪৮" — day, localized month, year in the language's numerals. */
export function formatHijriDate(hijri, language) {
  return localDigits(`${hijri.day} ${hijriMonthName(hijri.month, language)} ${hijri.year}`, language);
}

// Convert a Gregorian date to Hijri using an approximate algorithm.
export function gregorianToHijri(input, offset = getHijriOffset()) {
  const date = offset ? addDays(input, offset) : input;
  const gYear = date.getFullYear();
  // The Julian-day formula below expects a 1-based month.
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();

  // Julian day for Gregorian date
  // (month - 14) / 12 must truncate toward zero like the algorithm's integer division —
  // flooring it shifts every date from March to December by two days.
  const jd =
    Math.floor((1461 * (gYear + 4800 + Math.trunc((gMonth - 14) / 12))) / 4) +
    Math.floor(
      (367 * (gMonth - 2 - 12 * Math.trunc((gMonth - 14) / 12))) / 12
    ) -
    Math.floor(
      (3 *
        Math.floor(
          (gYear + 4900 + Math.trunc((gMonth - 14) / 12)) / 100
        )) /
        4
    ) +
    gDay -
    32075;

  // Islamic date from Julian day
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    (Math.floor((10985 - l2) / 5316) *
      Math.floor((50 * l2) / 17719)) +
    (Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238));
  const l3 =
    l2 -
    (Math.floor((30 - j) / 15) *
      Math.floor((17719 * j) / 50)) -
    (Math.floor(j / 16) *
      Math.floor((15238 * j) / 43)) +
    29;
  const hMonth = Math.floor((24 * l3) / 709);
  const hDay = l3 - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  const monthNameEn = HIJRI_MONTH_NAMES_EN[hMonth - 1] || '';
  const monthNameAr = HIJRI_MONTH_NAMES_AR[hMonth - 1] || '';

  return {
    year: hYear,
    month: hMonth, // 1–12
    day: hDay,
    monthNameEn,
    monthNameAr
  };
}

/** Next local date (on or after `from`) with the given Hijri month/day. */
export function nextGregorianForHijri(month, day, from = new Date(), offset = getHijriOffset()) {
  const start = addDays(from, 0);
  for (let i = 0; i < 400; i++) {
    const d = addDays(start, i);
    const h = gregorianToHijri(d, offset);
    if (h.month === month && h.day === day) return d;
  }
  return null;
}

/** All local dates of the current-or-next occurrence of a Hijri month (e.g. Ramadan). */
export function hijriMonthDays(month, from = new Date(), offset = getHijriOffset()) {
  const today = gregorianToHijri(from, offset);
  const first = today.month === month ? addDays(from, 1 - today.day) : nextGregorianForHijri(month, 1, from, offset);
  if (!first) return [];
  const days = [];
  for (let i = 0; i < 30; i++) {
    const d = addDays(first, i);
    if (gregorianToHijri(d, offset).month !== month) break;
    days.push(d);
  }
  return days;
}

/** Rough day-count until the 1st of a Hijri month. */
export function daysUntilHijriMonth(targetMonth, from = new Date(), offset = getHijriOffset()) {
  const first = nextGregorianForHijri(targetMonth, 1, from, offset);
  if (!first) return 0;
  return Math.round((first - addDays(from, 0)) / 86400000);
}

export { HIJRI_MONTH_NAMES_EN, HIJRI_MONTH_NAMES_AR, HIJRI_MONTH_NAMES_BN };

