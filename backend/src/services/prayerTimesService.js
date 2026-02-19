import pool from '../config/database.js';
import { calculatePrayerTimes } from '../utils/calculations.js';
import { getPrayerTimesFromCache, storePrayerTimesInCache } from './cacheService.js';

/**
 * Get prayer times for a coordinate and date
 * Returns cached data if available, otherwise calculates and caches
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} method - Calculation method
 * @param {object} options - Additional calculation options
 */
export async function getPrayerTimesService(latitude, longitude, date, method, options = {}) {
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
  const cached = await getPrayerTimesFromCache(latitude, longitude, date, method, normalizedOptions);

  if (cached) {
    // Get location info
    const [locations] = await pool.query(
      `SELECT name, name_bengali, district, division FROM locations
       WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01
       ORDER BY is_popular DESC LIMIT 1`,
      [latitude, longitude]
    );

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
      times: {
        fajr: cached.fajr.substring(0, 5),
        sunrise: cached.sunrise.substring(0, 5),
        dhuhr: cached.dhuhr.substring(0, 5),
        asr: cached.asr.substring(0, 5),
        maghrib: cached.maghrib.substring(0, 5),
        sunset: cached.sunset.substring(0, 5),
        isha: cached.isha.substring(0, 5)
      },
      calculated_at: cached.calculated_at,
      cache_hit: true
    };
  }

  // Calculate if not in cache
  const times = calculatePrayerTimes(latitude, longitude, calculationDate, method, normalizedOptions);

  // Determine timezone string
  const timezoneOffset = normalizedOptions.timezone_offset !== undefined ? normalizedOptions.timezone_offset : 6;
  const tzSign = timezoneOffset >= 0 ? '+' : '-';
  const tzHours = Math.abs(Math.floor(timezoneOffset));
  const tzMinutes = Math.abs((timezoneOffset % 1) * 60);
  const timezone = `${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;

  // Store in cache (async, don't wait)
  storePrayerTimesInCache(latitude, longitude, date, method, times, timezone, normalizedOptions).catch(err => {
    console.error('Failed to cache prayer times:', err.message);
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
    times: times,
    calculated_at: new Date().toISOString(),
    cache_hit: false
  };
}

/**
 * Log API request (kept for backward compatibility)
 */
export async function logPrayerTimesRequest(req, statusCode, responseTime, cacheHit, latitude, longitude, date, method) {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress || null;

    await pool.query(
      `INSERT INTO api_requests
       (request_id, endpoint, method, ip_address, latitude, longitude, request_date, calculation_method, status_code, response_time_ms, cache_hit, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.id, req.path, req.method, ipAddress,
        latitude, longitude, date, method,
        statusCode, responseTime, cacheHit,
        req.get('user-agent') || null
      ]
    );
  } catch (error) {
    // Ignore logging errors
    console.error('Logging error:', error.message);
  }
}
