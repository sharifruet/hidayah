import apiClient from '../api';

export interface HadithCollection {
  slug: string;
  name: string;
  total_hadiths: number;
  total_books: number;
}

export interface HadithBook {
  book_number: number;
  name: string;
  hadithnumber_first: number;
  hadithnumber_last: number;
}

export interface HadithTranslation {
  edition: string;
  language: string;
  name: string;
  text: string;
}

export interface Hadith {
  hadithnumber: number;
  in_book_number: number;
  arabic_number: number | null;
  book_number: number;
  text_ar: string;
  grades: { name: string; grade: string }[];
  translations: HadithTranslation[];
}

export interface BookWithHadiths {
  collection: HadithCollection;
  book: HadithBook;
  hadiths: Hadith[];
}

export interface HadithSearchMatch {
  collection_slug: string;
  collection_name: string;
  book_number: number;
  hadithnumber: number;
  text: string;
}

export interface HadithSearchResponse {
  q: string;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  matches: HadithSearchMatch[];
}

/** Translation language served for an app language — only Bangla and English are seeded. */
export function hadithLanguageFor(appLanguage: string): 'bn' | 'en' {
  return appLanguage === 'bn' ? 'bn' : 'en';
}

/** Edition identifier for a collection in the given app language, e.g. "ben-bukhari" / "eng-bukhari". */
export function editionFor(slug: string, appLanguage: string): string {
  return `${hadithLanguageFor(appLanguage) === 'bn' ? 'ben' : 'eng'}-${slug}`;
}

export const hadithService = {
  listCollections: () => apiClient.get<{ data: HadithCollection[] }, { data: HadithCollection[] }>('/hadith/collections'),
  listBooks: (slug: string) => apiClient.get<{ data: HadithBook[] }, { data: HadithBook[] }>(`/hadith/collections/${slug}/books`),
  getBookWithHadiths: (slug: string, bookNumber: number, translations?: string[]) =>
    apiClient.get<{ data: BookWithHadiths }, { data: BookWithHadiths }>(`/hadith/collections/${slug}/books/${bookNumber}`, {
      params: translations?.length ? { translations: translations.join(',') } : {},
    }),
  getHadith: (slug: string, number: number, translations?: string[]) =>
    apiClient.get<{ data: Hadith & { collection: HadithCollection } }, { data: Hadith & { collection: HadithCollection } }>(
      '/hadith/hadith',
      { params: { collection: slug, number, ...(translations?.length ? { translations: translations.join(',') } : {}) } }
    ),
  search: (q: string, opts: { language?: 'bn' | 'en'; collection?: string; page?: number; limit?: number } = {}) =>
    apiClient.get<{ data: HadithSearchResponse }, { data: HadithSearchResponse }>('/hadith/search', {
      params: {
        q,
        language: opts.language ?? 'en',
        collection: opts.collection ?? 'all',
        page: opts.page ?? 1,
        limit: opts.limit ?? 20,
      },
    }),
};
