import pool from '../config/database.js';

/**
 * Generate cache key for prayer times
 */
export function generatePrayerTimesCacheKey(latitude, longitude, date, method, options = {}) {
  // Include options that affect calculation in cache key
  const keyParts = [
    latitude.toFixed(6),
    longitude.toFixed(6),
    date,
    method,
    options.fajr_angle || '',
    options.isha_angle || '',
    options.isha_time_adjustment || '',
    options.asr_method || 'standard',
    options.dhuhr_adjustment || 1,
    options.maghrib_adjustment || 1
  ];

  return keyParts.join('|');
}

/**
 * Get prayer times from cache
 */
export async function getPrayerTimesFromCache(latitude, longitude, date, method, options = {}) {
  try {
    // Check if we have custom options that prevent caching
    const hasCustomOptions = options.fajr_angle !== undefined ||
                            options.isha_angle !== undefined ||
                            options.isha_time_adjustment !== undefined ||
                            options.asr_method !== undefined ||
                            options.dhuhr_adjustment !== undefined ||
                            options.maghrib_adjustment !== undefined ||
                            options.timezone_offset !== undefined;

    if (hasCustomOptions) {
      return null; // Don't use cache for custom options
    }

    const [rows] = await pool.query(
      `SELECT * FROM prayer_times_cache
       WHERE latitude = ? AND longitude = ? AND date = ? AND method = ?
       LIMIT 1`,
      [latitude, longitude, date, method]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error('Cache lookup error:', error);
    return null; // Return null on error, allow calculation to proceed
  }
}

/**
 * Store prayer times in cache
 */
export async function storePrayerTimesInCache(latitude, longitude, date, method, times, timezone = '+06:00', options = {}) {
  try {
    // Don't cache if custom options are used
    const hasCustomOptions = options.fajr_angle !== undefined ||
                            options.isha_angle !== undefined ||
                            options.isha_time_adjustment !== undefined ||
                            options.asr_method !== undefined ||
                            options.dhuhr_adjustment !== undefined ||
                            options.maghrib_adjustment !== undefined ||
                            options.timezone_offset !== undefined;

    if (hasCustomOptions) {
      return; // Don't cache custom calculations
    }

    await pool.query(
      `INSERT INTO prayer_times_cache
       (latitude, longitude, date, method, fajr, sunrise, dhuhr, asr, maghrib, sunset, isha, timezone, fajr_angle, isha_angle, asr_method, dhuhr_adjustment, maghrib_adjustment)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       fajr = VALUES(fajr),
       sunrise = VALUES(sunrise),
       dhuhr = VALUES(dhuhr),
       asr = VALUES(asr),
       maghrib = VALUES(maghrib),
       sunset = VALUES(sunset),
       isha = VALUES(isha),
       updated_at = CURRENT_TIMESTAMP`,
      [
        latitude, longitude, date, method,
        times.fajr + ':00',
        times.sunrise + ':00',
        times.dhuhr + ':00',
        times.asr + ':00',
        times.maghrib + ':00',
        times.sunset + ':00',
        times.isha + ':00',
        timezone,
        null, // fajr_angle (not stored for standard methods)
        null, // isha_angle (not stored for standard methods)
        'standard', // asr_method
        1, // dhuhr_adjustment
        1  // maghrib_adjustment
      ]
    );
  } catch (error) {
    // Ignore duplicate key errors
    if (!error.message.includes('Duplicate entry')) {
      console.error('Cache store error:', error);
    }
  }
}

/**
 * Get fasting times from cache
 */
export async function getFastingTimesFromCache(latitude, longitude, date, method, sehriMargin, options = {}) {
  try {
    const hasCustomOptions = options.fajr_angle !== undefined ||
                            options.isha_angle !== undefined ||
                            options.isha_time_adjustment !== undefined ||
                            options.asr_method !== undefined ||
                            options.dhuhr_adjustment !== undefined ||
                            options.maghrib_adjustment !== undefined;

    if (hasCustomOptions) {
      return null;
    }

    const [rows] = await pool.query(
      `SELECT * FROM fasting_times_cache
       WHERE latitude = ? AND longitude = ? AND date = ? AND method = ? AND sehri_margin = ?
       LIMIT 1`,
      [latitude, longitude, date, method, sehriMargin]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error('Cache lookup error:', error);
    return null;
  }
}

/**
 * Store fasting times in cache
 */
export async function storeFastingTimesInCache(latitude, longitude, date, method, sehriMargin, fastingData, timezone = '+06:00', options = {}) {
  try {
    const hasCustomOptions = options.fajr_angle !== undefined ||
                            options.isha_angle !== undefined ||
                            options.isha_time_adjustment !== undefined ||
                            options.asr_method !== undefined ||
                            options.dhuhr_adjustment !== undefined ||
                            options.maghrib_adjustment !== undefined;

    if (hasCustomOptions) {
      return;
    }

    await pool.query(
      `INSERT INTO fasting_times_cache
       (latitude, longitude, date, method, sehri_margin, sehri_end, fajr, sunrise, sunset, iftar, maghrib, fasting_duration_minutes, day_length_minutes, timezone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       sehri_end = VALUES(sehri_end),
       fajr = VALUES(fajr),
       sunrise = VALUES(sunrise),
       sunset = VALUES(sunset),
       iftar = VALUES(iftar),
       maghrib = VALUES(maghrib),
       fasting_duration_minutes = VALUES(fasting_duration_minutes),
       day_length_minutes = VALUES(day_length_minutes),
       updated_at = CURRENT_TIMESTAMP`,
      [
        latitude, longitude, date, method, sehriMargin,
        fastingData.sehri_end + ':00',
        fastingData.fajr + ':00',
        fastingData.sunrise + ':00',
        fastingData.sunset + ':00',
        fastingData.iftar + ':00',
        fastingData.maghrib + ':00',
        fastingData.fasting_duration_minutes,
        fastingData.day_length_minutes,
        timezone
      ]
    );
  } catch (error) {
    if (!error.message.includes('Duplicate entry')) {
      console.error('Cache store error:', error);
    }
  }
}

/**
 * Clear old cache entries (older than specified days)
 */
export async function clearOldCacheEntries(daysOld = 365) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const [result1] = await pool.query(
      `DELETE FROM prayer_times_cache WHERE date < ?`,
      [cutoffDate.toISOString().split('T')[0]]
    );

    const [result2] = await pool.query(
      `DELETE FROM fasting_times_cache WHERE date < ?`,
      [cutoffDate.toISOString().split('T')[0]]
    );

    return {
      prayer_times_deleted: result1.affectedRows,
      fasting_times_deleted: result2.affectedRows
    };
  } catch (error) {
    console.error('Cache cleanup error:', error);
    throw error;
  }
}
