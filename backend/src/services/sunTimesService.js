import pool from '../config/database.js';
import { calculateSunTimes } from '../utils/calculations.js';

/**
 * Get sun times (sunrise, sunset) for a coordinate and date
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {object} options - Additional options
 */
export async function getSunTimesService(latitude, longitude, date, options = {}) {
  const calculationDate = new Date(date);
  const timezoneOffset = options.timezone_offset !== undefined ? options.timezone_offset : 6;

  // Calculate sun times
  const sunTimes = calculateSunTimes(latitude, longitude, calculationDate, timezoneOffset);

  // Get location info if available
  const [locations] = await pool.query(
    `SELECT name, name_bengali, district, division FROM locations
     WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01
     ORDER BY is_popular DESC LIMIT 1`,
    [latitude, longitude]
  );

  // Determine timezone string
  const tzSign = timezoneOffset >= 0 ? '+' : '-';
  const tzHours = Math.abs(Math.floor(timezoneOffset));
  const tzMinutes = Math.abs((timezoneOffset % 1) * 60);
  const timezone = `${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;

  // Calculate day length
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const sunriseMinutes = parseTime(sunTimes.sunrise);
  const sunsetMinutes = parseTime(sunTimes.sunset);
  let dayLengthMinutes = sunsetMinutes - sunriseMinutes;
  if (dayLengthMinutes < 0) dayLengthMinutes += 24 * 60;

  const dayHours = Math.floor(dayLengthMinutes / 60);
  const dayMins = dayLengthMinutes % 60;

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
    times: {
      sunrise: sunTimes.sunrise,
      sunset: sunTimes.sunset
    },
    day_length: {
      minutes: dayLengthMinutes,
      hours: parseFloat((dayLengthMinutes / 60).toFixed(2)),
      formatted: `${dayHours} hours ${dayMins} minutes`
    }
  };
}
