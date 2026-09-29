/**
 * Optional cloud sync with a sync code (no personal data). Browser port of
 * `mobile/src/lib/sync.ts` — same documents (localStorage keys), same merge rules
 * (syncMerge.js), same server API. The code is the only credential; here it lives in
 * localStorage (browsers have no keychain), so "Stop syncing" is how to remove it from a
 * shared computer.
 */
import apiClient from '../services/api.js';
import { SYNC_KEYS, mergeDocument } from './syncMerge.js';

const CODE_KEY = 'hidayah_sync_code';
const META_KEY = 'sync_meta';
const LAST_SYNC_KEY = 'sync_last_at';
const MAX_ATTEMPTS = 3;

const ls = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  remove: (k) => { try { localStorage.removeItem(k); } catch { /* storage blocked */ } },
};
const readJSON = (k, fallback) => {
  try {
    const raw = ls.get(k);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};
const writeJSON = (k, v) => ls.set(k, JSON.stringify(v));

/** djb2 — only compares this browser's JSON with itself. */
function hash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
}

const auth = (code) => ({ headers: { Authorization: `Sync ${code}` } });

export function getSyncCode() {
  return ls.get(CODE_KEY);
}

export function getLastSyncAt() {
  const v = Number(ls.get(LAST_SYNC_KEY));
  return Number.isFinite(v) && v > 0 ? v : null;
}

async function push(code, key, data, baseVersion, meta) {
  let body = data;
  let base = baseVersion;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const res = await apiClient.put(`/sync/documents/${key}`, { data: body, base_version: base }, auth(code));
      meta[key] = { version: res.version, hash: hash(JSON.stringify(body)) };
      return;
    } catch (err) {
      if (err?.status !== 409) throw err;
      // Another device wrote first: merge with its copy and retry on top of it.
      const { documents } = await apiClient.get('/sync/documents', auth(code));
      const current = documents[key];
      body = mergeDocument(key, body, current?.data);
      base = current?.version ?? 0;
      writeJSON(key, body);
    }
  }
  throw new Error(`Sync conflict on ${key} did not settle`);
}

let running = null;

/** Two-way sync of every document; resolves null when sync isn't set up. */
export function syncNow() {
  if (!running) running = doSync().finally(() => { running = null; });
  return running;
}

async function doSync() {
  const code = getSyncCode();
  if (!code) return null;
  const { documents } = await apiClient.get('/sync/documents', auth(code));
  const meta = readJSON(META_KEY, {});
  const result = { pulled: 0, pushed: 0 };

  for (const key of SYNC_KEYS) {
    const raw = ls.get(key);
    const value = raw == null ? undefined : readJSON(key, undefined);
    const m = meta[key] ?? { version: 0, hash: null };
    const localChanged = raw != null && hash(raw) !== m.hash;
    const remote = documents[key];

    if (remote && remote.version !== m.version) {
      const next = localChanged ? mergeDocument(key, value, remote.data) : remote.data;
      writeJSON(key, next);
      result.pulled++;
      if (JSON.stringify(next) !== JSON.stringify(remote.data)) {
        await push(code, key, next, remote.version, meta);
        result.pushed++;
      } else {
        meta[key] = { version: remote.version, hash: hash(JSON.stringify(next)) };
      }
    } else if (localChanged) {
      await push(code, key, value, remote?.version ?? 0, meta);
      result.pushed++;
    }
  }

  writeJSON(META_KEY, meta);
  ls.set(LAST_SYNC_KEY, String(Date.now()));
  return result;
}

export async function enableSync() {
  const { code } = await apiClient.post('/sync/accounts');
  ls.set(CODE_KEY, code);
  ls.remove(META_KEY);
  await syncNow();
  return code;
}

export async function restoreWithCode(code) {
  await apiClient.post('/sync/verify', { code }); // rejects with status 404 for an unknown code
  ls.set(CODE_KEY, code.trim().toUpperCase());
  ls.remove(META_KEY);
  return syncNow();
}

export async function rotateSyncCode() {
  const current = getSyncCode();
  if (!current) throw new Error('Sync is not enabled');
  const { code } = await apiClient.post('/sync/rotate', undefined, auth(current));
  ls.set(CODE_KEY, code);
  return code;
}

export function disableSync() {
  ls.remove(CODE_KEY);
  ls.remove(META_KEY);
  ls.remove(LAST_SYNC_KEY);
}

export async function deleteBackup() {
  const code = getSyncCode();
  if (code) await apiClient.delete('/sync/accounts', auth(code));
  disableSync();
}

/** Sync on load, when the tab is hidden/shown, and every 10 minutes while open. */
export function startAutoSync() {
  const run = () => { syncNow().catch(() => {}); };
  run();
  const onVisibility = () => run();
  document.addEventListener('visibilitychange', onVisibility);
  const timer = setInterval(run, 10 * 60 * 1000);
  return () => {
    document.removeEventListener('visibilitychange', onVisibility);
    clearInterval(timer);
  };
}
