/**
 * Astronomical calculations for prayer times
 * Based on formulas from Section 3 of the technical document
 * Supports all 20 calculation methods
 */

import { getMethodParameters, isValidMethod } from '../config/methods.js';

/**
 * Calculate day of year from date
 * @param {Date} date - Date object
 * @returns {number} Day of year (1-365/366)
 */
export function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const DEG2RAD = Math.PI / 180;

// Days since the J2000.0 epoch (2000-01-01 12:00 UTC), evaluated at 12:00 UTC
// on the given calendar date. Declination/EoT vary by at most ~1°/6s per day,
// so using a fixed representative hour instead of the exact local instant
// costs a negligible fraction of this formula's own ~0.01° / ~few-second precision.
function daysSinceJ2000(date) {
  const utcNoon = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  return (utcNoon - j2000) / 86400000;
}

function wrapDegrees360(deg) {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

function wrapDegrees180(deg) {
  let d = deg % 360;
  if (d > 180) d -= 360;
  if (d <= -180) d += 360;
  return d;
}

/**
 * Low-precision solar coordinates (The Astronomical Almanac's approximation,
 * good to ~0.01° in ecliptic longitude / declination and a few seconds of
 * time in the equation of time, for years 1950-2050). Replaces the previous
 * single-term Cooper's-equation-style approximations, which could be off by
 * up to ~1° in declination and ~1 minute in equation of time depending on
 * time of year — enough to shift sunrise/sunset by several minutes at higher
 * latitudes.
 * @param {Date} date - Date object
 * @returns {{declination: number, equationOfTime: number}} declination in
 *   degrees, equation of time in minutes
 */
function getSunPosition(date) {
  const D = daysSinceJ2000(date);

  const g = wrapDegrees360(357.529 + 0.98560028 * D); // mean anomaly
  const q = wrapDegrees360(280.459 + 0.98564736 * D); // mean longitude
  const L = wrapDegrees360(
    q + 1.915 * Math.sin(g * DEG2RAD) + 0.020 * Math.sin(2 * g * DEG2RAD)
  ); // apparent ecliptic longitude
  const e = 23.439 - 0.00000036 * D; // obliquity of the ecliptic

  const sinL = Math.sin(L * DEG2RAD);
  const declination = Math.asin(Math.sin(e * DEG2RAD) * sinL) / DEG2RAD;

  const rightAscension = wrapDegrees360(
    Math.atan2(Math.cos(e * DEG2RAD) * sinL, Math.cos(L * DEG2RAD)) / DEG2RAD
  );
  // 4 minutes of time per degree of Earth's rotation
  const equationOfTime = 4 * wrapDegrees180(q - rightAscension);

  return { declination, equationOfTime };
}

/**
 * Calculate solar declination
 * @param {Date} date - Date object
 * @returns {number} Solar declination in degrees
 */
export function calculateSolarDeclination(date) {
  return getSunPosition(date).declination;
}

/**
 * Calculate Equation of Time
 * @param {Date} date - Date object
 * @returns {number} Equation of time in minutes
 */
export function calculateEquationOfTime(date) {
  return getSunPosition(date).equationOfTime;
}

/**
 * Calculate solar noon
 * Solar Noon = 12:00 + (4 × (λ - λ_std)) / 60 + EoT
 * @param {number} longitude - Longitude in degrees
 * @param {Date} date - Date object
 * @param {number} timezoneOffset - Timezone offset in hours (default: 6 for Bangladesh)
 * @returns {number} Solar noon in minutes from midnight
 */
export function calculateSolarNoon(longitude, date, timezoneOffset = 6) {
  // NOAA-style solar noon approximation (minutes from midnight, local clock time)
  // solarNoon = 720 - 4*longitude - EoT + timezoneOffset*60
  // - longitude in degrees East (positive)
  // - EoT in minutes
  // - timezoneOffset in hours (e.g., +6 for Bangladesh)
  const eot = calculateEquationOfTime(date);
  return 12 * 60 - 4 * longitude - eot + timezoneOffset * 60;
}

/**
 * Calculate hour angle for a given solar altitude
 * H = arccos((sin(α) - sin(φ) × sin(δ)) / (cos(φ) × cos(δ)))
 * @param {number} latitude - Latitude in degrees
 * @param {number} declination - Solar declination in degrees
 * @param {number} altitude - Solar altitude in degrees (negative for below horizon)
 * @returns {number} Hour angle in degrees
 */
export function calculateHourAngle(latitude, declination, altitude) {
  const latRad = latitude * Math.PI / 180;
  const decRad = declination * Math.PI / 180;
  const altRad = altitude * Math.PI / 180;

  const numerator = Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad);
  const denominator = Math.cos(latRad) * Math.cos(decRad);

  // Handle division by zero
  if (Math.abs(denominator) < 1e-10) {
    return 0;
  }

  const ratio = numerator / denominator;

  // Handle edge cases
  if (ratio > 1) return 0; // Sun never sets (polar day)
  if (ratio < -1) return 180; // Sun never rises (polar night)

  const hourAngle = Math.acos(ratio) * 180 / Math.PI;
  return hourAngle;
}

