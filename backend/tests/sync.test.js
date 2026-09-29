/**
 * Sync API: code utilities, plus the real routes/controllers/service run against an
 * in-memory stand-in for the MySQL pool (only the statements syncService issues).
 * Run with: node --test --experimental-test-module-mocks tests/sync.test.js
 */
import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import { generateSyncCode, normalizeSyncCode, hashSyncCode, formatSyncCode } from '../src/utils/syncCode.js';

// ── Fake pool ───────────────────────────────────────────────────────────────
const db = { accounts: [], docs: new Map(), nextId: 1 };
const docKey = (a, k) => `${a}:${k}`;
const fakePool = {
  async query() { return [[]]; }, // CREATE TABLE IF NOT EXISTS
  async execute(sql, p) {
    const s = sql.replace(/\s+/g, ' ').trim();
    if (s.startsWith('INSERT INTO sync_accounts')) { db.accounts.push({ id: db.nextId, hash: p[0] }); return [{ insertId: db.nextId++ }]; }
    if (s.startsWith('SELECT id FROM sync_accounts')) return [db.accounts.filter((a) => a.hash === p[0]).map((a) => ({ id: a.id }))];
    if (s.startsWith('UPDATE sync_accounts SET last_seen_at')) return [{ affectedRows: 1 }];
    if (s.startsWith('UPDATE sync_accounts SET code_hash')) { db.accounts.find((a) => a.id === p[1]).hash = p[0]; return [{ affectedRows: 1 }]; }
    if (s.startsWith('DELETE FROM sync_accounts')) {
      db.accounts = db.accounts.filter((a) => a.id !== p[0]);
      for (const k of [...db.docs.keys()]) if (k.startsWith(`${p[0]}:`)) db.docs.delete(k);
      return [{ affectedRows: 1 }];
    }
    if (s.startsWith('SELECT doc_key, data')) {
      return [[...db.docs.entries()].filter(([k]) => k.startsWith(`${p[0]}:`)).map(([k, d]) => ({ doc_key: k.split(':')[1], ...d }))];
    }
    if (s.startsWith('SELECT data, version')) { const d = db.docs.get(docKey(p[0], p[1])); return [d ? [d] : []]; }
    if (s.startsWith('INSERT IGNORE INTO sync_documents')) {
      const k = docKey(p[0], p[1]);
      if (db.docs.has(k)) return [{ affectedRows: 0 }];
      db.docs.set(k, { data: p[2], version: 1, updated_at: new Date() });
      return [{ affectedRows: 1 }];
    }
    if (s.startsWith('UPDATE sync_documents')) {
      const d = db.docs.get(docKey(p[1], p[2]));
      if (!d || d.version !== p[3]) return [{ affectedRows: 0 }];
      Object.assign(d, { data: p[0], version: d.version + 1, updated_at: new Date() });
      return [{ affectedRows: 1 }];
    }
    throw new Error(`Unexpected SQL: ${s}`);
  },
};

describe('sync codes', () => {
  it('generates 16 unambiguous characters in 4 groups', () => {
    for (let i = 0; i < 200; i++) {
      const code = generateSyncCode();
      assert.match(code, /^[0-9A-HJKMNP-TV-Z]{4}(-[0-9A-HJKMNP-TV-Z]{4}){3}$/);
    }
  });
  it('normalises case, separators and look-alike letters', () => {
    assert.strictEqual(normalizeSyncCode('abcd-efgh-jkmn-pqrs'), 'ABCDEFGHJKMNPQRS');
    assert.strictEqual(normalizeSyncCode(' o1i2 L3AB CDEF GHJK '), '0112' + '13AB' + 'CDEFGHJK');
    assert.strictEqual(normalizeSyncCode('too-short'), null);
    assert.strictEqual(normalizeSyncCode(42), null);
  });
  it('hashes deterministically and formats in groups', () => {
    assert.strictEqual(hashSyncCode('A'.repeat(16)), hashSyncCode('A'.repeat(16)));
    assert.strictEqual(formatSyncCode('ABCDEFGHJKMNPQRS'), 'ABCD-EFGH-JKMN-PQRS');
  });
});

