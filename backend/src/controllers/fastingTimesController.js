import { getFastingTimesService } from '../services/fastingTimesService.js';
import { CalculationError } from '../middleware/errorHandler.js';

/**
 * Get fasting times for a coordinate and date
 */
export async function getFastingTimes(req, res, next) {
  try {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const method = req.query.method || 'karachi';
    const sehriMargin = parseInt(req.query.sehri_margin) || 10;

    // Extract optional parameters (same as prayer-times)
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

    // Get fasting times from service
    const result = await getFastingTimesService(latitude, longitude, date, method, sehriMargin, options);

    // Add request metadata to response
    res.json({
      ...result,
      request_id: req.id
    });

  } catch (error) {
    if (error instanceof CalculationError) {
      return next(error);
    }

    // Wrap other errors
    next(new CalculationError(
      error.message || 'Failed to calculate fasting times',
      { latitude: req.query.latitude, longitude: req.query.longitude, date: req.query.date, method: req.query.method }
    ));
  }
}
