import { getDuasCollectionService, listDuaCategoriesService } from '../services/duasService.js';

/**
 * GET /v1/duas — full collection (categories + du'as + updated_at)
 */
export async function getDuas(req, res, next) {
  try {
    const result = await getDuasCollectionService();
    // Clients re-sync on a multi-day interval; let intermediaries cache for an hour.
    res.set('Cache-Control', 'public, max-age=3600');
    res.json({ ...result, request_id: req.id });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /v1/duas/categories
 */
export async function getDuaCategories(req, res, next) {
  try {
    res.json({ categories: await listDuaCategoriesService(), request_id: req.id });
  } catch (err) {
    next(err);
  }
}
