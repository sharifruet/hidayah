import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type { Query } from '@tanstack/react-query';

import { storage } from './storage';

const QUERY_CACHE_KEY = 'hidayah-query-cache';
export const QUERY_PERSIST_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

/** Query keys worth keeping on-device for offline reading: Qur'an text/translations,
 * tafsir, reciters list, books, hadith collections/books/text, and calculation
 * methods. Prayer times/calendar are intentionally excluded — they're location- and
 * date-specific and showing a stale cached value offline would be misleading. */
const OFFLINE_QUERY_PREFIXES = [
  'surah-ayahs',
  'quran-surahs',
  'reciters',
  'tafsir',
  'books',
  'book',
  'book-chapters',
  'book-chapter',
  'methods',
  'hadith-collections',
  'hadith-collection',
  'hadith-books',
  'hadith-book',
];

export function shouldPersistQuery(query: Query): boolean {
  const key = query.queryKey[0];
  return typeof key === 'string' && OFFLINE_QUERY_PREFIXES.includes(key);
}

export const queryPersister = createSyncStoragePersister({
  key: QUERY_CACHE_KEY,
  storage: {
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.remove(key),
  },
  throttleTime: 1000,
});
