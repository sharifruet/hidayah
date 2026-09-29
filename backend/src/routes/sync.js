import express from 'express';
import rateLimit from 'express-rate-limit';
import { requireSyncAccount } from '../middleware/syncAuth.js';
import {
  createAccount, deleteAccount, getDocuments, putDocument, rotateCode, verifyCode,
} from '../controllers/syncController.js';

const router = express.Router();

// Codes carry 80 random bits, so guessing is hopeless — these limits just stop abuse
// (mass account creation, hammering verify). Off in tests.
const limit = (windowMinutes, max) =>
  process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({ windowMs: windowMinutes * 60 * 1000, max, standardHeaders: true, legacyHeaders: false });

/** POST /v1/sync/accounts → { code } */
router.post('/accounts', limit(60, 20), createAccount);

/** POST /v1/sync/verify { code } → { valid, document_count } | 404 */
router.post('/verify', limit(15, 30), verifyCode);

// Everything below needs `Authorization: Sync <code>`.
router.get('/documents', requireSyncAccount, getDocuments);
router.put('/documents/:key', requireSyncAccount, putDocument);
router.post('/rotate', requireSyncAccount, rotateCode);
router.delete('/accounts', requireSyncAccount, deleteAccount);

export default router;
