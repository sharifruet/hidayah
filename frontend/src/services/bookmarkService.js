const KEY = 'quran_bookmarks';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}

function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getBookmarks() { return load(); }

export function addBookmark({ surah, ayah, surahName, text_ar, translationText }) {
  const list = load();
  if (list.find((b) => b.surah === surah && b.ayah === ayah)) return; // already exists
  list.unshift({ id: `${surah}:${ayah}`, surah, ayah, surahName, text_ar, translationText, note: '', createdAt: Date.now() });
  save(list);
}

export function removeBookmark(surah, ayah) {
  save(load().filter((b) => !(b.surah === surah && b.ayah === ayah)));
}

export function isBookmarked(surah, ayah) {
  return load().some((b) => b.surah === surah && b.ayah === ayah);
}

export function updateNote(surah, ayah, note) {
  const list = load();
  const item = list.find((b) => b.surah === surah && b.ayah === ayah);
  if (item) { item.note = note; save(list); }
}

export function clearBookmarks() { localStorage.removeItem(KEY); }
