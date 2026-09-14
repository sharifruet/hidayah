import { Platform } from 'react-native';

function resolveApiBase(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('localhost')) return envUrl;
  // Simulators: iOS shares the host's localhost; Android emulator needs 10.0.2.2.
  if (Platform.OS === 'android') return envUrl?.replace('localhost', '10.0.2.2') ?? 'http://10.0.2.2:3000';
  return envUrl ?? 'http://localhost:3000';
}

export const API_BASE_URL = resolveApiBase();
// "none" means the deployed API isn't mounted under a version prefix (e.g. a reverse proxy
// that already rewrites /api/* -> the backend's root) — EAS's env-var schema rejects empty
// string values, so this sentinel is how build profiles express "no version segment".
const rawApiVersion = process.env.EXPO_PUBLIC_API_VERSION ?? 'v1';
export const API_VERSION = rawApiVersion === 'none' ? '' : rawApiVersion;

export const DEFAULT_LOCATION = {
  lat: 23.8103,
  lng: 90.4125,
  name: 'Dhaka',
  district: 'Dhaka',
  division: 'Dhaka',
};

export const DEFAULT_METHOD = 'karachi';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'sunset' | 'isha';

export const PRAYER_LABELS: Record<PrayerKey, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  sunset: 'Sunset',
  isha: 'Isha',
};

export const KAABA_COORDS = { lat: 21.4225, lng: 39.8262 };

export const SUPPORTED_LANGUAGES = ['en', 'bn', 'ur', 'tr', 'id'] as const;
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];
