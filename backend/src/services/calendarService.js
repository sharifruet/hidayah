import pool from '../config/database.js';
import { calculatePrayerTimes } from '../utils/calculations.js';
import { gregorianToHijri } from '../utils/hijri.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function getMonthlyCalendarService(latitude, longitude, year, month, method, _includeFasting, _sehriMargin, options = {}) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  const normalizedOptions = {
    fajr_angle: options.fajrAngle || options.fajr_angle,
    isha_angle: options.ishaAngle || options.isha_angle,
    isha_time_adjustment: options.ishaTimeAdjustment || options.isha_time_adjustment,
    asr_method: options.asrMethod || options.asr_method,
    dhuhr_adjustment: options.dhuhrAdjustment || options.dhuhr_adjustment,
    maghrib_adjustment: options.maghribAdjustment || options.maghrib_adjustment,
    sunset_adjustment: options.sunsetAdjustment || options.sunset_adjustment,
    sunset_angle: options.sunsetAngle || options.sunset_angle,
    timezone_offset: options.timezoneOffset || options.timezone_offset
  };

  for (let day = 1; day <= daysInMonth; day++) {
    let calculationDate = new Date(year, month - 1, day);
    if (options.hijriAdjustment !== undefined && options.hijriAdjustment !== 0) {
      calculationDate = new Date(calculationDate);
      calculationDate.setDate(calculationDate.getDate() + options.hijriAdjustment);
    }

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = DAY_NAMES[calculationDate.getDay()];
    const prayerTimes = calculatePrayerTimes(latitude, longitude, calculationDate, method, normalizedOptions);
    const hijri = gregorianToHijri(calculationDate);

    days.push({
      date: dateStr,
      day_of_week: dayOfWeek,
      prayer_times: prayerTimes,
      hijri: {
        date: `${hijri.year}-${String(hijri.month).padStart(2, '0')}-${String(hijri.day).padStart(2, '0')}`,
        year: hijri.year,
        month: hijri.month,
        day: hijri.day,
        month_name_en: hijri.monthNameEn,
        month_name_ar: hijri.monthNameAr
      }
    });
  }

  const [locations] = await pool.query(
    `SELECT name, name_bengali, district, division FROM locations
     WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01
     ORDER BY is_popular DESC LIMIT 1`,
    [latitude, longitude]
  );

  const timezoneOffset = normalizedOptions.timezone_offset !== undefined ? normalizedOptions.timezone_offset : 6;
  const tzSign = timezoneOffset >= 0 ? '+' : '-';
  const tzHours = Math.abs(Math.floor(timezoneOffset));
  const tzMinutes = Math.abs((timezoneOffset % 1) * 60);
  const timezone = `${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;

  return {
    year,
    month,
    month_name: MONTH_NAMES[month - 1],
    location: {
      latitude,
      longitude,
      timezone,
      ...(locations.length > 0 && {
        name: locations[0].name,
        name_bengali: locations[0].name_bengali,
        district: locations[0].district,
        division: locations[0].division
      })
    },
    coordinates: { latitude, longitude },
    method,
    total_days: daysInMonth,
    days,
    calculated_at: new Date().toISOString()
  };
}

export async function getYearlyCalendarService(latitude, longitude, year, method, format, _includeFasting, _sehriMargin, options = {}) {
  const days = [];
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInYear = isLeapYear ? 366 : 365;
  const startDate = new Date(year, 0, 1);

  const normalizedOptions = {
    fajr_angle: options.fajrAngle || options.fajr_angle,
    isha_angle: options.ishaAngle || options.isha_angle,
    isha_time_adjustment: options.ishaTimeAdjustment || options.isha_time_adjustment,
    asr_method: options.asrMethod || options.asr_method,
    dhuhr_adjustment: options.dhuhrAdjustment || options.dhuhr_adjustment,
    maghrib_adjustment: options.maghribAdjustment || options.maghrib_adjustment,
    sunset_adjustment: options.sunsetAdjustment || options.sunset_adjustment,
    sunset_angle: options.sunsetAngle || options.sunset_angle,
    timezone_offset: options.timezoneOffset || options.timezone_offset
  };

  for (let dayOfYear = 0; dayOfYear < daysInYear; dayOfYear++) {
    let calculationDate = new Date(startDate);
    calculationDate.setDate(calculationDate.getDate() + dayOfYear);

    if (options.hijriAdjustment !== undefined && options.hijriAdjustment !== 0) {
      calculationDate = new Date(calculationDate);
      calculationDate.setDate(calculationDate.getDate() + options.hijriAdjustment);
    }

    const dateStr = calculationDate.toISOString().split('T')[0];
    const dayOfWeek = DAY_NAMES[calculationDate.getDay()];
    const hijri = gregorianToHijri(calculationDate);

    const dayData = {
      date: dateStr,
      day_of_week: dayOfWeek,
      hijri: {
        date: `${hijri.year}-${String(hijri.month).padStart(2, '0')}-${String(hijri.day).padStart(2, '0')}`,
        year: hijri.year,
        month: hijri.month,
        day: hijri.day,
        month_name_en: hijri.monthNameEn,
        month_name_ar: hijri.monthNameAr
      }
    };

    const prayerTimes = calculatePrayerTimes(latitude, longitude, calculationDate, method, normalizedOptions);
    if (format === 'full') {
      dayData.prayer_times = prayerTimes;
    } else {
      dayData.fajr = prayerTimes.fajr;
      dayData.dhuhr = prayerTimes.dhuhr;
      dayData.maghrib = prayerTimes.maghrib;
    }

    days.push(dayData);
  }

  const [locations] = await pool.query(
    `SELECT name, name_bengali, district, division FROM locations
     WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01
     ORDER BY is_popular DESC LIMIT 1`,
    [latitude, longitude]
  );

  const timezoneOffset = normalizedOptions.timezone_offset !== undefined ? normalizedOptions.timezone_offset : 6;
  const tzSign = timezoneOffset >= 0 ? '+' : '-';
  const tzHours = Math.abs(Math.floor(timezoneOffset));
  const tzMinutes = Math.abs((timezoneOffset % 1) * 60);
  const timezone = `${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;

  return {
    year,
    location: {
      latitude,
      longitude,
      timezone,
      ...(locations.length > 0 && {
        name: locations[0].name,
        name_bengali: locations[0].name_bengali,
        district: locations[0].district,
        division: locations[0].division
      })
    },
    coordinates: { latitude, longitude },
    method,
    format,
    total_days: daysInYear,
    days,
    calculated_at: new Date().toISOString()
  };
}

