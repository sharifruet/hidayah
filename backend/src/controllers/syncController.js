import { ValidationError, AppError } from '../middleware/errorHandler.js';
import {
  createAccountService, deleteAccountService, findAccountIdService, listDocumentsService,
  putDocumentService, rotateCodeService,
} from '../services/syncService.js';
import { SYNC_DOC_KEYS, SYNC_DOC_MAX_BYTES, normalizeSyncCode } from '../utils/syncCode.js';

// Sync data is per-user; never let a shared cache keep it.
const noStore = (res) => res.set('Cache-Control', 'no-store');

// POST /v1/sync/accounts — create an account; the code is returned once
export async function createAccount(req, res, next) {
  try {
    const { code } = await createAccountService();
    noStore(res).status(201).json({ code, request_id: req.id });
  } catch (err) {
    next(err);
  }
}

// POST /v1/sync/verify { code } — check a code before restoring on a new device
export async function verifyCode(req, res, next) {
  try {
    if (!normalizeSyncCode(req.body?.code)) throw new ValidationError('code must be 16 characters (XXXX-XXXX-XXXX-XXXX)');
    const accountId = await findAccountIdService(req.body.code);
    if (!accountId) throw new AppError('Sync code not found', 404, 'SYNC_CODE_NOT_FOUND');
    const documents = await listDocumentsService(accountId);
    noStore(res).json({ valid: true, document_count: Object.keys(documents).length, request_id: req.id });
  } catch (err) {
    next(err);
  }
}

// GET /v1/sync/documents
export async function getDocuments(req, res, next) {
  try {
    noStore(res).json({ documents: await listDocumentsService(req.syncAccountId), request_id: req.id });
  } catch (err) {
    next(err);
  }
}

// PUT /v1/sync/documents/:key { data, base_version }
export async function putDocument(req, res, next) {
  try {
    const { key } = req.params;
    if (!SYNC_DOC_KEYS.includes(key)) throw new ValidationError(`Unknown document "${key}"`, { allowed: SYNC_DOC_KEYS });
    const { data, base_version: baseVersion } = req.body || {};
    if (data === undefined) throw new ValidationError('data is required');
    if (!Number.isInteger(baseVersion) || baseVersion < 0) throw new ValidationError('base_version must be a non-negative integer');
    if (Buffer.byteLength(JSON.stringify(data)) > SYNC_DOC_MAX_BYTES) {
      throw new AppError('Document too large', 413, 'SYNC_DOCUMENT_TOO_LARGE');
    }
    const result = await putDocumentService(req.syncAccountId, key, data, baseVersion);
    noStore(res);
    if (result.conflict) {
      return res.status(409).json({
        error: { code: 'SYNC_CONFLICT', message: 'Document changed on another device', request_id: req.id },
        current: result.current,
      });
    }
    res.json({ key, version: result.version, request_id: req.id });
  } catch (err) {
    next(err);
  }
}

// POST /v1/sync/rotate — replace the code (e.g. if it was shared by mistake)
export async function rotateCode(req, res, next) {
  try {
    const { code } = await rotateCodeService(req.syncAccountId);
    noStore(res).json({ code, request_id: req.id });
  } catch (err) {
    next(err);
  }
}

// DELETE /v1/sync/accounts — delete the account and all synced data
export async function deleteAccount(req, res, next) {
  try {
    await deleteAccountService(req.syncAccountId);
    noStore(res).status(204).end();
  } catch (err) {
    next(err);
  }
}
