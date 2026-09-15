import { getJSON, setJSON, storage } from './storage';

export interface TasbihPreset {
  id: string;
  arabic: string;
  targetKey: string; // translation key for the transliteration/label
  target: number; // 0 = open-ended, no target
}

export const TASBIH_PRESETS: TasbihPreset[] = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', targetKey: 'tasbih_subhanallah', target: 33 },
  { id: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', targetKey: 'tasbih_alhamdulillah', target: 33 },
  { id: 'allahuakbar', arabic: 'اللَّهُ أَكْبَرُ', targetKey: 'tasbih_allahuakbar', target: 34 },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', targetKey: 'tasbih_astaghfirullah', target: 100 },
  { id: 'open', arabic: '', targetKey: 'tasbih_open_count', target: 0 },
];

const COUNTS_KEY = 'tasbih_counts';
const SELECTED_KEY = 'tasbih_selected';

type Counts = Record<string, number>;

function loadCounts(): Counts {
  return getJSON<Counts>(COUNTS_KEY, {});
}

export function getCount(presetId: string): number {
  return loadCounts()[presetId] ?? 0;
}

export function increment(presetId: string): number {
  const counts = loadCounts();
  counts[presetId] = (counts[presetId] ?? 0) + 1;
  setJSON(COUNTS_KEY, counts);
  return counts[presetId];
}

export function resetCount(presetId: string): void {
  const counts = loadCounts();
  counts[presetId] = 0;
  setJSON(COUNTS_KEY, counts);
}

export function getSelectedPreset(): string {
  return storage.getString(SELECTED_KEY) ?? TASBIH_PRESETS[0].id;
}

export function setSelectedPreset(presetId: string): void {
  storage.set(SELECTED_KEY, presetId);
}
