import express from 'express';
import { getDuas, getDuaCategories } from '../controllers/duasController.js';

const router = express.Router();

/**
 * GET /v1/duas/categories
 */
router.get('/categories', getDuaCategories);

/**
 * GET /v1/duas
 * Entire du'a collection — apps cache this locally and re-sync periodically
 */
router.get('/', getDuas);

export default router;
