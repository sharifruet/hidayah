import { getJSON, setJSON, storage } from './storage';

const KEY = 'quran_bookmarks';

export interface Bookmark {
  id: string;
  surah: number;
  ayah: number;
  surahName: string;
  text_ar: string;
  translationText: string;
  note: string;
  createdAt: number;
}

function load(): Bookmark[] {
  return getJSON<Bookmark[]>(KEY, []);
}

function save(list: Bookmark[]): void {
  setJSON(KEY, list);
}

export function getBookmarks(): Bookmark[] {
  return load();
}

export function addBookmark(input: Omit<Bookmark, 'id' | 'note' | 'createdAt'>): void {
  const list = load();
  if (list.find((b) => b.surah === input.surah && b.ayah === input.ayah)) return;
  list.unshift({ id: `${input.surah}:${input.ayah}`, ...input, note: '', createdAt: Date.now() });
  save(list);
}

export function removeBookmark(surah: number, ayah: number): void {
  save(load().filter((b) => !(b.surah === surah && b.ayah === ayah)));
}

export function isBookmarked(surah: number, ayah: number): boolean {
  return load().some((b) => b.surah === surah && b.ayah === ayah);
}

export function updateNote(surah: number, ayah: number, note: string): void {
  const list = load();
  const item = list.find((b) => b.surah === surah && b.ayah === ayah);
  if (item) {
    item.note = note;
    save(list);
  }
}

export function clearBookmarks(): void {
  storage.remove(KEY);
}
