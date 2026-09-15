import { getJSON, setJSON } from './storage';
import type { PrayerKey } from './constants';

const KEY = 'salah_tracker_log';
const TRACKED: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export type DayStatus = Record<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', boolean>;

type Log = Record<string, Partial<DayStatus>>;

function emptyDay(): DayStatus {
  return { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
}

function loadLog(): Log {
  return getJSON<Log>(KEY, {});
}

function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getDayStatus(date: Date = new Date()): DayStatus {
  const log = loadLog();
  return { ...emptyDay(), ...(log[toISO(date)] ?? {}) };
}

export function setPrayerDone(prayer: keyof DayStatus, done: boolean, date: Date = new Date()): void {
  const log = loadLog();
  const key = toISO(date);
  log[key] = { ...emptyDay(), ...(log[key] ?? {}), [prayer]: done };
  setJSON(KEY, log);
}

export function togglePrayer(prayer: keyof DayStatus, date: Date = new Date()): boolean {
  const current = getDayStatus(date)[prayer];
  setPrayerDone(prayer, !current, date);
  return !current;
}

/** Last N days of status, oldest first — for a week-at-a-glance grid. */
export function getRecentDays(days = 7): { date: string; status: DayStatus }[] {
  const out: { date: string; status: DayStatus }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({ date: toISO(d), status: getDayStatus(d) });
  }
  return out;
}

/** Consecutive days (ending today or yesterday) with all 5 prayers logged. */
export function getCompletionStreak(): number {
  let streak = 0;
  const d = new Date();
  // If today isn't complete yet, start counting from yesterday so an in-progress day
  // doesn't zero out an otherwise-intact streak.
  if (!isDayComplete(getDayStatus(d))) d.setDate(d.getDate() - 1);
  while (isDayComplete(getDayStatus(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function isDayComplete(status: DayStatus): boolean {
  return TRACKED.every((p) => status[p as keyof DayStatus]);
}

export { TRACKED as TRACKED_PRAYERS };
