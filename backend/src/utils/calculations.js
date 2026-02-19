/**
 * Astronomical calculations for prayer and fasting times
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

/**
 * Calculate solar declination
 * δ = 23.45° × sin(360° × (284 + n) / 365.25)
 * @param {Date} date - Date object
 * @returns {number} Solar declination in degrees
 */
export function calculateSolarDeclination(date) {
  const n = getDayOfYear(date);
  const declination = 23.45 * Math.sin((360 * (284 + n) / 365.25) * Math.PI / 180);
  return declination;
}

/**
 * Calculate Equation of Time
 * EoT = 9.87 × sin(2B) - 7.53 × cos(B) - 1.5 × sin(B)
 * Where B = 360° × (n - 81) / 365.25
 * @param {Date} date - Date object
 * @returns {number} Equation of time in minutes
 */
export function calculateEquationOfTime(date) {
  const n = getDayOfYear(date);
  const B = (360 * (n - 81) / 365.25) * Math.PI / 180;
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  return eot; // in minutes
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
  const standardMeridian = timezoneOffset * 15; // 90°E for Bangladesh
  const longitudeCorrection = 4 * (longitude - standardMeridian) / 60; // in minutes
  const eot = calculateEquationOfTime(date);

  const solarNoonMinutes = 12 * 60 + longitudeCorrection + eot;
  return solarNoonMinutes; // in minutes from midnight
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

  const hours = Math.floor(normalizedMinutes / 60);
  const mins = Math.floor(normalizedMinutes % 60);
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
  const diffRad = (latitude - declination) * Math.PI / 180;

  // Standard method: shadow = object + shadow at noon (k=1)
  // Formula: tan(α_asr) = 1 / (1 + tan(φ - δ))
  if (asrMethod === 'standard') {
    const tanAsr = 1 / (1 + Math.tan(diffRad));
    return Math.atan(tanAsr) * 180 / Math.PI;
  }

  // Hanafi method: shadow = object + shadow at noon (k=1) - same as standard in Bangladesh
  // Some implementations use k=2 (shadow = 2 × object), but k=1 is standard
  if (asrMethod === 'hanafi') {
    // Using k=1 (same as standard)
    const tanAsr = 1 / (1 + Math.tan(diffRad));
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
  const BANGLADESH_BOUNDS = {
    minLat: 20.738,
    maxLat: 26.638,
    minLng: 88.084,
    maxLng: 92.673
  };

  const errors = [];

  if (latitude < BANGLADESH_BOUNDS.minLat || latitude > BANGLADESH_BOUNDS.maxLat) {
    errors.push(`Latitude ${latitude} is outside Bangladesh bounds (${BANGLADESH_BOUNDS.minLat} to ${BANGLADESH_BOUNDS.maxLat})`);
  }

  if (longitude < BANGLADESH_BOUNDS.minLng || longitude > BANGLADESH_BOUNDS.maxLng) {
    errors.push(`Longitude ${longitude} is outside Bangladesh bounds (${BANGLADESH_BOUNDS.minLng} to ${BANGLADESH_BOUNDS.maxLng})`);
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
  const sunrise = calculatePrayerTime(solarNoonMinutes, sunriseHourAngle, true);
  const dhuhr = solarNoonMinutes + dhuhrAdjustment;
  const asr = calculatePrayerTime(solarNoonMinutes, asrHourAngle, false);
  const sunsetBase = calculatePrayerTime(solarNoonMinutes, sunriseHourAngle, false);
  const sunset = sunsetBase + sunsetAdjustment;
  const maghrib = sunset + maghribAdjustment;

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
 * Calculate fasting times
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {Date} date - Date for calculation
 * @param {string} method - Calculation method code (default: 'karachi')
 * @param {number} sehriMargin - Minutes before Fajr for Sehri end (default: 10)
 * @param {object} options - Additional options (same as calculatePrayerTimes)
 * @returns {object} Fasting times object
 */
export function calculateFastingTimes(latitude, longitude, date, method = 'karachi', sehriMargin = 10, options = {}) {
  // Validate sehri margin
  if (sehriMargin < 5 || sehriMargin > 15) {
    throw new Error('Sehri margin must be between 5 and 15 minutes');
  }

  // Calculate prayer times with all options
  const prayerTimes = calculatePrayerTimes(latitude, longitude, date, method, options);

  // Parse times to calculate durations
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const fajrMinutes = parseTime(prayerTimes.fajr);
  const sunriseMinutes = parseTime(prayerTimes.sunrise);
  const sunsetMinutes = parseTime(prayerTimes.sunset);
  const maghribMinutes = parseTime(prayerTimes.maghrib);

  // Calculate Sehri end (Fajr - margin)
  let sehriEndMinutes = fajrMinutes - sehriMargin;
  if (sehriEndMinutes < 0) sehriEndMinutes += 24 * 60;

  // Iftar is at Maghrib (which may have adjustment)
  const iftarMinutes = maghribMinutes;

  // Calculate durations
  let fastingDurationMinutes = iftarMinutes - fajrMinutes;
  if (fastingDurationMinutes < 0) fastingDurationMinutes += 24 * 60;

  let dayLengthMinutes = sunsetMinutes - sunriseMinutes;
  if (dayLengthMinutes < 0) dayLengthMinutes += 24 * 60;

  const fastingDurationHours = fastingDurationMinutes / 60;
  const dayLengthHours = dayLengthMinutes / 60;

  const fastingHours = Math.floor(fastingDurationHours);
  const fastingMins = fastingDurationMinutes % 60;
  const dayHours = Math.floor(dayLengthHours);
  const dayMins = dayLengthMinutes % 60;

  return {
    sehri_end: minutesToTime(sehriEndMinutes),
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    sunset: prayerTimes.sunset,
    iftar: minutesToTime(iftarMinutes),
    maghrib: prayerTimes.maghrib,
    fasting_duration_minutes: fastingDurationMinutes,
    fasting_duration_hours: parseFloat(fastingDurationHours.toFixed(2)),
    fasting_duration_formatted: `${fastingHours} hours ${fastingMins} minutes`,
    day_length_minutes: dayLengthMinutes,
    day_length_hours: parseFloat(dayLengthHours.toFixed(2)),
    day_length_formatted: `${dayHours} hours ${dayMins} minutes`
  };
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
