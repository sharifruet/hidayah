/**
 * On-device prayer-time calculation — a port of the backend's
 * `backend/src/utils/calculations.js` + `backend/src/config/methods.js`, so prayer times,
 * the next-prayer countdown and reminders work with no network at all.
 *
 * Keep this in sync with the backend when changing formulas or method parameters.
 */
import type { PrayerTimesResponse } from './services/prayer';
import { getDeviceTimezoneOffset } from './prayerMath';
import { parseLocalISODate } from './dates';

type PrayerTimes = PrayerTimesResponse['times'];

interface MethodParams {
  fajr: number;
  /** Isha angle in degrees, or `null` for a fixed delay after Maghrib (`ishaMinutes`). */
  isha: number | null;
  ishaMinutes?: number;
  asr?: 'standard' | 'hanafi';
  /** Fixed-minute corrections some authorities publish on top of the angle calculation. */
  offsets?: { sunrise?: number; dhuhr?: number; asr?: number; maghrib?: number };
}

// Dhuhr and Maghrib are +1 minute after solar noon / sunset for every method.
const METHODS: Record<string, MethodParams> = {
  karachi: { fajr: 18, isha: 18 },
  mwl: { fajr: 18, isha: 17 },
  isna: { fajr: 15, isha: 15 },
  egyptian: { fajr: 19.5, isha: 17.5 },
  umm_al_qura: { fajr: 18.5, isha: null, ishaMinutes: 90 },
  singapore: { fajr: 20, isha: 18 },
  turkey: { fajr: 18, isha: 17, offsets: { sunrise: -7, dhuhr: 5, asr: 4, maghrib: 7 } },
  jakim: { fajr: 20, isha: 18 },
  france: { fajr: 12, isha: 12 },
  algeria: { fajr: 18, isha: 17 },
  tunisia: { fajr: 18, isha: 18 },
  indonesia: { fajr: 20, isha: 18 },
  russia: { fajr: 16, isha: 15 },
  jafri: { fajr: 16, isha: 14 },
  hanafi: { fajr: 18, isha: 18, asr: 'hanafi' },
  shafi: { fajr: 20, isha: 18 },
  maliki: { fajr: 18, isha: 17 },
  hanbali: { fajr: 18, isha: 17 },
  custom_angles: { fajr: 18, isha: 18 },
  custom_time: { fajr: 18, isha: null, ishaMinutes: 90 },
};

const DEG = Math.PI / 180;
const SUNSET_ANGLE = -0.833; // sun's radius + atmospheric refraction
const DAY_MINUTES = 24 * 60;

const wrap360 = (d: number) => ((d % 360) + 360) % 360;
function wrap180(d: number): number {
  let x = d % 360;
  if (x > 180) x -= 360;
  if (x <= -180) x += 360;
  return x;
}

/** Solar declination (degrees) and equation of time (minutes) — Astronomical Almanac approximation. */
function sunPosition(date: Date): { declination: number; eot: number } {
  const D =
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12) - Date.UTC(2000, 0, 1, 12)) / 86400000;
  const g = wrap360(357.529 + 0.98560028 * D);
  const q = wrap360(280.459 + 0.98564736 * D);
  const L = wrap360(q + 1.915 * Math.sin(g * DEG) + 0.02 * Math.sin(2 * g * DEG));
  const e = 23.439 - 0.00000036 * D;
  const declination = Math.asin(Math.sin(e * DEG) * Math.sin(L * DEG)) / DEG;
  const ra = wrap360(Math.atan2(Math.cos(e * DEG) * Math.sin(L * DEG), Math.cos(L * DEG)) / DEG);
  return { declination, eot: 4 * wrap180(q - ra) };
}

function hourAngle(lat: number, dec: number, altitude: number): number {
  const denom = Math.cos(lat * DEG) * Math.cos(dec * DEG);
  if (Math.abs(denom) < 1e-10) return 0;
  const ratio = (Math.sin(altitude * DEG) - Math.sin(lat * DEG) * Math.sin(dec * DEG)) / denom;
  if (ratio > 1) return 0;
  if (ratio < -1) return 180;
  return Math.acos(ratio) / DEG;
}

function fromNoon(noon: number, angle: number, before: boolean): number {
  const t = before ? noon - (angle / 15) * 60 : noon + (angle / 15) * 60;
  if (t < 0) return t + DAY_MINUTES;
  if (t >= DAY_MINUTES) return t - DAY_MINUTES;
  return t;
}

function asrAltitude(lat: number, dec: number, method: 'standard' | 'hanafi'): number {
  const shadow = method === 'hanafi' ? 2 : 1;
  return Math.atan(1 / (shadow + Math.tan(Math.abs(lat - dec) * DEG))) / DEG;
}

function toHHMM(minutes: number): string {
  const total = Math.round(((minutes % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES) % DAY_MINUTES;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** Offset in hours of the device's time zone on the given date (handles DST abroad). */
function offsetHours(date: Date): number {
  const [, sign, hh, mm] = getDeviceTimezoneOffset(date).match(/^([+-])(\d{2}):(\d{2})$/)!;
  return (sign === '-' ? -1 : 1) * (Number(hh) + Number(mm) / 60);
}

/** Prayer times ("HH:MM", device-local clock) for a local calendar date. */
export function calculatePrayerTimes(lat: number, lng: number, date: Date, method = 'karachi'): PrayerTimes {
  const m = METHODS[method] ?? METHODS.karachi;
  const off = { sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, ...m.offsets };
  const { declination, eot } = sunPosition(date);
  const noon = 12 * 60 - 4 * lng - eot + offsetHours(date) * 60;

  const sunHA = hourAngle(lat, declination, SUNSET_ANGLE);
  const sunset = fromNoon(noon, sunHA, false);
  const maghrib = sunset + 1 + off.maghrib;
  const isha =
    m.isha === null
      ? (maghrib + (m.ishaMinutes ?? 90)) % DAY_MINUTES
      : fromNoon(noon, hourAngle(lat, declination, -m.isha), false);

  return {
    fajr: toHHMM(fromNoon(noon, hourAngle(lat, declination, -m.fajr), true)),
    sunrise: toHHMM(fromNoon(noon, sunHA, true) + off.sunrise),
    dhuhr: toHHMM(noon + 1 + off.dhuhr),
    asr: toHHMM(fromNoon(noon, hourAngle(lat, declination, asrAltitude(lat, declination, m.asr ?? 'standard')), false) + off.asr),
    maghrib: toHHMM(maghrib),
    sunset: toHHMM(sunset),
    isha: toHHMM(isha),
  };
}

/** Same shape as the `/prayer-times` API response, computed on-device. */
export function localPrayerTimes(lat: number, lng: number, isoDate: string, method = 'karachi'): PrayerTimesResponse {
  const date = parseLocalISODate(isoDate);
  return {
    date: isoDate,
    location: { latitude: lat, longitude: lng, timezone: getDeviceTimezoneOffset(date) },
    coordinates: { latitude: lat, longitude: lng },
    method,
    times: calculatePrayerTimes(lat, lng, date, method),
    calculated_at: new Date().toISOString(),
  };
}
