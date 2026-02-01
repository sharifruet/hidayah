import express from 'express';
import { getMonthlyCalendar, getYearlyCalendar, getDateRangeCalendar } from '../controllers/calendarController.js';
import { validateCoordinates, validateMethod, validateSehriMargin, validatePrayerTimesParams, validateDateRange, validateYear, validateMonth } from '../middleware/validation.js';

const router = express.Router();

/**
 * GET /v1/calendar/monthly
 * Get prayer and fasting times for all days in a month
 */
router.get('/monthly',
  validateCoordinates,
  validateYear,
  validateMonth,
  validateMethod,
  validateSehriMargin,
  validatePrayerTimesParams,
  getMonthlyCalendar
);

/**
 * GET /v1/calendar/yearly
 * Get prayer and fasting times for all days in a year
 */
router.get('/yearly',
  validateCoordinates,
  validateYear,
  validateMethod,
  validateSehriMargin,
  validatePrayerTimesParams,
  getYearlyCalendar
);

/**
 * GET /v1/calendar/date-range
 * Get prayer and fasting times for a date range
 */
router.get('/date-range',
  validateCoordinates,
  validateDateRange,
  validateMethod,
  validateSehriMargin,
  validatePrayerTimesParams,
  getDateRangeCalendar
);

export default router;
