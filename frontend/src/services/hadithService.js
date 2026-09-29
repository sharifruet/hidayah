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

/** Translation language served for an app language — only Bangla and English are seeded. */
export function hadithLanguageFor(appLanguage) {
  return appLanguage === 'bn' ? 'bn' : 'en';
}

/** Edition identifier for a collection in the given app language, e.g. "ben-bukhari" / "eng-bukhari". */
export function editionFor(slug, appLanguage) {
  return `${hadithLanguageFor(appLanguage) === 'bn' ? 'ben' : 'eng'}-${slug}`;
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
