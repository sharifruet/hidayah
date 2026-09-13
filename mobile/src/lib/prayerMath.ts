import { PrayerTimesResponse } from './services/prayer';

/**
 * Device's current local UTC offset as "+HH:MM" / "-HH:MM".
 * The backend has no coordinate->timezone lookup and defaults to Bangladesh (+06:00)
 * when no `timezone` param is sent, so every prayer-times/calendar call must pass this.
 */
export function getDeviceTimezoneOffset(date: Date = new Date()): string {
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
}

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface CurrentPrayerInfo {
  current: PrayerName;
  next: PrayerName;
  nextTime: string;
  nextTimeMinutes: number;
}

const ORDER: { name: PrayerName; key: keyof PrayerTimesResponse['times'] }[] = [
  { name: 'fajr', key: 'fajr' },
  { name: 'sunrise', key: 'sunrise' },
  { name: 'dhuhr', key: 'dhuhr' },
  { name: 'asr', key: 'asr' },
  { name: 'maghrib', key: 'maghrib' },
  { name: 'isha', key: 'isha' },
];

function parseTime(timeStr?: string): number {
  if (!timeStr) return Infinity;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getCurrentPrayer(
  times: PrayerTimesResponse['times'] | undefined,
  currentTime: Date = new Date()
): CurrentPrayerInfo | null {
  if (!times) return null;
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  let current: PrayerName | null = null;
  let next: { name: PrayerName; time: string; timeMinutes: number } | null = null;

  for (let i = 0; i < ORDER.length; i++) {
    const prayerTime = parseTime(times[ORDER[i].key]);
    if (currentMinutes < prayerTime && !next) {
      next = { name: ORDER[i].name, time: times[ORDER[i].key], timeMinutes: prayerTime };
      current = i > 0 ? ORDER[i - 1].name : 'isha';
      break;
    }
  }

  if (!next) {
    current = 'isha';
    next = { name: 'fajr', time: times.fajr, timeMinutes: parseTime(times.fajr) + 24 * 60 };
  }

  return { current: current!, next: next.name, nextTime: next.time, nextTimeMinutes: next.timeMinutes };
}

export function getTimeUntilNextPrayer(
  times: PrayerTimesResponse['times'] | undefined,
  currentTime: Date = new Date()
): number | null {
  const info = getCurrentPrayer(times, currentTime);
  if (!info) return null;
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  let minutesUntil = info.nextTimeMinutes - currentMinutes;
  if (minutesUntil < 0) minutesUntil += 24 * 60;
  return minutesUntil;
}

/** Fraction (0-1) of the current prayer window that has elapsed, for a progress ring. */
export function getWindowProgress(
  times: PrayerTimesResponse['times'] | undefined,
  currentTime: Date = new Date()
): number {
  const info = getCurrentPrayer(times, currentTime);
  if (!info || !times) return 0;
  const currentKey = ORDER.find((o) => o.name === info.current)?.key;
  let startMinutes = currentKey ? parseTime(times[currentKey]) : 0;
  let endMinutes = info.nextTimeMinutes;
  if (endMinutes <= startMinutes) endMinutes += 24 * 60;
  if (info.current === 'isha' && startMinutes > info.nextTimeMinutes) {
    // Isha window wraps past midnight into tomorrow's Fajr.
    startMinutes -= 24 * 60;
  }
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const total = endMinutes - startMinutes;
  const elapsed = currentMinutes - startMinutes;
  if (total <= 0) return 0;
  return Math.min(Math.max(elapsed / total, 0), 1);
}

export function formatCountdown(minutes: number | null): string {
  if (minutes == null) return '--:--';
  if (minutes < 0) return '00:00';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/** Bearing in degrees (0-360, clockwise from true north) from a point to the Kaaba. */
export function qiblaBearing(lat: number, lng: number, kaabaLat: number, kaabaLng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const phiK = toRad(kaabaLat);
  const lambdaK = toRad(kaabaLng);
  const phi = toRad(lat);
  const lambda = toRad(lng);
  const psi =
    toDeg(
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
      )
    );
  return (psi + 360) % 360;
}
