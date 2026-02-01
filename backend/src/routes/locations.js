import express from 'express';
import { searchLocations } from '../controllers/locationsController.js';

const router = express.Router();

/**
 * GET /v1/locations/search
 * Search for locations by name
 */
router.get('/search', searchLocations);

export default router;
