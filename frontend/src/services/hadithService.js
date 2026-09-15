import apiClient from './api.js';

export async function fetchCollections() {
  return apiClient.get('/hadith/collections');
}

export async function fetchCollection(slug) {
  return apiClient.get(`/hadith/collections/${slug}`);
}

export async function fetchBooks(slug) {
  return apiClient.get(`/hadith/collections/${slug}/books`);
}

export async function fetchBookHadiths(slug, bookNumber, translations = []) {
  return apiClient.get(`/hadith/collections/${slug}/books/${bookNumber}`, {
    params: translations.length ? { translations: translations.join(',') } : {},
  });
}

export async function fetchHadith(slug, number, translations = []) {
  return apiClient.get('/hadith/hadith', {
    params: {
      collection: slug,
      number,
      ...(translations.length && { translations: translations.join(',') }),
    },
  });
}

export async function fetchHadithEditions(language) {
  return apiClient.get('/hadith/editions', {
    params: language ? { language } : {},
  });
}

export async function fetchHadithSearch(q, { language = 'en', collection = 'all', page = 1, limit = 20 } = {}) {
  return apiClient.get('/hadith/search', {
    params: { q, language, collection, page, limit },
  });
}

/**
 * Persist/load reader settings (which languages to show) in localStorage.
 */
const SETTINGS_KEY = 'hadith_reader_settings';

export function loadReaderSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveReaderSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

const RESUME_KEY = 'hadith_last_read';

export function loadLastRead() {
  try {
    return JSON.parse(localStorage.getItem(RESUME_KEY)) || null;
  } catch {
    return null;
  }
}

export function saveLastRead(collectionSlug, bookNumber) {
  localStorage.setItem(RESUME_KEY, JSON.stringify({ collection: collectionSlug, book: bookNumber }));
}
