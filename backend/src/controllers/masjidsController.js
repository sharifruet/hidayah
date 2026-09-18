import {
  listNearbyMasjidsService,
  searchMasjidsService,
  getMasjidService,
  createMasjidService,
  upsertJamahTimesService,
} from '../services/masjidsService.js';

function parseCoords(query) {
  const lat = parseFloat(query.lat);
  const lng = parseFloat(query.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : {};
}

function notFound(req, res) {
  return res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Masjid not found', request_id: req.id },
  });
}

/**
 * GET /v1/masjids/nearby?lat=&lng=&radius_km=&limit=
 */
export async function listNearbyMasjids(req, res, next) {
  try {
    const { lat, lng } = parseCoords(req.query);
    const result = await listNearbyMasjidsService({
      lat, lng,
      radiusKm: req.query.radius_km,
      limit: req.query.limit,
    });
    res.json({ ...result, total_results: result.masjids.length, request_id: req.id });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /v1/masjids?q=&lat=&lng=&limit=
 */
export async function searchMasjids(req, res, next) {
  try {
    const result = await searchMasjidsService({
      q: req.query.q,
      ...parseCoords(req.query),
      limit: req.query.limit,
    });
    res.json({ ...result, total_results: result.masjids.length, request_id: req.id });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /v1/masjids/:id?lat=&lng=
 */
export async function getMasjid(req, res, next) {
  try {
    const masjid = await getMasjidService(req.params.id, parseCoords(req.query));
    if (!masjid) return notFound(req, res);
    res.json(masjid);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /v1/masjids
 */
export async function createMasjid(req, res, next) {
  try {
    // Public submissions can't set moderation status.
    const body = { ...req.body };
    delete body.status;
    const masjid = await createMasjidService(body);
    res.status(201).json(masjid);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /v1/masjids/:id/jamah
 */
export async function updateJamahTimes(req, res, next) {
  try {
    const masjid = await upsertJamahTimesService(req.params.id, req.body);
    if (!masjid) return notFound(req, res);
    res.json(masjid);
  } catch (err) {
    next(err);
  }
}