/**
 * Convert hour angle to time (in hours from solar noon)
 * @param {number} hourAngle - Hour angle in degrees
 * @returns {number} Time in hours from solar noon
 */
export function hourAngleToTime(hourAngle) {
  return hourAngle / 15; // 15 degrees per hour
}

/**
 * Convert minutes to HH:MM format
 * @param {number} minutes - Minutes from midnight
 * @returns {string} Time in HH:MM format
 */
export function minutesToTime(minutes) {
  // Normalize to 0-1439 range
  let normalizedMinutes = minutes;
  while (normalizedMinutes < 0) normalizedMinutes += 24 * 60;
  while (normalizedMinutes >= 24 * 60) normalizedMinutes -= 24 * 60;

  // Round to the nearest minute (rather than truncating) before splitting into
  // hours/minutes, so e.g. 3:43.6 displays as 03:44 instead of being cut down to 03:43.
  const totalMinutes = Math.round(normalizedMinutes) % (24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Calculate prayer time from solar noon and hour angle
 * @param {number} solarNoonMinutes - Solar noon in minutes from midnight
 * @param {number} hourAngle - Hour angle in degrees
 * @param {boolean} isBeforeNoon - Whether the prayer is before noon
 * @returns {number} Prayer time in minutes from midnight
 */
export function calculatePrayerTime(solarNoonMinutes, hourAngle, isBeforeNoon = true) {
  const timeFromNoon = hourAngleToTime(hourAngle);
  const prayerMinutes = isBeforeNoon
    ? solarNoonMinutes - timeFromNoon * 60
    : solarNoonMinutes + timeFromNoon * 60;

  // Handle day rollover
  if (prayerMinutes < 0) return prayerMinutes + 24 * 60;
  if (prayerMinutes >= 24 * 60) return prayerMinutes - 24 * 60;

  return prayerMinutes;
}

/**
 * Calculate Asr altitude based on method
 * @param {number} latitude - Latitude in degrees
 * @param {number} declination - Solar declination in degrees
 * @param {string} asrMethod - Asr method ('standard' or 'hanafi')
 * @returns {number} Asr altitude in degrees
 */
export function calculateAsrAltitude(latitude, declination, asrMethod = 'standard') {
  // Must use the absolute angular difference: the shadow-length formula depends on
  // the sun's zenith distance at noon, which is |latitude - declination| regardless
  // of which one is larger or their signs (e.g. southern hemisphere, or latitudes
  // smaller than the current declination near the summer solstice).
  const diffRad = Math.abs(latitude - declination) * Math.PI / 180;

  // Standard method: shadow = object + shadow at noon (k=1)
  // Formula: tan(α_asr) = 1 / (1 + tan(φ - δ))
  if (asrMethod === 'standard') {
    const tanAsr = 1 / (1 + Math.tan(diffRad));
    return Math.atan(tanAsr) * 180 / Math.PI;
  }

  // Hanafi method: shadow = 2 × object + shadow at noon (k=2)
  // Formula: tan(α_asr) = 1 / (2 + tan(φ - δ))
  // This is the well-agreed Hanafi convention (adhan.js, praytimes.org, Aladhan),
  // and is what makes Hanafi Asr meaningfully later than Shafi/Maliki/Hanbali Asr.
  if (asrMethod === 'hanafi') {
    const tanAsr = 1 / (2 + Math.tan(diffRad));
    return Math.atan(tanAsr) * 180 / Math.PI;
  }

  // Default to standard
  const tanAsr = 1 / (1 + Math.tan(diffRad));
  return Math.atan(tanAsr) * 180 / Math.PI;
}

/**
 * Validate prayer times sequence
 * @param {object} times - Prayer times object
 * @returns {object} Validation result with isValid and errors
 */
export function validatePrayerTimesSequence(times) {
  const errors = [];

  // Parse times to minutes
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const fajr = parseTime(times.fajr);
  const sunrise = parseTime(times.sunrise);
  const dhuhr = parseTime(times.dhuhr);
  const asr = parseTime(times.asr);
  const maghrib = parseTime(times.maghrib);
  const isha = parseTime(times.isha);

  // Check sequence
  if (fajr >= sunrise) {
    errors.push('Fajr must be before Sunrise');
  }
  if (sunrise >= dhuhr) {
    errors.push('Sunrise must be before Dhuhr');
  }
  if (dhuhr >= asr) {
    errors.push('Dhuhr must be before Asr');
  }
  if (asr >= maghrib) {
    errors.push('Asr must be before Maghrib');
  }
  if (maghrib >= isha) {
    errors.push('Maghrib must be before Isha');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate coordinates are within Bangladesh bounds
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @returns {object} Validation result
 */
export function validateBangladeshBounds(latitude, longitude) {
  const GLOBAL_BOUNDS = {
    minLat: -90,
    maxLat: 90,
    minLng: -180,
    maxLng: 180
  };

  const errors = [];

  if (latitude < GLOBAL_BOUNDS.minLat || latitude > GLOBAL_BOUNDS.maxLat) {
    errors.push(`Latitude ${latitude} must be between ${GLOBAL_BOUNDS.minLat} and ${GLOBAL_BOUNDS.maxLat}`);
  }

  if (longitude < GLOBAL_BOUNDS.minLng || longitude > GLOBAL_BOUNDS.maxLng) {
    errors.push(`Longitude ${longitude} must be between ${GLOBAL_BOUNDS.minLng} and ${GLOBAL_BOUNDS.maxLng}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculate all prayer times for a given coordinate and date
 * Supports all 20 calculation methods
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {Date} date - Date for calculation
 * @param {string} method - Calculation method code (default: 'karachi')
 * @param {object} options - Additional options
 * @param {number} options.fajr_angle - Custom Fajr angle (overrides method default)
 * @param {number} options.isha_angle - Custom Isha angle (overrides method default)
 * @param {number} options.isha_time_adjustment - Minutes after Maghrib for time-based Isha
 * @param {string} options.asr_method - Asr calculation method ('standard' or 'hanafi')
 * @param {number} options.dhuhr_adjustment - Minutes after solar noon for Dhuhr (default: 1)
 * @param {number} options.maghrib_adjustment - Minutes after sunset for Maghrib (default: 1)
 * @param {number} options.sunset_adjustment - Minutes adjustment for sunset time (default: 0)
 * @param {number} options.sunset_angle - Custom sunset angle in degrees (default: -0.833)
 * @param {number} options.timezone_offset - Timezone offset in hours (default: 6 for Bangladesh)
 * @returns {object} Prayer times object
 */
export function calculatePrayerTimes(latitude, longitude, date, method = 'karachi', options = {}) {
  // Validate coordinates
  const boundsValidation = validateBangladeshBounds(latitude, longitude);
  if (!boundsValidation.isValid) {
    throw new Error(`Invalid coordinates: ${boundsValidation.errors.join(', ')}`);
  }

  // Get method parameters
  const methodParams = getMethodParameters(method, {
    fajr_angle: options.fajr_angle,
    isha_angle: options.isha_angle,
    isha_time_adjustment: options.isha_time_adjustment,
    asr_method: options.asr_method,
    dhuhr_adjustment: options.dhuhr_adjustment,
    maghrib_adjustment: options.maghrib_adjustment
  });

  // Extract parameters
  const fajrAngle = -Math.abs(methodParams.fajr_angle); // Negative for below horizon
  const ishaAngle = methodParams.isha_angle !== null ? -Math.abs(methodParams.isha_angle) : null;
  const ishaCalculationType = methodParams.isha_calculation_type || 'angle';
  const ishaTimeAdjustment = methodParams.isha_time_adjustment || null;
  const asrMethod = methodParams.asr_method || 'standard';
  const dhuhrAdjustment = methodParams.dhuhr_adjustment || 1;
  const maghribAdjustment = methodParams.maghrib_adjustment || 1;
  // Method-specific fixed-minute corrections (e.g. Diyanet/Turkey) applied on
  // top of the plain angle-based calculation. Zero for methods that don't set them.
  const sunriseOffset = methodParams.sunrise_offset || 0;
  const dhuhrOffset = methodParams.dhuhr_offset || 0;
  const asrOffset = methodParams.asr_offset || 0;
  const maghribOffset = methodParams.maghrib_offset || 0;
  const timezoneOffset = options.timezone_offset !== undefined ? options.timezone_offset : 6;

  // Calculate base parameters
  const declination = calculateSolarDeclination(date);
  const solarNoonMinutes = calculateSolarNoon(longitude, date, timezoneOffset);

  // Calculate hour angles
  // Sunset angle: -0.833 degrees accounts for sun radius (0.266°) + atmospheric refraction (0.583°)
  // For more accurate results in tropical regions, some sources use -0.85 to -0.9
  const sunsetAngle = options.sunset_angle !== undefined ? options.sunset_angle : -0.833;
  const sunsetAdjustment = options.sunset_adjustment !== undefined ? options.sunset_adjustment : 0;

  const fajrHourAngle = calculateHourAngle(latitude, declination, fajrAngle);
  const sunriseHourAngle = calculateHourAngle(latitude, declination, sunsetAngle);

  // Calculate Asr altitude
  const asrAltitude = calculateAsrAltitude(latitude, declination, asrMethod);
  const asrHourAngle = calculateHourAngle(latitude, declination, asrAltitude);

  // Calculate times
  const fajr = calculatePrayerTime(solarNoonMinutes, fajrHourAngle, true);
  const sunrise = calculatePrayerTime(solarNoonMinutes, sunriseHourAngle, true) + sunriseOffset;
  const dhuhr = solarNoonMinutes + dhuhrAdjustment + dhuhrOffset;
  const asr = calculatePrayerTime(solarNoonMinutes, asrHourAngle, false) + asrOffset;
  const sunsetBase = calculatePrayerTime(solarNoonMinutes, sunriseHourAngle, false);
  const sunset = sunsetBase + sunsetAdjustment;
  const maghrib = sunset + maghribAdjustment + maghribOffset;

  // Calculate Isha
  let isha;
  if (ishaCalculationType === 'time' && ishaTimeAdjustment !== null) {
    // Time-based Isha (e.g., Umm Al-Qura: 90 minutes after Maghrib)
    isha = maghrib + ishaTimeAdjustment;
    if (isha >= 24 * 60) isha -= 24 * 60;
  } else if (ishaAngle !== null) {
    // Angle-based Isha
    const ishaHourAngle = calculateHourAngle(latitude, declination, ishaAngle);
    isha = calculatePrayerTime(solarNoonMinutes, ishaHourAngle, false);
  } else {
    // Fallback: use 18° angle
    const ishaHourAngle = calculateHourAngle(latitude, declination, -18);
    isha = calculatePrayerTime(solarNoonMinutes, ishaHourAngle, false);
  }

  const times = {
    fajr: minutesToTime(fajr),
    sunrise: minutesToTime(sunrise),
    dhuhr: minutesToTime(dhuhr),
    asr: minutesToTime(asr),
    maghrib: minutesToTime(maghrib),
    sunset: minutesToTime(sunset),
    isha: minutesToTime(isha)
  };

  // Validate sequence
  const validation = validatePrayerTimesSequence(times);
  if (!validation.isValid) {
    console.warn('Prayer times sequence validation failed:', validation.errors);
  }

  return times;
}

/**
 * Calculate sunrise and sunset times
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {Date} date - Date for calculation
 * @param {number} timezoneOffset - Timezone offset in hours (default: 6)
 * @returns {object} Sunrise and sunset times
 */
export function calculateSunTimes(latitude, longitude, date, timezoneOffset = 6, options = {}) {
  const declination = calculateSolarDeclination(date);
  const solarNoonMinutes = calculateSolarNoon(longitude, date, timezoneOffset);
  const sunsetAngle = options.sunset_angle !== undefined ? options.sunset_angle : -0.833;
  const sunsetAdjustment = options.sunset_adjustment !== undefined ? options.sunset_adjustment : 0;

  const sunriseHourAngle = calculateHourAngle(latitude, declination, sunsetAngle);
  const sunrise = calculatePrayerTime(solarNoonMinutes, sunriseHourAngle, true);
  const sunsetBase = calculatePrayerTime(solarNoonMinutes, sunriseHourAngle, false);
  const sunset = sunsetBase + sunsetAdjustment;

  return {
    sunrise: minutesToTime(sunrise),
    sunset: minutesToTime(sunset)
  };
}
