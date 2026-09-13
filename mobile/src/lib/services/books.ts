import apiClient from '../api';

export interface Book {
  slug: string;
  title: string;
  title_ar?: string;
  subtitle?: string;
  description?: string;
  language?: string;
  islamic_topics?: string[];
  author?: string;
  translator?: string;
  publisher?: string;
  published_year?: number;
  cover_url?: string;
  embed_url?: string;
  pdf_url?: string;
  content_type: 'text' | 'pdf' | 'epub';
  page_count?: number;
  license_class?: string;
}

export interface BookChapter {
  id: number;
  parent_id?: number | null;
  title: string;
  type: string;
  position: number;
  has_content?: boolean;
  content?: string;
  breadcrumb?: string[];
  children?: BookChapter[];
}

export interface BooksListResponse {
  books: Book[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export const booksService = {
  listBooks: (opts: { topic?: string; lang?: string; q?: string; page?: number; limit?: number } = {}) =>
    apiClient.get<BooksListResponse, BooksListResponse>('/books', { params: opts }),
  getBook: (slug: string) => apiClient.get<Book, Book>(`/books/${slug}`),
  listTopics: () => apiClient.get<string[], string[]>('/books/topics'),
  listChapters: (slug: string) => apiClient.get<BookChapter[], BookChapter[]>(`/books/${slug}/chapters`),
  getChapter: (slug: string, id: string) => apiClient.get<BookChapter, BookChapter>(`/books/${slug}/chapters/${id}`),
};
