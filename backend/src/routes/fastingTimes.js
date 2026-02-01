import express from 'express';
import { getFastingTimes } from '../controllers/fastingTimesController.js';
import { validateCoordinates, validateDate, validateMethod, validateSehriMargin, validatePrayerTimesParams } from '../middleware/validation.js';

const router = express.Router();

/**
 * GET /v1/fasting-times
 * Get fasting times for a coordinate and date
 */
router.get('/', validateCoordinates, validateDate, validateMethod, validateSehriMargin, validatePrayerTimesParams, getFastingTimes);

export default router;
