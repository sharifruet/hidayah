import apiClient from './api.js';

export async function fetchSurahs() {
  return apiClient.get('/quran/surahs');
}

export async function fetchSurah(surahNumber, translations = ['en.sahih']) {
  return apiClient.get(`/quran/surahs/${surahNumber}`, {
    params: { translations: translations.join(',') },
  });
}

export async function fetchSurahAyahs(surahNumber, { from, to, limit, translations = ['en.sahih'] } = {}) {
  return apiClient.get(`/quran/surahs/${surahNumber}/ayahs`, {
    params: {
      translations: translations.join(','),
      ...(from  != null && { from }),
      ...(to    != null && { to }),
      ...(limit != null && { limit }),
    },
  });
}

export async function fetchAyah(surahNumber, ayahNumber, translations = ['en.sahih']) {
  return apiClient.get('/quran/ayah', {
    params: { surah: surahNumber, ayah: ayahNumber, translations: translations.join(',') },
  });
}

export async function fetchTranslations(language) {
  return apiClient.get('/quran/translations', {
    params: language ? { language } : {},
  });
}

export async function fetchReciters() {
  return apiClient.get('/quran/reciters');
}

export async function fetchSearch(q, { edition = 'en.sahih', surah = 'all', page = 1, limit = 20 } = {}) {
  return apiClient.get('/quran/search', {
    params: { q, edition, surah, page, limit },
  });
}

export async function fetchCitation(surahNumber, fromAyah, toAyah, translations = ['en.sahih']) {
  return apiClient.get('/quran/citation', {
    params: {
      surah: surahNumber,
      from: fromAyah,
      to: toAyah,
      translations: translations.join(','),
    },
  });
}

/**
 * Resolves an audio URL for an ayah given a reciter template.
 * Template format: https://everyayah.com/data/{reciterId}/{surah3}{ayah3}.mp3
 */
export function resolveAudioUrl(template, surahNumber, ayahNumber) {
  const surah3 = String(surahNumber).padStart(3, '0');
  const ayah3  = String(ayahNumber).padStart(3, '0');
  return template.replace('{surah3}', surah3).replace('{ayah3}', ayah3);
}

/**
 * Persist/load reader settings in localStorage.
 */
const SETTINGS_KEY = 'quran_reader_settings';

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

const RESUME_KEY = 'quran_last_read';

export function loadLastRead() {
  try {
    return JSON.parse(localStorage.getItem(RESUME_KEY)) || null;
  } catch {
    return null;
  }
}

export function saveLastRead(surahNumber, ayahNumber) {
  localStorage.setItem(RESUME_KEY, JSON.stringify({ surah: surahNumber, ayah: ayahNumber }));
}

export async function fetchWordByWord(surahNumber) {
  return apiClient.get(`/quran/surahs/${surahNumber}/words`);
}

export async function fetchTafsir(surahNumber, ayahNumber, edition = 'en.kathir') {
  return apiClient.get('/quran/tafsir', {
    params: { surah: surahNumber, ayah: ayahNumber, edition },
  });
}

export async function fetchTafsirs() {
  return apiClient.get('/quran/tafsirs');
}

export async function fetchMushafPage(pageNumber, translations = ['en.sahih']) {
  return apiClient.get(`/quran/pages/${pageNumber}`, {
    params: { translations: translations.join(',') },
  });
}
