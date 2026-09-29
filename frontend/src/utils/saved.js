/**
 * Browser-local favourites beyond Qur'an bookmarks (see services/bookmarkService.js):
 * favourite du'as, bookmarked hadith, and the last reading position in each book.
 * Mirrors `mobile/src/lib/saved.ts` (same shapes; storage differs).
 */
const DUAS_KEY = 'fav_duas';
const HADITH_KEY = 'hadith_bookmarks';
const BOOK_POS_KEY = 'book_positions';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked — favourites are a convenience, not critical
  }
}

// ── Du'as ────────────────────────────────────────────────────────────────────

export function getFavouriteDuaIds() {
  return read(DUAS_KEY, []);
}

/** Toggles a du'a by its stable id and returns the new list. */
export function toggleFavouriteDua(id) {
  const list = getFavouriteDuaIds();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [id, ...list];
  write(DUAS_KEY, next);
  return next;
}

// ── Hadith ───────────────────────────────────────────────────────────────────
// { id, slug, collectionName, bookNumber, bookName, hadithnumber, displayNumber, preview, createdAt }

const hadithId = (slug, hadithnumber) => `${slug}:${hadithnumber}`;

export function getHadithBookmarks() {
  return read(HADITH_KEY, []);
}

export function isHadithBookmarked(slug, hadithnumber) {
  const id = hadithId(slug, hadithnumber);
  return getHadithBookmarks().some((b) => b.id === id);
}

/** Adds or removes a hadith bookmark; returns true if it is now saved. */
export function toggleHadithBookmark(input) {
  const id = hadithId(input.slug, input.hadithnumber);
  const list = getHadithBookmarks();
  if (list.some((b) => b.id === id)) {
    write(HADITH_KEY, list.filter((b) => b.id !== id));
    return false;
  }
  write(HADITH_KEY, [{ ...input, id, preview: String(input.preview ?? '').slice(0, 240), createdAt: Date.now() }, ...list]);
  return true;
}

export function removeHadithBookmark(id) {
  write(HADITH_KEY, getHadithBookmarks().filter((b) => b.id !== id));
}

// ── Books ────────────────────────────────────────────────────────────────────
// { chapterId?, chapterTitle?, page?, updatedAt }

export function getBookPosition(slug) {
  return read(BOOK_POS_KEY, {})[slug] ?? null;
}

export function saveBookPosition(slug, pos) {
  const all = read(BOOK_POS_KEY, {});
  all[slug] = { ...all[slug], ...pos, updatedAt: Date.now() };
  write(BOOK_POS_KEY, all);
}
