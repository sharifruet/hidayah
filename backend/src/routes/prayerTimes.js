import express from 'express';
import { getPrayerTimes } from '../controllers/prayerTimesController.js';
import { validateCoordinates, validateDate, validateMethod, validatePrayerTimesParams } from '../middleware/validation.js';

const router = express.Router();

/**
 * GET /v1/prayer-times
 * Get prayer times for a coordinate and date
 */
router.get('/', validateCoordinates, validateDate, validateMethod, validatePrayerTimesParams, getPrayerTimes);

export default router;
