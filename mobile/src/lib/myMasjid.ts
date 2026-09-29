/**
 * The user's "my masjid": a local copy of one masjid's jamah times, so jamah reminders
 * and the home card work offline and from the background task. Refreshed whenever the
 * masjid is fetched (detail screen, app start).
 */
import { getJSON, setJSON, storage } from './storage';
import { masjidsService, type JamahTimes, type Masjid } from './services/masjids';

export const MY_MASJID_KEY = 'app_my_masjid';

export interface MyMasjid {
  id: number;
  name: string;
  name_bn?: string | null;
  jamah: JamahTimes;
  savedAt: string;
}

export function readMyMasjid(): MyMasjid | null {
  return getJSON<MyMasjid | null>(MY_MASJID_KEY, null);
}

export function writeMyMasjid(m: MyMasjid | null): void {
  if (m) setJSON(MY_MASJID_KEY, m);
  else storage.remove(MY_MASJID_KEY);
}

export function toMyMasjid(m: Masjid): MyMasjid {
  return { id: m.id, name: m.name, name_bn: m.name_bn, jamah: m.jamah ?? {}, savedAt: new Date().toISOString() };
}

/** Re-fetch the saved masjid's jamah times; returns the fresh copy, or null if unchanged/offline. */
export async function refreshMyMasjid(): Promise<MyMasjid | null> {
  const current = readMyMasjid();
  if (!current) return null;
  try {
    const fresh = toMyMasjid(await masjidsService.get(current.id));
    writeMyMasjid(fresh);
    return fresh;
  } catch {
    return null;
  }
}

export function myMasjidName(m: Pick<MyMasjid, 'name' | 'name_bn'>, language: string): string {
  return language === 'bn' && m.name_bn ? m.name_bn : m.name;
}
