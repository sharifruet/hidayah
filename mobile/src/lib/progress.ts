import { getJSON, setJSON, storage } from './storage';

const KEY_PROGRESS = 'quran_khatm';
const KEY_STREAK = 'quran_streak';

interface KhatmData {
  readSurahs: number[];
}

interface StreakData {
  streak: number;
  lastDate: string | null;
}

function loadProgress(): KhatmData {
  return getJSON<KhatmData>(KEY_PROGRESS, { readSurahs: [] });
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  return new Date(Date.now() - 864e5).toISOString().slice(0, 10);
}

function loadStreak(): StreakData {
  return getJSON<StreakData>(KEY_STREAK, { streak: 0, lastDate: null });
}

function touchStreak(): void {
  const today = todayStr();
  const data = loadStreak();
  if (data.lastDate === today) return;
  if (data.lastDate === yesterdayStr()) {
    data.streak += 1;
  } else {
    data.streak = 1;
  }
  data.lastDate = today;
  setJSON(KEY_STREAK, data);
}

export function getReadSurahs(): Set<number> {
  return new Set(loadProgress().readSurahs);
}

export function markSurahRead(surahNumber: number): void {
  const data = loadProgress();
  const set = new Set(data.readSurahs);
  set.add(surahNumber);
  data.readSurahs = [...set];
  setJSON(KEY_PROGRESS, data);
  touchStreak();
}

export function unmarkSurahRead(surahNumber: number): void {
  const data = loadProgress();
  data.readSurahs = data.readSurahs.filter((n) => n !== surahNumber);
  setJSON(KEY_PROGRESS, data);
}

export function resetKhatm(): void {
  storage.remove(KEY_PROGRESS);
}

export function getKhatmPercent(): number {
  return Math.round((getReadSurahs().size / 114) * 100);
}

export function getStreak(): number {
  const data = loadStreak();
  const today = todayStr();
  const yesterday = yesterdayStr();
  if (data.lastDate !== today && data.lastDate !== yesterday) return 0;
  return data.streak || 0;
}

export function recordReadingToday(): void {
  touchStreak();
}

const RESUME_KEY = 'quran_last_read';

export interface LastRead {
  surah: number;
  ayah: number;
}

export function loadLastRead(): LastRead | null {
  return getJSON<LastRead | null>(RESUME_KEY, null);
}

export function saveLastRead(surahNumber: number, ayahNumber: number): void {
  setJSON(RESUME_KEY, { surah: surahNumber, ayah: ayahNumber });
}

const SETTINGS_KEY = 'quran_reader_settings';

export function loadReaderSettings<T>(): Partial<T> {
  return getJSON<Partial<T>>(SETTINGS_KEY, {} as Partial<T>);
}

export function saveReaderSettings<T>(settings: T): void {
  setJSON(SETTINGS_KEY, settings);
}
