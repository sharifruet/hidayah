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

/** Default English-translation edition identifier for a collection, e.g. "eng-bukhari". */
export function defaultEdition(slug: string): string {
  return `eng-${slug}`;
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
  search: (q: string, opts: { collection?: string; page?: number; limit?: number } = {}) =>
    apiClient.get<{ data: HadithSearchResponse }, { data: HadithSearchResponse }>('/hadith/search', {
      params: { q, collection: opts.collection ?? 'all', page: opts.page ?? 1, limit: opts.limit ?? 20 },
    }),
};
