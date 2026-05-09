import express from 'express';
import { getMonthlyCalendar, getYearlyCalendar, getDateRangeCalendar } from '../controllers/calendarController.js';
import { validateCoordinates, validateMethod, validatePrayerTimesParams, validateDateRange, validateYear, validateMonth } from '../middleware/validation.js';

const router = express.Router();

router.get('/monthly',
  validateCoordinates,
  validateYear,
  validateMonth,
  validateMethod,
  validatePrayerTimesParams,
  getMonthlyCalendar
);

router.get('/yearly',
  validateCoordinates,
  validateYear,
  validateMethod,
  validatePrayerTimesParams,
  getYearlyCalendar
);

router.get('/date-range',
  validateCoordinates,
  validateDateRange,
  validateMethod,
  validatePrayerTimesParams,
  getDateRangeCalendar
);

export default router;
