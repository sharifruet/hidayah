/**
 * Local copy of the du'a collection.
 *
 * Du'as live in the backend DB (GET /v1/duas). The app copies the collection
 * into MMKV on first launch and re-syncs it every DUAS_SYNC_INTERVAL_DAYS, so
 * the Du'a tab never needs the network in between. Until the first successful
 * sync, a snapshot bundled with the app (data/duas.json) is used.
 */
import { useCallback, useEffect, useState } from 'react';

import bundled from '../data/duas.json';
import { getJSON, setJSON, storage } from './storage';
import { fetchDuasCollection, type DuasCollection } from './services/duas';

export const DUAS_SYNC_INTERVAL_DAYS = 7;
const SYNC_INTERVAL_MS = DUAS_SYNC_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

const COLLECTION_KEY = 'duas_collection_v1';
const LAST_SYNC_KEY = 'duas_last_sync_at';

const BUNDLED = bundled as DuasCollection;

type Listener = () => void;
const listeners = new Set<Listener>();
let inFlight: Promise<boolean> | null = null;

function notify() {
  listeners.forEach((l) => l());
}

/** Locally stored collection, or the bundled snapshot before the first sync. */
export function loadDuasCollection(): DuasCollection {
  const stored = getJSON<DuasCollection | null>(COLLECTION_KEY, null);
  return stored && stored.duas?.length ? stored : BUNDLED;
}

export function getDuasLastSyncAt(): Date | null {
  const raw = storage.getString(LAST_SYNC_KEY);
  return raw ? new Date(raw) : null;
}

export function isDuasSyncDue(): boolean {
  const last = getDuasLastSyncAt();
  return !last || Date.now() - last.getTime() >= SYNC_INTERVAL_MS;
}

/**
 * Download the collection and replace the local copy. Resolves true when the
 * sync succeeded (even if nothing changed). Network errors are swallowed —
 * the caller keeps showing the current local copy.
 */
export async function syncDuas(): Promise<boolean> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const fresh = await fetchDuasCollection();
      if (!fresh?.duas?.length) return false;
      setJSON(COLLECTION_KEY, fresh);
      storage.set(LAST_SYNC_KEY, new Date().toISOString());
      notify();
      return true;
    } catch {
      return false;
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}

/** Called once at app start: sync only when the interval has elapsed (or never synced). */
export function syncDuasIfDue(): Promise<boolean> {
  return isDuasSyncDue() ? syncDuas() : Promise.resolve(false);
}

/** Reactive access to the local collection for screens. */
export function useDuas() {
  const [collection, setCollection] = useState<DuasCollection>(loadDuasCollection);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(getDuasLastSyncAt);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setCollection(loadDuasCollection());
      setLastSyncAt(getDuasLastSyncAt());
    };
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  const refresh = useCallback(async () => {
    setSyncing(true);
    try {
      return await syncDuas();
    } finally {
      setSyncing(false);
    }
  }, []);

  return { ...collection, lastSyncAt, syncing, refresh, isBundled: !lastSyncAt };
}
