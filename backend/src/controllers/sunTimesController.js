import { getSunTimesService } from '../services/sunTimesService.js';
import { CalculationError } from '../middleware/errorHandler.js';

/**
 * Get sun times (sunrise, sunset, solar noon, day length) for a coordinate and date
 */
export async function getSunTimes(req, res, next) {
  try {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const date = req.query.date || new Date().toISOString().split('T')[0];

    // Extract timezone parameter
    const options = {};
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

    // Get sun times from service
    const result = await getSunTimesService(latitude, longitude, date, options);

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
      error.message || 'Failed to calculate sun times',
      { latitude: req.query.latitude, longitude: req.query.longitude, date: req.query.date }
    ));
  }
}
