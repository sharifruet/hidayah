/**
 * Prayer times for the next few days at the *saved* location/method, read straight from
 * storage — for code that runs without React (reminders, background task, widgets).
 */
import { getJSON, storage } from './storage';
import { DEFAULT_LOCATION, DEFAULT_METHOD } from './constants';
import { addDays } from './dates';
import { calculatePrayerTimes } from './prayerCalc';
import type { PrayerTimesResponse } from './services/prayer';

export interface PrayerDay {
  date: Date;
  times: PrayerTimesResponse['times'];
}

// Duplicated from AppContext (which imports React) so headless code can stay lightweight.
const LOCATION_KEY = 'app_location';
const METHOD_KEY = 'app_method';

export function savedLocation(): { lat: number; lng: number; name: string } {
  return getJSON(LOCATION_KEY, { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng, name: DEFAULT_LOCATION.name });
}

export function upcomingPrayerDays(count: number, from: Date = new Date()): PrayerDay[] {
  const { lat, lng } = savedLocation();
  const method = storage.getString(METHOD_KEY) ?? DEFAULT_METHOD;
  return Array.from({ length: count }, (_, i) => {
    const date = addDays(from, i);
    return { date, times: calculatePrayerTimes(lat, lng, date, method) };
  });
}
