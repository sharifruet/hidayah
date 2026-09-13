import apiClient from '../api';

export interface Surah {
  number: number;
  name_ar: string;
  name_en: string;
  name_en_trans: string;
  ayah_count: number;
  revelation_type: string;
}

export interface AyahTranslation {
  edition: string;
  name: string;
  author?: string;
  text: string;
}

export interface Ayah {
  number: number;
  number_global: number;
  text_ar: string;
  juz?: number;
  hizb?: number;
  page?: number;
  sajdah?: boolean;
  translations: AyahTranslation[];
}

export interface SurahAyahsResponse {
  meta: Record<string, unknown>;
  data: {
    surah: {
      number: number;
      name_ar: string;
      name_en: string;
      name_en_trans: string;
      revelation_type: string;
      ayah_count: number;
    };
    ayahs: Ayah[];
  };
}

export function findTranslation(ayah: Ayah, edition: string): string | undefined {
  return ayah.translations?.find((t) => t.edition === edition)?.text;
}

export async function fetchSurahs(): Promise<{ data: Surah[] }> {
  return apiClient.get('/quran/surahs');
}

export async function fetchSurah(surahNumber: number, translations = ['en.sahih']) {
  return apiClient.get(`/quran/surahs/${surahNumber}`, {
    params: { translations: translations.join(',') },
  });
}

export async function fetchSurahAyahs(
  surahNumber: number,
  opts: { from?: number; to?: number; limit?: number; translations?: string[] } = {}
): Promise<SurahAyahsResponse> {
  const { from, to, limit, translations = ['en.sahih'] } = opts;
  return apiClient.get(`/quran/surahs/${surahNumber}/ayahs`, {
    params: {
      translations: translations.join(','),
      ...(from != null && { from }),
      ...(to != null && { to }),
      ...(limit != null && { limit }),
    },
  });
}

export async function fetchAyah(surahNumber: number, ayahNumber: number, translations = ['en.sahih']) {
  return apiClient.get('/quran/ayah', {
    params: { surah: surahNumber, ayah: ayahNumber, translations: translations.join(',') },
  });
}

export async function fetchTranslations(language?: string) {
  return apiClient.get('/quran/translations', { params: language ? { language } : {} });
}

export interface Reciter {
  id: string;
  name: string;
  audio_url_template: string;
}

export async function fetchReciters(): Promise<{ data: Reciter[] }> {
  return apiClient.get('/quran/reciters');
}

export async function fetchSearch(
  q: string,
  opts: { edition?: string; surah?: string | number; page?: number; limit?: number } = {}
) {
  const { edition = 'en.sahih', surah = 'all', page = 1, limit = 20 } = opts;
  return apiClient.get('/quran/search', { params: { q, edition, surah, page, limit } });
}

export async function fetchCitation(surahNumber: number, fromAyah: number, toAyah: number, translations = ['en.sahih']) {
  return apiClient.get('/quran/citation', {
    params: { surah: surahNumber, from: fromAyah, to: toAyah, translations: translations.join(',') },
  });
}

export function resolveAudioUrl(template: string, surahNumber: number, ayahNumber: number): string {
  const surah3 = String(surahNumber).padStart(3, '0');
  const ayah3 = String(ayahNumber).padStart(3, '0');
  return template.replace('{surah3}', surah3).replace('{ayah3}', ayah3);
}

export async function fetchWordByWord(surahNumber: number) {
  return apiClient.get(`/quran/surahs/${surahNumber}/words`);
}

export async function fetchTafsir(surahNumber: number, ayahNumber: number, edition = 'en.kathir') {
  return apiClient.get('/quran/tafsir', { params: { surah: surahNumber, ayah: ayahNumber, edition } });
}

export async function fetchTafsirs() {
  return apiClient.get('/quran/tafsirs');
}

export async function fetchMushafPage(pageNumber: number, translations = ['en.sahih']) {
  return apiClient.get(`/quran/pages/${pageNumber}`, { params: { translations: translations.join(',') } });
}
