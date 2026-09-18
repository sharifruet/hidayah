import apiClient from './api.js';

const CACHE_KEY = 'duas_collection_v1';

/**
 * Fetch the whole du'a collection ({ categories, duas, updated_at }).
 * The last good copy is kept in localStorage so the page still renders offline.
 */
export async function getDuasCollection() {
  const data = await apiClient.get('/duas');
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, cached_at: new Date().toISOString() })); } catch {}
  return data;
}

export function loadCachedDuasCollection() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

export function duaCategoryLabel(cat, language) {
  return cat[`label_${language}`] || cat.label_en;
}
