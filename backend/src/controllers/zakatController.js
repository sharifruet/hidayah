import { getNisabService } from '../services/zakatService.js';

/**
 * GET /v1/zakat/nisab — gold/silver rates and nisab thresholds for the zakat calculator
 */
export function getNisab(req, res, next) {
  try {
    // Rates change at most daily; let clients and proxies cache for an hour.
    res.set('Cache-Control', 'public, max-age=3600');
    res.json({ ...getNisabService(), request_id: req.id });
  } catch (err) {
    next(err);
  }
}
