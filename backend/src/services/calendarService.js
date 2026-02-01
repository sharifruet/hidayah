import pool from '../config/database.js';
import { calculatePrayerTimes, calculateFastingTimes } from '../utils/calculations.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Get monthly calendar
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {number} year - Year (4-digit)
 * @param {number} month - Month (1-12)
 * @param {string} method - Calculation method
 * @param {boolean} includeFasting - Whether to include fasting times
 * @param {number} sehriMargin - Minutes before Fajr for Sehri end
 * @param {object} options - Additional calculation options
 */
export async function getMonthlyCalendarService(latitude, longitude, year, month, method, includeFasting, sehriMargin = 10, options = {}) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  // Normalize options once outside the loop
  const normalizedOptions = {
    fajr_angle: options.fajrAngle || options.fajr_angle,
    isha_angle: options.ishaAngle || options.isha_angle,
    isha_time_adjustment: options.ishaTimeAdjustment || options.isha_time_adjustment,
    asr_method: options.asrMethod || options.asr_method,
    dhuhr_adjustment: options.dhuhrAdjustment || options.dhuhr_adjustment,
    maghrib_adjustment: options.maghribAdjustment || options.maghrib_adjustment,
    timezone_offset: options.timezoneOffset || options.timezone_offset
  };

  for (let day = 1; day <= daysInMonth; day++) {
    // Apply Hijri adjustment if provided
    let calculationDate = new Date(year, month - 1, day);
    if (options.hijriAdjustment !== undefined && options.hijriAdjustment !== 0) {
      calculationDate = new Date(calculationDate);
      calculationDate.setDate(calculationDate.getDate() + options.hijriAdjustment);
    }

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = DAY_NAMES[calculationDate.getDay()];

    const prayerTimes = calculatePrayerTimes(latitude, longitude, calculationDate, method, normalizedOptions);

    const dayData = {
      date: dateStr,
      day_of_week: dayOfWeek,
      prayer_times: prayerTimes
    };

    if (includeFasting) {
      const fasting = calculateFastingTimes(latitude, longitude, calculationDate, method, sehriMargin, normalizedOptions);
      dayData.fasting = {
        sehri_end: fasting.sehri_end,
        fajr: fasting.fajr,
        sunrise: fasting.sunrise,
        sunset: fasting.sunset,
        iftar: fasting.iftar,
        maghrib: fasting.maghrib,
        fasting_duration_minutes: fasting.fasting_duration_minutes,
        fasting_duration_hours: fasting.fasting_duration_hours,
        fasting_duration_formatted: fasting.fasting_duration_formatted,
        day_length_minutes: fasting.day_length_minutes,
        day_length_hours: fasting.day_length_hours,
        day_length_formatted: fasting.day_length_formatted
      };
    }

    days.push(dayData);
  }

  // Get location info
  const [locations] = await pool.query(
    `SELECT name, name_bengali, district, division FROM locations
     WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01
     ORDER BY is_popular DESC LIMIT 1`,
    [latitude, longitude]
  );

  // Determine timezone string
  const timezoneOffset = normalizedOptions.timezone_offset !== undefined ? normalizedOptions.timezone_offset : 6;
  const tzSign = timezoneOffset >= 0 ? '+' : '-';
  const tzHours = Math.abs(Math.floor(timezoneOffset));
  const tzMinutes = Math.abs((timezoneOffset % 1) * 60);
  const timezone = `${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;

  return {
    year: year,
    month: month,
    month_name: MONTH_NAMES[month - 1],
    location: {
      latitude: latitude,
      longitude: longitude,
      timezone: timezone,
      ...(locations.length > 0 && {
        name: locations[0].name,
        name_bengali: locations[0].name_bengali,
        district: locations[0].district,
        division: locations[0].division
      })
    },
    coordinates: {
      latitude: latitude,
      longitude: longitude
    },
    method: method,
    total_days: daysInMonth,
    days: days,
    calculated_at: new Date().toISOString()
  };
}

/**
 * Get yearly calendar
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {number} year - Year (4-digit)
 * @param {string} method - Calculation method
 * @param {string} format - Format ('summary' or 'full')
 * @param {boolean} includeFasting - Whether to include fasting times
 * @param {number} sehriMargin - Minutes before Fajr for Sehri end
 * @param {object} options - Additional calculation options
 */
export async function getYearlyCalendarService(latitude, longitude, year, method, format, includeFasting, sehriMargin = 10, options = {}) {
  const days = [];
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInYear = isLeapYear ? 366 : 365;

  const startDate = new Date(year, 0, 1);

  // Normalize options
  const normalizedOptions = {
    fajr_angle: options.fajrAngle || options.fajr_angle,
    isha_angle: options.ishaAngle || options.isha_angle,
    isha_time_adjustment: options.ishaTimeAdjustment || options.isha_time_adjustment,
    asr_method: options.asrMethod || options.asr_method,
    dhuhr_adjustment: options.dhuhrAdjustment || options.dhuhr_adjustment,
    maghrib_adjustment: options.maghribAdjustment || options.maghrib_adjustment,
    timezone_offset: options.timezoneOffset || options.timezone_offset
  };

  for (let dayOfYear = 0; dayOfYear < daysInYear; dayOfYear++) {
    // Apply Hijri adjustment if provided
    let calculationDate = new Date(startDate);
    calculationDate.setDate(calculationDate.getDate() + dayOfYear);

    if (options.hijriAdjustment !== undefined && options.hijriAdjustment !== 0) {
      calculationDate = new Date(calculationDate);
      calculationDate.setDate(calculationDate.getDate() + options.hijriAdjustment);
    }

    const dateStr = calculationDate.toISOString().split('T')[0];
    const dayOfWeek = DAY_NAMES[calculationDate.getDay()];

    const dayData = {
      date: dateStr,
      day_of_week: dayOfWeek
    };

    if (format === 'full') {
      const prayerTimes = calculatePrayerTimes(latitude, longitude, calculationDate, method, normalizedOptions);
      dayData.prayer_times = prayerTimes;

      if (includeFasting) {
        const fasting = calculateFastingTimes(latitude, longitude, calculationDate, method, sehriMargin, normalizedOptions);
        dayData.fasting = {
          sehri_end: fasting.sehri_end,
          fajr: fasting.fajr,
          sunrise: fasting.sunrise,
          sunset: fasting.sunset,
          iftar: fasting.iftar,
          maghrib: fasting.maghrib,
          fasting_duration_minutes: fasting.fasting_duration_minutes,
          fasting_duration_hours: fasting.fasting_duration_hours,
          fasting_duration_formatted: fasting.fasting_duration_formatted,
          day_length_minutes: fasting.day_length_minutes,
          day_length_hours: fasting.day_length_hours,
          day_length_formatted: fasting.day_length_formatted
        };
      }
    } else {
      // Summary format - only key times
      const prayerTimes = calculatePrayerTimes(latitude, longitude, calculationDate, method, normalizedOptions);
      dayData.fajr = prayerTimes.fajr;
      dayData.dhuhr = prayerTimes.dhuhr;
      dayData.maghrib = prayerTimes.maghrib;

      if (includeFasting) {
        const fasting = calculateFastingTimes(latitude, longitude, calculationDate, method, sehriMargin, normalizedOptions);
        dayData.iftar = fasting.iftar;
      }
    }

    days.push(dayData);
  }

  // Get location info
  const [locations] = await pool.query(
    `SELECT name, name_bengali, district, division FROM locations
     WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01
     ORDER BY is_popular DESC LIMIT 1`,
    [latitude, longitude]
  );

  // Determine timezone string
  const timezoneOffset = normalizedOptions.timezone_offset !== undefined ? normalizedOptions.timezone_offset : 6;
  const tzSign = timezoneOffset >= 0 ? '+' : '-';
  const tzHours = Math.abs(Math.floor(timezoneOffset));
  const tzMinutes = Math.abs((timezoneOffset % 1) * 60);
  const timezone = `${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;

  return {
    year: year,
    location: {
      latitude: latitude,
      longitude: longitude,
      timezone: timezone,
      ...(locations.length > 0 && {
        name: locations[0].name,
        name_bengali: locations[0].name_bengali,
        district: locations[0].district,
        division: locations[0].division
      })
    },
    coordinates: {
      latitude: latitude,
      longitude: longitude
    },
    method: method,
    format: format,
    total_days: daysInYear,
    days: days,
    calculated_at: new Date().toISOString()
  };
}

