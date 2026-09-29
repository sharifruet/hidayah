/**
 * On-device favourites beyond Qur'an bookmarks (see `bookmarks.ts`): favourite du'as,
 * bookmarked hadith, and the last reading position in each book.
 */
import { getJSON, setJSON } from './storage';

const DUAS_KEY = 'fav_duas';
const HADITH_KEY = 'hadith_bookmarks';
const BOOK_POS_KEY = 'book_positions';

// ── Du'as ──────────────────────────────────────────────────────────────────────

export function getFavouriteDuaIds(): string[] {
  return getJSON<string[]>(DUAS_KEY, []);
}

/** Toggles a du'a (by its stable slug/id) and returns the new list. */
export function toggleFavouriteDua(id: string): string[] {
  const list = getFavouriteDuaIds();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [id, ...list];
  setJSON(DUAS_KEY, next);
  return next;
}

// ── Hadith ─────────────────────────────────────────────────────────────────────

export interface HadithBookmark {
  id: string;
  slug: string;
  collectionName: string;
  bookNumber: number;
  bookName: string;
  hadithnumber: number;
  /** In-book number shown to the user. */
  displayNumber: number;
  preview: string;
  createdAt: number;
}

const hadithId = (slug: string, hadithnumber: number) => `${slug}:${hadithnumber}`;

export function getHadithBookmarks(): HadithBookmark[] {
  return getJSON<HadithBookmark[]>(HADITH_KEY, []);
}

export function isHadithBookmarked(slug: string, hadithnumber: number): boolean {
  const id = hadithId(slug, hadithnumber);
  return getHadithBookmarks().some((b) => b.id === id);
}

export function toggleHadithBookmark(input: Omit<HadithBookmark, 'id' | 'createdAt'>): boolean {
  const id = hadithId(input.slug, input.hadithnumber);
  const list = getHadithBookmarks();
  if (list.some((b) => b.id === id)) {
    setJSON(HADITH_KEY, list.filter((b) => b.id !== id));
    return false;
  }
  setJSON(HADITH_KEY, [{ ...input, id, preview: input.preview.slice(0, 240), createdAt: Date.now() }, ...list]);
  return true;
}

export function removeHadithBookmark(id: string): void {
  setJSON(HADITH_KEY, getHadithBookmarks().filter((b) => b.id !== id));
}

// ── Books ──────────────────────────────────────────────────────────────────────

export interface BookPosition {
  /** Text books: the chapter being read. */
  chapterId?: number;
  chapterTitle?: string;
  /** PDF books: 1-based page. */
  page?: number;
  updatedAt: number;
}

export function getBookPosition(slug: string): BookPosition | null {
  return getJSON<Record<string, BookPosition>>(BOOK_POS_KEY, {})[slug] ?? null;
}

export function saveBookPosition(slug: string, pos: Omit<BookPosition, 'updatedAt'>): void {
  const all = getJSON<Record<string, BookPosition>>(BOOK_POS_KEY, {});
  all[slug] = { ...all[slug], ...pos, updatedAt: Date.now() };
  setJSON(BOOK_POS_KEY, all);
}
