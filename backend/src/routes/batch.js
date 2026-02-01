import express from 'express';
import { batchPrayerTimes } from '../controllers/batchController.js';

const router = express.Router();

/**
 * POST /v1/batch/prayer-times
 * Calculate prayer times for multiple coordinates
 */
router.post('/prayer-times', batchPrayerTimes);

export default router;
