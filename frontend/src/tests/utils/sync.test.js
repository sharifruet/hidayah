import { describe, it, expect, beforeEach, vi } from 'vitest';

// In-memory stand-in for the sync API (same contract as backend/src/routes/sync.js).
const server = vi.hoisted(() => ({ docs: {}, codes: new Set() }));
vi.mock('../../services/api.js', () => {
  const check = (cfg) => {
    const code = cfg?.headers?.Authorization?.replace('Sync ', '');
    if (!server.codes.has(code)) throw { status: 401, code: 'SYNC_UNAUTHORIZED' };
  };
  return {
    default: {
      post: vi.fn(async (url, body) => {
        if (url === '/sync/accounts') { server.codes.add('AAAA-BBBB-CCCC-DDDD'); return { code: 'AAAA-BBBB-CCCC-DDDD' }; }
        if (url === '/sync/verify') { if (!server.codes.has(body.code)) throw { status: 404 }; return { valid: true }; }
        throw new Error(url);
      }),
      get: vi.fn(async (url, cfg) => { check(cfg); return { documents: structuredClone(server.docs) }; }),
      put: vi.fn(async (url, body, cfg) => {
        check(cfg);
        const key = url.split('/').pop();
        const cur = server.docs[key];
        if ((cur?.version ?? 0) !== body.base_version) throw { status: 409, code: 'SYNC_CONFLICT' };
        server.docs[key] = { data: structuredClone(body.data), version: (cur?.version ?? 0) + 1 };
        return { version: server.docs[key].version };
      }),
      delete: vi.fn(async () => {}),
    },
  };
});

const sync = await import('../../utils/sync.js');
const { mergeDocument } = await import('../../utils/syncMerge.js');
const get = (k) => JSON.parse(localStorage.getItem(k));
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

beforeEach(() => {
  localStorage.clear();
  server.docs = {};
  server.codes = new Set();
});

describe('sync merge rules', () => {
  it('unions bookmarks by id and favourites by value', () => {
    expect(mergeDocument('quran_bookmarks', [{ id: '1:1' }], [{ id: '1:1' }, { id: '2:255' }]).map((b) => b.id)).toEqual(['1:1', '2:255']);
    expect(mergeDocument('fav_duas', ['a'], ['b', 'a'])).toEqual(['a', 'b']);
  });
  it('keeps the higher owed-prayer count and the newest book position', () => {
    expect(mergeDocument('qada_counts', { fajr: 2, isha: 5 }, { fajr: 4, asr: 1 })).toEqual({ fajr: 4, isha: 5, asr: 1 });
    expect(mergeDocument('book_positions', { a: { page: 3, updatedAt: 1 } }, { a: { page: 9, updatedAt: 2 } }).a.page).toBe(9);
  });
});

describe('sync engine', () => {
  it('backs up this browser, then restores into an empty one', async () => {
    set('quran_bookmarks', [{ id: '2:255' }]);
    set('fav_duas', ['morning-1']);
    const code = await sync.enableSync();
    expect(server.docs.quran_bookmarks.data).toEqual([{ id: '2:255' }]);

    localStorage.clear(); // "new phone"
    await sync.restoreWithCode(code);
    expect(get('quran_bookmarks')).toEqual([{ id: '2:255' }]);
    expect(get('fav_duas')).toEqual(['morning-1']);
    expect(sync.getSyncCode()).toBe(code);
  });

  it('merges when both sides changed since the last sync', async () => {
    set('fav_duas', ['a']);
    await sync.enableSync();
    // Another device adds 'b'; this browser adds 'c'.
    server.docs.fav_duas = { data: ['a', 'b'], version: server.docs.fav_duas.version + 1 };
    set('fav_duas', ['c', 'a']);
    await sync.syncNow();
    expect(get('fav_duas')).toEqual(['c', 'a', 'b']);
    expect(server.docs.fav_duas.data).toEqual(['c', 'a', 'b']);
  });

  it('pulls without pushing when only the server changed, and is a no-op when off', async () => {
    await sync.enableSync();
    server.docs.qada_counts = { data: { fajr: 7 }, version: 1 };
    const res = await sync.syncNow();
    expect(get('qada_counts')).toEqual({ fajr: 7 });
    expect(res).toEqual({ pulled: 1, pushed: 0 });
    sync.disableSync();
    expect(await sync.syncNow()).toBeNull();
  });

  it('rejects an unknown code on restore', async () => {
    await expect(sync.restoreWithCode('ZZZZ-ZZZZ-ZZZZ-ZZZZ')).rejects.toMatchObject({ status: 404 });
    expect(sync.getSyncCode()).toBeNull();
  });
});
