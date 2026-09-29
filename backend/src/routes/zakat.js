import express from 'express';
import { getNisab } from '../controllers/zakatController.js';

const router = express.Router();

/**
 * GET /v1/zakat/nisab
 */
router.get('/nisab', getNisab);

export default router;
