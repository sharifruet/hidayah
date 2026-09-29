import pool from '../config/database.js';
import { generateSyncCode, hashSyncCode, normalizeSyncCode } from '../utils/syncCode.js';

let schemaReady = null;

/**
 * Creates the sync tables on first use, so an existing database needs no manual migration
 * (same SQL as database/migrations/004_sync.sql and schema.sql).
 */
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS sync_accounts (
          id           BIGINT AUTO_INCREMENT PRIMARY KEY,
          code_hash    CHAR(64) NOT NULL UNIQUE,
          created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_seen_at TIMESTAMP NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS sync_documents (
          account_id  BIGINT NOT NULL,
          doc_key     VARCHAR(40) NOT NULL,
          data        MEDIUMTEXT NOT NULL,
          version     INT UNSIGNED NOT NULL DEFAULT 1,
          updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (account_id, doc_key),
          CONSTRAINT fk_sync_documents_account FOREIGN KEY (account_id)
            REFERENCES sync_accounts(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    })().catch((err) => {
      schemaReady = null; // retry on the next request
      throw err;
    });
  }
  return schemaReady;
}

/** New account; returns its code (shown to the user once — only the hash is stored). */
export async function createAccountService() {
  await ensureSchema();
  const code = generateSyncCode();
  await pool.execute('INSERT INTO sync_accounts (code_hash, last_seen_at) VALUES (?, NOW())', [
    hashSyncCode(normalizeSyncCode(code)),
  ]);
  return { code };
}

/** Account id for a code, or null. Also records when it was last used. */
export async function findAccountIdService(code) {
  await ensureSchema();
  const normalized = normalizeSyncCode(code);
  if (!normalized) return null;
  const [rows] = await pool.execute('SELECT id FROM sync_accounts WHERE code_hash = ?', [hashSyncCode(normalized)]);
  if (!rows.length) return null;
  await pool.execute('UPDATE sync_accounts SET last_seen_at = NOW() WHERE id = ?', [rows[0].id]);
  return rows[0].id;
}

export async function listDocumentsService(accountId) {
  const [rows] = await pool.execute(
    'SELECT doc_key, data, version, updated_at FROM sync_documents WHERE account_id = ?',
    [accountId]
  );
  const documents = {};
  for (const r of rows) {
    documents[r.doc_key] = { data: JSON.parse(r.data), version: r.version, updated_at: r.updated_at };
  }
  return documents;
}

async function getDocument(accountId, key) {
  const [rows] = await pool.execute(
    'SELECT data, version, updated_at FROM sync_documents WHERE account_id = ? AND doc_key = ?',
    [accountId, key]
  );
  return rows.length ? { data: JSON.parse(rows[0].data), version: rows[0].version, updated_at: rows[0].updated_at } : null;
}

/**
 * Optimistic write: succeeds only if the stored version still equals `baseVersion`
 * (0 = "I believe it doesn't exist yet"). On a mismatch returns `{ conflict, current }` so the
 * client can merge and retry.
 */
export async function putDocumentService(accountId, key, data, baseVersion) {
  const json = JSON.stringify(data);
  if (baseVersion === 0) {
    const [result] = await pool.execute(
      'INSERT IGNORE INTO sync_documents (account_id, doc_key, data, version) VALUES (?, ?, ?, 1)',
      [accountId, key, json]
    );
    if (result.affectedRows === 1) return { version: 1 };
  } else {
    const [result] = await pool.execute(
      'UPDATE sync_documents SET data = ?, version = version + 1, updated_at = NOW() WHERE account_id = ? AND doc_key = ? AND version = ?',
      [json, accountId, key, baseVersion]
    );
    if (result.affectedRows === 1) return { version: baseVersion + 1 };
  }
  return { conflict: true, current: await getDocument(accountId, key) };
}

/** Replaces the account's code (the old one stops working immediately). */
export async function rotateCodeService(accountId) {
  const code = generateSyncCode();
  await pool.execute('UPDATE sync_accounts SET code_hash = ? WHERE id = ?', [hashSyncCode(normalizeSyncCode(code)), accountId]);
  return { code };
}

/** Deletes the account and all its documents. */
export async function deleteAccountService(accountId) {
  await pool.execute('DELETE FROM sync_accounts WHERE id = ?', [accountId]);
}
