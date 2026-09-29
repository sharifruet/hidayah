import { AppError } from './errorHandler.js';
import { findAccountIdService } from '../services/syncService.js';

/**
 * Authenticates `Authorization: Sync <code>` and sets `req.syncAccountId`.
 * The code is the credential, so it must only ever travel over HTTPS.
 */
export async function requireSyncAccount(req, res, next) {
  try {
    const [scheme, code] = (req.headers.authorization || '').split(' ');
    const accountId = scheme === 'Sync' && code ? await findAccountIdService(code) : null;
    if (!accountId) throw new AppError('Invalid or missing sync code', 401, 'SYNC_UNAUTHORIZED');
    req.syncAccountId = accountId;
    next();
  } catch (err) {
    next(err);
  }
}
