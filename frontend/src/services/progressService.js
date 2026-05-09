const KEY_PROGRESS = 'quran_khatm';
const KEY_STREAK   = 'quran_streak';

// ── Khatm progress ───────────────────────────────────────────────────────────

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(KEY_PROGRESS)) || { readSurahs: [] }; }
  catch { return { readSurahs: [] }; }
}

function saveProgress(data) {
  localStorage.setItem(KEY_PROGRESS, JSON.stringify(data));
}

export function getReadSurahs() {
  return new Set(loadProgress().readSurahs);
}

export function markSurahRead(surahNumber) {
  const data = loadProgress();
  const set  = new Set(data.readSurahs);
  set.add(surahNumber);
  data.readSurahs = [...set];
  saveProgress(data);
  touchStreak();
}

export function unmarkSurahRead(surahNumber) {
  const data = loadProgress();
  data.readSurahs = data.readSurahs.filter((n) => n !== surahNumber);
  saveProgress(data);
}

export function resetKhatm() {
  localStorage.removeItem(KEY_PROGRESS);
}

export function getKhatmPercent() {
  return Math.round((getReadSurahs().size / 114) * 100);
}

// ── Daily streak ─────────────────────────────────────────────────────────────

function loadStreak() {
  try { return JSON.parse(localStorage.getItem(KEY_STREAK)) || { streak: 0, lastDate: null }; }
  catch { return { streak: 0, lastDate: null }; }
}

function saveStreak(data) {
  localStorage.setItem(KEY_STREAK, JSON.stringify(data));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function touchStreak() {
  const today = todayStr();
  const data  = loadStreak();
  if (data.lastDate === today) return; // already counted today
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  if (data.lastDate === yesterday) {
    data.streak  += 1;
    data.lastDate = today;
  } else {
    data.streak   = 1;
    data.lastDate = today;
  }
  saveStreak(data);
}

export function getStreak() {
  const data = loadStreak();
  // If last read was not today or yesterday, streak is broken
  const today     = todayStr();
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  if (data.lastDate !== today && data.lastDate !== yesterday) {
    return 0;
  }
  return data.streak || 0;
}

export function recordReadingToday() {
  touchStreak();
}