describe('sync API', () => {
  let server, base;

  before(async () => {
    process.env.NODE_ENV = 'test';
    mock.module('../src/config/database.js', { defaultExport: fakePool });
    const { default: syncRoutes } = await import('../src/routes/sync.js');
    const { errorHandler } = await import('../src/middleware/errorHandler.js');
    const app = express();
    app.use(express.json({ limit: '1mb' }));
    app.use('/v1/sync', syncRoutes);
    app.use(errorHandler);
    await new Promise((r) => { server = app.listen(0, r); });
    base = `http://127.0.0.1:${server.address().port}/v1/sync`;
  });
  after(() => server.close());

  const call = async (method, path, { code, body } = {}) => {
    const res = await fetch(base + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(code ? { Authorization: `Sync ${code}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: res.status, body: res.status === 204 ? null : await res.json() };
  };

  it('creates an account, stores documents with versions, detects conflicts', async () => {
    const created = await call('POST', '/accounts');
    assert.strictEqual(created.status, 201);
    const { code } = created.body;
    assert.ok(db.accounts.every((a) => a.hash !== code), 'raw code must not be stored');

    assert.strictEqual((await call('GET', '/documents')).status, 401);
    assert.strictEqual((await call('GET', '/documents', { code: 'AAAA-AAAA-AAAA-AAAA' })).status, 401);

    const first = await call('PUT', '/documents/qada_counts', { code, body: { data: { fajr: 3 }, base_version: 0 } });
    assert.deepStrictEqual([first.status, first.body.version], [200, 1]);

    // Another device writing from a stale base gets the current copy back.
    const stale = await call('PUT', '/documents/qada_counts', { code, body: { data: { fajr: 9 }, base_version: 0 } });
    assert.strictEqual(stale.status, 409);
    assert.deepStrictEqual(stale.body.current.data, { fajr: 3 });

    const second = await call('PUT', '/documents/qada_counts', { code: code.toLowerCase(), body: { data: { fajr: 2 }, base_version: 1 } });
    assert.deepStrictEqual([second.status, second.body.version], [200, 2]);

    const all = await call('GET', '/documents', { code });
    assert.deepStrictEqual(all.body.documents.qada_counts.data, { fajr: 2 });
    assert.strictEqual(all.body.documents.qada_counts.version, 2);
  });

  it('validates keys and bodies', async () => {
    const { code } = (await call('POST', '/accounts')).body;
    assert.strictEqual((await call('PUT', '/documents/passwords', { code, body: { data: 1, base_version: 0 } })).status, 400);
    assert.strictEqual((await call('PUT', '/documents/fav_duas', { code, body: { data: [], base_version: -1 } })).status, 400);
    assert.strictEqual((await call('PUT', '/documents/fav_duas', { code, body: { base_version: 0 } })).status, 400);
    const big = 'x'.repeat(600 * 1024);
    assert.strictEqual((await call('PUT', '/documents/fav_duas', { code, body: { data: big, base_version: 0 } })).status, 413);
  });

  it('verifies, rotates and deletes', async () => {
    const { code } = (await call('POST', '/accounts')).body;
    assert.strictEqual((await call('POST', '/verify', { body: { code } })).status, 200);
    assert.strictEqual((await call('POST', '/verify', { body: { code: 'ZZZZ-ZZZZ-ZZZZ-ZZZZ' } })).status, 404);
    assert.strictEqual((await call('POST', '/verify', { body: { code: 'nope' } })).status, 400);

    const rotated = await call('POST', '/rotate', { code });
    assert.strictEqual(rotated.status, 200);
    assert.strictEqual((await call('GET', '/documents', { code })).status, 401, 'old code revoked');
    assert.strictEqual((await call('GET', '/documents', { code: rotated.body.code })).status, 200);

    assert.strictEqual((await call('DELETE', '/accounts', { code: rotated.body.code })).status, 204);
    assert.strictEqual((await call('GET', '/documents', { code: rotated.body.code })).status, 401);
  });
});
