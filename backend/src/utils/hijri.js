// Simple Hijri (Islamic) calendar conversion utilities for backend.
// Uses a tabular approximation suitable for calendar display.
// Based on the Kuwaiti algorithm style calculation.

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

/**
 * Convert a Gregorian date to Hijri using an approximate algorithm.
 * @param {Date} date - Gregorian date
 * @returns {{year:number,month:number,day:number,monthNameEn:string,monthNameAr:string}}
 */
export function gregorianToHijri(date) {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth();
  const gDay = date.getDate();

  // Julian day for Gregorian date
  const jd =
    Math.floor((1461 * (gYear + 4800 + Math.floor((gMonth - 14) / 12))) / 4) +
    Math.floor(
      (367 * (gMonth - 2 - 12 * Math.floor((gMonth - 14) / 12))) / 12
    ) -
    Math.floor(
      (3 *
        Math.floor(
          (gYear + 4900 + Math.floor((gMonth - 14) / 12)) / 100
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

export { HIJRI_MONTH_NAMES_EN, HIJRI_MONTH_NAMES_AR };