export async function getDateRangeCalendarService(latitude, longitude, startDate, endDate, method, _includeFasting, _sehriMargin, options = {}) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];

  const normalizedOptions = {
    fajr_angle: options.fajrAngle || options.fajr_angle,
    isha_angle: options.ishaAngle || options.isha_angle,
    isha_time_adjustment: options.ishaTimeAdjustment || options.isha_time_adjustment,
    asr_method: options.asrMethod || options.asr_method,
    dhuhr_adjustment: options.dhuhrAdjustment || options.dhuhr_adjustment,
    maghrib_adjustment: options.maghribAdjustment || options.maghrib_adjustment,
    sunset_adjustment: options.sunsetAdjustment || options.sunset_adjustment,
    sunset_angle: options.sunsetAngle || options.sunset_angle,
    timezone_offset: options.timezoneOffset || options.timezone_offset
  };

  const currentDate = new Date(start);
  while (currentDate <= end) {
    let calculationDate = new Date(currentDate);
    if (options.hijriAdjustment !== undefined && options.hijriAdjustment !== 0) {
      calculationDate = new Date(calculationDate);
      calculationDate.setDate(calculationDate.getDate() + options.hijriAdjustment);
    }

    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = DAY_NAMES[calculationDate.getDay()];
    const prayerTimes = calculatePrayerTimes(latitude, longitude, calculationDate, method, normalizedOptions);
    const hijri = gregorianToHijri(calculationDate);

    days.push({
      date: dateStr,
      day_of_week: dayOfWeek,
      prayer_times: prayerTimes,
      hijri: {
        date: `${hijri.year}-${String(hijri.month).padStart(2, '0')}-${String(hijri.day).padStart(2, '0')}`,
        year: hijri.year,
        month: hijri.month,
        day: hijri.day,
        month_name_en: hijri.monthNameEn,
        month_name_ar: hijri.monthNameAr
      }
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const [locations] = await pool.query(
    `SELECT name, name_bengali, district, division FROM locations
     WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01
     ORDER BY is_popular DESC LIMIT 1`,
    [latitude, longitude]
  );

  const timezoneOffset = normalizedOptions.timezone_offset !== undefined ? normalizedOptions.timezone_offset : 6;
  const tzSign = timezoneOffset >= 0 ? '+' : '-';
  const tzHours = Math.abs(Math.floor(timezoneOffset));
  const tzMinutes = Math.abs((timezoneOffset % 1) * 60);
  const timezone = `${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;

  return {
    start_date: startDate,
    end_date: endDate,
    total_days: days.length,
    location: {
      latitude,
      longitude,
      timezone,
      ...(locations.length > 0 && {
        name: locations[0].name,
        name_bengali: locations[0].name_bengali,
        district: locations[0].district,
        division: locations[0].division
      })
    },
    coordinates: { latitude, longitude },
    method,
    days,
    calculated_at: new Date().toISOString()
  };
}
