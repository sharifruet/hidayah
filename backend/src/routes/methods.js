import express from 'express';
import { getMethods } from '../controllers/methodsController.js';

const router = express.Router();

/**
 * GET /v1/methods
 * Get available calculation methods
 */
router.get('/', getMethods);

export default router;
