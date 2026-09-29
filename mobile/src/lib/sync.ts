/**
 * Optional cloud sync with a sync code (no personal data). The code is the only credential:
 * it's kept in the OS keychain/keystore (expo-secure-store) and sent as
 * `Authorization: Sync <code>`. Each synced document is one storage key (see SYNC_KEYS);
 * the server keeps a version per document and rejects stale writes (409), which we merge
 * (syncMerge.ts) and retry.
 *
 * Per-document bookkeeping in `sync_meta`: the server version we last saw and a hash of the
 * local JSON at that moment — a different hash now means "changed on this device".
 */
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import apiClient, { type ApiError } from './api';
import { getJSON, setJSON, storage } from './storage';
import { SYNC_KEYS, mergeDocument } from './syncMerge';

const CODE_KEY = 'hidayah_sync_code';
const META_KEY = 'sync_meta';
const LAST_SYNC_KEY = 'sync_last_at';
const MAX_ATTEMPTS = 3;

type Meta = Record<string, { version: number; hash: string | null }>;
interface RemoteDoc {
  data: unknown;
  version: number;
  updated_at: string;
}

// ── Code storage (secure store; plain storage on web, which has no keychain) ─────────────

export async function getSyncCode(): Promise<string | null> {
  if (Platform.OS === 'web') return storage.getString(CODE_KEY) ?? null;
  return SecureStore.getItemAsync(CODE_KEY);
}

async function setSyncCode(code: string | null): Promise<void> {
  if (Platform.OS === 'web') {
    if (code) storage.set(CODE_KEY, code);
    else storage.remove(CODE_KEY);
    return;
  }
  if (code) await SecureStore.setItemAsync(CODE_KEY, code);
  else await SecureStore.deleteItemAsync(CODE_KEY);
}

export function getLastSyncAt(): number | null {
  const v = Number(storage.getString(LAST_SYNC_KEY));
  return Number.isFinite(v) && v > 0 ? v : null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────────────

/** djb2 — only compares this device's JSON with itself, so collisions don't matter. */
function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
}

const auth = (code: string) => ({ headers: { Authorization: `Sync ${code}` } });

function readLocal(key: string): { raw: string | null; value: unknown } {
  const raw = storage.getString(key) ?? null;
  return { raw, value: raw == null ? undefined : getJSON<unknown>(key, undefined) };
}

async function push(code: string, key: string, data: unknown, baseVersion: number, meta: Meta): Promise<void> {
  let body = data;
  let base = baseVersion;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const res = await apiClient.put<{ version: number }, { version: number }>(
        `/sync/documents/${key}`,
        { data: body, base_version: base },
        auth(code)
      );
      meta[key] = { version: res.version, hash: hash(JSON.stringify(body)) };
      return;
    } catch (err) {
      const e = err as ApiError & { current?: RemoteDoc };
      if (e.status !== 409) throw err;
      // Another device wrote first: fetch its copy, merge, try again on top of it.
      const { documents } = await apiClient.get<{ documents: Record<string, RemoteDoc> }, { documents: Record<string, RemoteDoc> }>(
        '/sync/documents',
        auth(code)
      );
      const current = documents[key];
      body = mergeDocument(key, body, current?.data);
      base = current?.version ?? 0;
      setJSON(key, body);
    }
  }
  throw new Error(`Sync conflict on ${key} did not settle`);
}

// ── Public API ─────────────────────────────────────────────────────────────────────────

export interface SyncResult {
  pulled: number;
  pushed: number;
}

let running: Promise<SyncResult | null> | null = null;

/** Two-way sync of every document. No-op (null) when sync isn't set up. Safe to call often. */
export function syncNow(): Promise<SyncResult | null> {
  if (!running) running = doSync().finally(() => (running = null));
  return running;
}

async function doSync(): Promise<SyncResult | null> {
  const code = await getSyncCode();
  if (!code) return null;
  const { documents } = await apiClient.get<{ documents: Record<string, RemoteDoc> }, { documents: Record<string, RemoteDoc> }>(
    '/sync/documents',
    auth(code)
  );
  const meta = getJSON<Meta>(META_KEY, {});
  const result: SyncResult = { pulled: 0, pushed: 0 };

  for (const key of SYNC_KEYS) {
    const { raw, value } = readLocal(key);
    const m = meta[key] ?? { version: 0, hash: null };
    const localChanged = raw != null && hash(raw) !== m.hash;
    const remote = documents[key];

    if (remote && remote.version !== m.version) {
      // Changed elsewhere. If it also changed here, merge; otherwise take the server copy.
      const next = localChanged ? mergeDocument(key, value, remote.data) : remote.data;
      setJSON(key, next);
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

  setJSON(META_KEY, meta);
  storage.set(LAST_SYNC_KEY, String(Date.now()));
  return result;
}

/** Creates a backup account for this device's data; returns the code to show the user. */
export async function enableSync(): Promise<string> {
  const { code } = await apiClient.post<{ code: string }, { code: string }>('/sync/accounts');
  await setSyncCode(code);
  storage.remove(META_KEY); // every document is "new" for this account
  await syncNow();
  return code;
}

/** Links this device to an existing backup (merging anything already on the device). */
export async function restoreWithCode(code: string): Promise<SyncResult | null> {
  await apiClient.post('/sync/verify', { code }); // throws 404 for an unknown code
  await setSyncCode(code.trim().toUpperCase());
  storage.remove(META_KEY);
  return syncNow();
}

/** Issues a new code for the same backup; the old one stops working. */
export async function rotateSyncCode(): Promise<string> {
  const current = await getSyncCode();
  if (!current) throw new Error('Sync is not enabled');
  const { code } = await apiClient.post<{ code: string }, { code: string }>('/sync/rotate', undefined, auth(current));
  await setSyncCode(code);
  return code;
}

/** Stops syncing on this device; data stays on the device and in the backup. */
export async function disableSync(): Promise<void> {
  await setSyncCode(null);
  storage.remove(META_KEY);
  storage.remove(LAST_SYNC_KEY);
}

/** Deletes the backup from the server, then stops syncing here. */
export async function deleteBackup(): Promise<void> {
  const code = await getSyncCode();
  if (code) await apiClient.delete('/sync/accounts', auth(code));
  await disableSync();
}
