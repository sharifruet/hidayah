import { getJSON, setJSON } from './storage';

const KEY = 'qada_counts';

export type QadaCounts = Record<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', number>;

function empty(): QadaCounts {
  return { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
}

export function getQadaCounts(): QadaCounts {
  return { ...empty(), ...getJSON<Partial<QadaCounts>>(KEY, {}) };
}

export function incrementQada(prayer: keyof QadaCounts): QadaCounts {
  const counts = getQadaCounts();
  counts[prayer] += 1;
  setJSON(KEY, counts);
  return counts;
}

export function decrementQada(prayer: keyof QadaCounts): QadaCounts {
  const counts = getQadaCounts();
  counts[prayer] = Math.max(0, counts[prayer] - 1);
  setJSON(KEY, counts);
  return counts;
}

export function getTotalQada(): number {
  const counts = getQadaCounts();
  return counts.fajr + counts.dhuhr + counts.asr + counts.maghrib + counts.isha;
}
