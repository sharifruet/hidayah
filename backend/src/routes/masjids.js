import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  listNearbyMasjids,
  searchMasjids,
  getMasjid,
  createMasjid,
  updateJamahTimes,
} from '../controllers/masjidsController.js';
import {
  validateMasjidBody,
  validateJamahBody,
  validateNearbyQuery,
  validateOptionalCoords,
} from '../middleware/validation.js';

const router = express.Router();

// Community submissions are unauthenticated — throttle writes harder than
// reads in production (the global limiter still applies on top).
const writeLimiter = process.env.NODE_ENV === 'production'
  ? rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many submissions from this IP, please try again later.',
        },
      },
    })
  : (req, res, next) => next();

/**
 * GET /v1/masjids/nearby
 * Masjids within radius_km (default 5) of lat/lng, nearest first
 */
router.get('/nearby', validateNearbyQuery, listNearbyMasjids);

/**
 * GET /v1/masjids
 * Search masjids by name/address; pass lat/lng to sort by distance
 */
router.get('/', validateOptionalCoords, searchMasjids);

/**
 * POST /v1/masjids
 * Add a masjid (community submission)
 */
router.post('/', writeLimiter, validateMasjidBody, createMasjid);

/**
 * GET /v1/masjids/:id
 */
router.get('/:id', validateOptionalCoords, getMasjid);

/**
 * PUT /v1/masjids/:id/jamah
 * Set/update jamah (congregation) times for a masjid
 */
router.put('/:id/jamah', writeLimiter, validateJamahBody, updateJamahTimes);

export default router;