/**
 * Get date range calendar
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} method - Calculation method
 * @param {boolean} includeFasting - Whether to include fasting times
 * @param {number} sehriMargin - Minutes before Fajr for Sehri end
 * @param {object} options - Additional calculation options
 */
export async function getDateRangeCalendarService(latitude, longitude, startDate, endDate, method, includeFasting, sehriMargin = 10, options = {}) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];

  // Normalize options
  const normalizedOptions = {
    fajr_angle: options.fajrAngle || options.fajr_angle,
    isha_angle: options.ishaAngle || options.isha_angle,
    isha_time_adjustment: options.ishaTimeAdjustment || options.isha_time_adjustment,
    asr_method: options.asrMethod || options.asr_method,
    dhuhr_adjustment: options.dhuhrAdjustment || options.dhuhr_adjustment,
    maghrib_adjustment: options.maghribAdjustment || options.maghrib_adjustment,
    timezone_offset: options.timezoneOffset || options.timezone_offset
  };

  // Iterate through date range
  const currentDate = new Date(start);
  while (currentDate <= end) {
    // Apply Hijri adjustment if provided
    let calculationDate = new Date(currentDate);
    if (options.hijriAdjustment !== undefined && options.hijriAdjustment !== 0) {
      calculationDate = new Date(calculationDate);
      calculationDate.setDate(calculationDate.getDate() + options.hijriAdjustment);
    }

    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = DAY_NAMES[calculationDate.getDay()];

    const prayerTimes = calculatePrayerTimes(latitude, longitude, calculationDate, method, normalizedOptions);

    const dayData = {
      date: dateStr,
      day_of_week: dayOfWeek,
      prayer_times: prayerTimes
    };

    if (includeFasting) {
      const fasting = calculateFastingTimes(latitude, longitude, calculationDate, method, sehriMargin, normalizedOptions);
      dayData.fasting = {
        sehri_end: fasting.sehri_end,
        fajr: fasting.fajr,
        sunrise: fasting.sunrise,
        sunset: fasting.sunset,
        iftar: fasting.iftar,
        maghrib: fasting.maghrib,
        fasting_duration_minutes: fasting.fasting_duration_minutes,
        fasting_duration_hours: fasting.fasting_duration_hours,
        fasting_duration_formatted: fasting.fasting_duration_formatted,
        day_length_minutes: fasting.day_length_minutes,
        day_length_hours: fasting.day_length_hours,
        day_length_formatted: fasting.day_length_formatted
      };
    }

    days.push(dayData);

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Get location info
  const [locations] = await pool.query(
    `SELECT name, name_bengali, district, division FROM locations
     WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01
     ORDER BY is_popular DESC LIMIT 1`,
    [latitude, longitude]
  );

  // Determine timezone string
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
      latitude: latitude,
      longitude: longitude,
      timezone: timezone,
      ...(locations.length > 0 && {
        name: locations[0].name,
        name_bengali: locations[0].name_bengali,
        district: locations[0].district,
        division: locations[0].division
      })
    },
    coordinates: {
      latitude: latitude,
      longitude: longitude
    },
    method: method,
    days: days,
    calculated_at: new Date().toISOString()
  };
}
