import express from 'express';
import { getSunTimes } from '../controllers/sunTimesController.js';
import { validateCoordinates, validateDate, validatePrayerTimesParams } from '../middleware/validation.js';

const router = express.Router();

/**
 * GET /v1/sun-times
 * Get sunrise, sunset, solar noon, and day length
 */
router.get('/', validateCoordinates, validateDate, validatePrayerTimesParams, getSunTimes);

export default router;
