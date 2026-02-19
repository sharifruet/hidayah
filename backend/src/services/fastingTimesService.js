import pool from '../config/database.js';
import { calculateFastingTimes } from '../utils/calculations.js';
import { getFastingTimesFromCache, storeFastingTimesInCache } from './cacheService.js';

/**
 * Get fasting times for a coordinate and date
 * Returns cached data if available, otherwise calculates and caches
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} method - Calculation method
 * @param {number} sehriMargin - Minutes before Fajr for Sehri end
 * @param {object} options - Additional calculation options
 */
export async function getFastingTimesService(latitude, longitude, date, method, sehriMargin, options = {}) {
  // Apply Hijri adjustment if provided
  let calculationDate = new Date(date);
  if (options.hijriAdjustment !== undefined && options.hijriAdjustment !== 0) {
    calculationDate = new Date(calculationDate);
    calculationDate.setDate(calculationDate.getDate() + options.hijriAdjustment);
  }

  // Normalize options for cache lookup
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

  // Try to get from cache
  const cached = await getFastingTimesFromCache(latitude, longitude, date, method, sehriMargin, normalizedOptions);

  if (cached) {
    // Get location info
    const [locations] = await pool.query(
      `SELECT name, name_bengali, district, division FROM locations
       WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01
       ORDER BY is_popular DESC LIMIT 1`,
      [latitude, longitude]
    );

    // Parse cached times
    const parseTime = (timeStr) => {
      if (!timeStr) return null;
      return timeStr.substring(0, 5);
    };

    const fastingHours = Math.floor(cached.fasting_duration_minutes / 60);
    const fastingMins = cached.fasting_duration_minutes % 60;
    const dayHours = Math.floor(cached.day_length_minutes / 60);
    const dayMins = cached.day_length_minutes % 60;

    return {
      date: date,
      location: {
        latitude: parseFloat(cached.latitude),
        longitude: parseFloat(cached.longitude),
        timezone: cached.timezone || '+06:00',
        ...(locations.length > 0 && {
          name: locations[0].name,
          name_bengali: locations[0].name_bengali,
          district: locations[0].district,
          division: locations[0].division
        })
      },
      coordinates: {
        latitude: parseFloat(cached.latitude),
        longitude: parseFloat(cached.longitude)
      },
      method: method,
      sehri_margin: sehriMargin,
      fasting: {
        sehri_end: parseTime(cached.sehri_end),
        fajr: parseTime(cached.fajr),
        sunrise: parseTime(cached.sunrise),
        sunset: parseTime(cached.sunset),
        iftar: parseTime(cached.iftar),
        maghrib: parseTime(cached.maghrib),
        fasting_duration_minutes: cached.fasting_duration_minutes,
        fasting_duration_hours: parseFloat((cached.fasting_duration_minutes / 60).toFixed(2)),
        fasting_duration_formatted: `${fastingHours} hours ${fastingMins} minutes`,
        day_length_minutes: cached.day_length_minutes,
        day_length_hours: parseFloat((cached.day_length_minutes / 60).toFixed(2)),
        day_length_formatted: `${dayHours} hours ${dayMins} minutes`
      },
      calculated_at: cached.calculated_at,
      cache_hit: true
    };
  }

  // Calculate if not in cache
  const fasting = calculateFastingTimes(latitude, longitude, calculationDate, method, sehriMargin, normalizedOptions);

  // Determine timezone string
  const timezoneOffset = normalizedOptions.timezone_offset !== undefined ? normalizedOptions.timezone_offset : 6;
  const tzSign = timezoneOffset >= 0 ? '+' : '-';
  const tzHours = Math.abs(Math.floor(timezoneOffset));
  const tzMinutes = Math.abs((timezoneOffset % 1) * 60);
  const timezone = `${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;

  // Store in cache (async, don't wait)
  storeFastingTimesInCache(latitude, longitude, date, method, sehriMargin, fasting, timezone, normalizedOptions).catch(err => {
    console.error('Failed to cache fasting times:', err.message);
  });

  // Get location info if available
  const [locations] = await pool.query(
    `SELECT name, name_bengali, district, division FROM locations
     WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01
     ORDER BY is_popular DESC LIMIT 1`,
    [latitude, longitude]
  );

  return {
    date: date,
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
    sehri_margin: sehriMargin,
    fasting: fasting,
    calculated_at: new Date().toISOString(),
    cache_hit: false
  };
}
