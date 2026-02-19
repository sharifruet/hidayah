import { getPrayerTimesService } from '../services/prayerTimesService.js';
import { CalculationError } from '../middleware/errorHandler.js';

/**
 * Get prayer times for a coordinate and date
 */
export async function getPrayerTimes(req, res, next) {
  const startTime = Date.now();

  try {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const method = req.query.method || 'karachi';

    // Extract optional parameters
    const options = {};
    if (req.query.fajr_angle !== undefined) {
      options.fajr_angle = parseFloat(req.query.fajr_angle);
    }
    if (req.query.isha_angle !== undefined) {
      options.isha_angle = parseFloat(req.query.isha_angle);
    }
    if (req.query.isha_time_adjustment !== undefined) {
      options.isha_time_adjustment = parseInt(req.query.isha_time_adjustment);
    }
    if (req.query.asr_method !== undefined) {
      options.asr_method = req.query.asr_method.toLowerCase();
    }
    if (req.query.dhuhr_adjustment !== undefined) {
      options.dhuhr_adjustment = parseInt(req.query.dhuhr_adjustment);
    }
    if (req.query.maghrib_adjustment !== undefined) {
      options.maghrib_adjustment = parseInt(req.query.maghrib_adjustment);
    }
    if (req.query.sunset_adjustment !== undefined) {
      options.sunset_adjustment = parseInt(req.query.sunset_adjustment);
    }
    if (req.query.sunset_angle !== undefined) {
      options.sunset_angle = parseFloat(req.query.sunset_angle);
    }
    if (req.query.hijri_adjustment !== undefined) {
      options.hijriAdjustment = parseInt(req.query.hijri_adjustment);
    }
    if (req.query.timezone !== undefined) {
      // Parse timezone offset (e.g., "+06:00" -> 6)
      const tzMatch = req.query.timezone.match(/^([+-])(\d{2}):(\d{2})$/);
      if (tzMatch) {
        const sign = tzMatch[1] === '+' ? 1 : -1;
        const hours = parseInt(tzMatch[2]);
        const minutes = parseInt(tzMatch[3]);
        options.timezone_offset = sign * (hours + minutes / 60);
      }
    }

    // Get prayer times from service
    const result = await getPrayerTimesService(latitude, longitude, date, method, options);

    const responseTime = Date.now() - startTime;

    // Add request metadata to response
    res.json({
      ...result,
      request_id: req.id,
      response_time_ms: responseTime
    });

  } catch (error) {
    if (error instanceof CalculationError) {
      return next(error);
    }

    // Wrap other errors
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const method = req.query.method || 'karachi';

    next(new CalculationError(
      error.message || 'Failed to calculate prayer times',
      { latitude, longitude, date, method }
    ));
  }
}
