// Tabular-approximation Gregorian → Hijri conversion (Kuwaiti algorithm style).
// Good enough for calendar display; not for religious rulings requiring moon-sighting.

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

export interface HijriDate {
  year: number;
  month: number; // 1-12
  day: number;
  monthNameEn: string;
  monthNameAr: string;
}

export function gregorianToHijri(date: Date): HijriDate {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();

  const jd =
    Math.floor((1461 * (gYear + 4800 + Math.floor((gMonth - 14) / 12))) / 4) +
    Math.floor((367 * (gMonth - 2 - 12 * Math.floor((gMonth - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((gYear + 4900 + Math.floor((gMonth - 14) / 12)) / 100)) / 4) +
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
