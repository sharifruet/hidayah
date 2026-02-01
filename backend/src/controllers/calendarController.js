import { getMonthlyCalendarService, getYearlyCalendarService, getDateRangeCalendarService } from '../services/calendarService.js';
import { ValidationError } from '../middleware/errorHandler.js';

/**
 * Get monthly calendar
 */
export async function getMonthlyCalendar(req, res, next) {
  try {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const method = req.query.method || 'karachi';
    const includeFasting = req.query.include_fasting !== 'false';
    const sehriMargin = parseInt(req.query.sehri_margin) || 10;

    if (!year || !month || month < 1 || month > 12) {
      throw new ValidationError('Year and month (1-12) are required', {
        year: year,
        month: month
      });
    }

    // Extract optional parameters
    const options = extractCalculationOptions(req.query);

    const result = await getMonthlyCalendarService(latitude, longitude, year, month, method, includeFasting, sehriMargin, options);

    res.json({
      ...result,
      request_id: req.id
    });

  } catch (error) {
    next(error);
  }
}

/**
 * Get yearly calendar
 */
export async function getYearlyCalendar(req, res, next) {
  try {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const method = req.query.method || 'karachi';
    const format = req.query.format || 'summary';
    const includeFasting = req.query.include_fasting !== 'false';
    const sehriMargin = parseInt(req.query.sehri_margin) || 10;

    if (!year || year < 1900 || year > 2100) {
      throw new ValidationError('Valid year (1900-2100) is required', {
        year: year
      });
    }

    if (format !== 'summary' && format !== 'full') {
      throw new ValidationError('Format must be "summary" or "full"', {
        format: format,
        valid_values: ['summary', 'full']
      });
    }

    // Extract optional parameters
    const options = extractCalculationOptions(req.query);

    const result = await getYearlyCalendarService(latitude, longitude, year, method, format, includeFasting, sehriMargin, options);

    res.json({
      ...result,
      request_id: req.id
    });

  } catch (error) {
    next(error);
  }
}

/**
 * Get date range calendar
 */
export async function getDateRangeCalendar(req, res, next) {
  try {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;
    const method = req.query.method || 'karachi';
    const includeFasting = req.query.include_fasting !== 'false';
    const sehriMargin = parseInt(req.query.sehri_margin) || 10;

    if (!startDate || !endDate) {
      throw new ValidationError('Both start_date and end_date are required', {
        start_date: startDate,
        end_date: endDate
      });
    }

    // Extract optional parameters
    const options = extractCalculationOptions(req.query);

    const result = await getDateRangeCalendarService(latitude, longitude, startDate, endDate, method, includeFasting, sehriMargin, options);

    res.json({
      ...result,
      request_id: req.id
    });

  } catch (error) {
    next(error);
  }
}

/**
 * Extract calculation options from query parameters
 */
function extractCalculationOptions(query) {
  const options = {};

  if (query.fajr_angle !== undefined) {
    options.fajr_angle = parseFloat(query.fajr_angle);
  }
  if (query.isha_angle !== undefined) {
    options.isha_angle = parseFloat(query.isha_angle);
  }
  if (query.isha_time_adjustment !== undefined) {
    options.isha_time_adjustment = parseInt(query.isha_time_adjustment);
  }
  if (query.asr_method !== undefined) {
    options.asr_method = query.asr_method.toLowerCase();
  }
  if (query.dhuhr_adjustment !== undefined) {
    options.dhuhr_adjustment = parseInt(query.dhuhr_adjustment);
  }
  if (query.maghrib_adjustment !== undefined) {
    options.maghrib_adjustment = parseInt(query.maghrib_adjustment);
  }
  if (query.hijri_adjustment !== undefined) {
    options.hijriAdjustment = parseInt(query.hijri_adjustment);
  }
  if (query.timezone !== undefined) {
    // Parse timezone offset (e.g., "+06:00" -> 6)
    const tzMatch = query.timezone.match(/^([+-])(\d{2}):(\d{2})$/);
    if (tzMatch) {
      const sign = tzMatch[1] === '+' ? 1 : -1;
      const hours = parseInt(tzMatch[2]);
      const minutes = parseInt(tzMatch[3]);
      options.timezone_offset = sign * (hours + minutes / 60);
    }
  }

  return options;
}
