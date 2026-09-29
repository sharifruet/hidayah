import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { I18nManager } from 'react-native';
import { useColorScheme as useNwColorScheme } from 'nativewind';
import * as Location from 'expo-location';

import { DEFAULT_LOCATION, DEFAULT_METHOD, SUPPORTED_LANGUAGES, type LanguageCode } from '../lib/constants';
import { getJSON, setJSON, storage } from '../lib/storage';
import { RTL_LANGUAGES } from '../data/translations';
import { reverseGeocode } from '../lib/geocoding';
import { nearestUpazila, relabelLocation, upazilaLabels } from '../lib/upazilas';
import { HIJRI_OFFSET_KEY, getHijriOffset } from '../lib/hijri';
import { readMyMasjid, writeMyMasjid, type MyMasjid } from '../lib/myMasjid';
import { TIME_FORMAT_KEY, getTimeFormat, type TimeFormat } from '../lib/format';

export type AdhanSound = 'makkah' | 'system';

interface AppLocation {
  lat: number;
  lng: number;
  name: string;
  district?: string;
  division?: string;
}

interface AppContextValue {
  location: AppLocation;
  method: string;
  language: LanguageCode;
  isRTL: boolean;
  darkMode: boolean;
  notificationsEnabled: boolean;
  prayerCheckInEnabled: boolean;
  ramadanRemindersEnabled: boolean;
  adhanSound: AdhanSound;
  fajrSoftAdhan: boolean;
  hijriOffset: number;
  islamicDayRemindersEnabled: boolean;
  sunnahFastRemindersEnabled: boolean;
  jamahRemindersEnabled: boolean;
  jamahLeadMinutes: number;
  jumuahReminderEnabled: boolean;
  myMasjid: MyMasjid | null;
  timeFormat: TimeFormat;
  updateLocation: (next: Partial<AppLocation>) => void;
  updateMethod: (method: string) => void;
  setLanguage: (lang: LanguageCode) => void;
  toggleDarkMode: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setPrayerCheckInEnabled: (enabled: boolean) => void;
  setRamadanRemindersEnabled: (enabled: boolean) => void;
  setAdhanSound: (sound: AdhanSound) => void;
  setFajrSoftAdhan: (enabled: boolean) => void;
  setHijriOffset: (days: number) => void;
  setIslamicDayRemindersEnabled: (enabled: boolean) => void;
  setSunnahFastRemindersEnabled: (enabled: boolean) => void;
  setJamahRemindersEnabled: (enabled: boolean) => void;
  setJamahLeadMinutes: (minutes: number) => void;
  setJumuahReminderEnabled: (enabled: boolean) => void;
  setMyMasjid: (masjid: MyMasjid | null) => void;
  setTimeFormat: (format: TimeFormat) => void;
  supportedLanguages: readonly LanguageCode[];
}

const AppContext = createContext<AppContextValue | null>(null);

// Exported so code that runs outside React (the background reminder task) can read settings.
export const LOCATION_KEY = 'app_location';
export const METHOD_KEY = 'app_method';
export const LANGUAGE_KEY = 'app_language';

function readLanguage(): LanguageCode {
  const stored = storage.getString(LANGUAGE_KEY) as LanguageCode | undefined;
  return stored && SUPPORTED_LANGUAGES.includes(stored) ? stored : 'bn';
}
const DARK_MODE_KEY = 'app_dark_mode';
export const NOTIFICATIONS_KEY = 'app_notifications_enabled';
export const CHECKIN_KEY = 'app_prayer_checkin_enabled';
export const RAMADAN_REMINDERS_KEY = 'app_ramadan_reminders_enabled';
export const ADHAN_SOUND_KEY = 'app_adhan_sound';
export const FAJR_SOFT_ADHAN_KEY = 'app_fajr_soft_adhan';
export const ISLAMIC_DAY_REMINDERS_KEY = 'app_islamic_day_reminders';
export const SUNNAH_FAST_REMINDERS_KEY = 'app_sunnah_fast_reminders';
export const JAMAH_REMINDERS_KEY = 'app_jamah_reminders';
export const JAMAH_LEAD_KEY = 'app_jamah_lead_minutes';
export const JUMUAH_REMINDER_KEY = 'app_jumuah_reminder';
export const DEFAULT_JAMAH_LEAD_MINUTES = 15;

/** A boolean setting persisted as 'true'/'false' in storage. */
function useStoredFlag(key: string, fallback = false): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => {
    const stored = storage.getString(key);
    return stored == null ? fallback : stored === 'true';
  });
  const set = useCallback(
    (v: boolean) => {
      setValue(v);
      storage.set(key, String(v));
    },
    [key]
  );
  return [value, set];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useNwColorScheme();

  const [location, setLocation] = useState<AppLocation>(() => {
    const loc = getJSON<AppLocation>(LOCATION_KEY, {
      lat: DEFAULT_LOCATION.lat,
      lng: DEFAULT_LOCATION.lng,
      name: DEFAULT_LOCATION.name,
      district: DEFAULT_LOCATION.district,
      division: DEFAULT_LOCATION.division,
    });
    // Label the built-in default (or a saved upazila) in the starting language.
    return relabelLocation(loc, readLanguage()) ?? loc;
  });
  const [hasSavedLocation] = useState(() => storage.contains(LOCATION_KEY));
  const [method, setMethod] = useState<string>(() => storage.getString(METHOD_KEY) ?? DEFAULT_METHOD);
  const [language, setLanguageState] = useState<LanguageCode>(readLanguage);
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const stored = storage.getString(DARK_MODE_KEY);
    return stored != null ? stored === 'true' : colorScheme === 'dark';
  });
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(
    () => storage.getString(NOTIFICATIONS_KEY) === 'true'
  );
  const [prayerCheckInEnabled, setPrayerCheckInEnabledState] = useState<boolean>(
    () => storage.getString(CHECKIN_KEY) === 'true'
  );
  const [ramadanRemindersEnabled, setRamadanRemindersEnabledState] = useState<boolean>(
    () => storage.getString(RAMADAN_REMINDERS_KEY) === 'true'
  );

  const [adhanSound, setAdhanSoundState] = useState<AdhanSound>(() =>
    storage.getString(ADHAN_SOUND_KEY) === 'system' ? 'system' : 'makkah'
  );
  const [fajrSoftAdhan, setFajrSoftAdhan] = useStoredFlag(FAJR_SOFT_ADHAN_KEY, true);
  const [hijriOffset, setHijriOffsetState] = useState<number>(getHijriOffset);
  const [islamicDayRemindersEnabled, setIslamicDayRemindersEnabled] = useStoredFlag(ISLAMIC_DAY_REMINDERS_KEY);
  const [sunnahFastRemindersEnabled, setSunnahFastRemindersEnabled] = useStoredFlag(SUNNAH_FAST_REMINDERS_KEY);
  const [jamahRemindersEnabled, setJamahRemindersEnabled] = useStoredFlag(JAMAH_REMINDERS_KEY);
  const [jumuahReminderEnabled, setJumuahReminderEnabled] = useStoredFlag(JUMUAH_REMINDER_KEY);
  const [jamahLeadMinutes, setJamahLeadState] = useState<number>(
    () => Number(storage.getString(JAMAH_LEAD_KEY)) || DEFAULT_JAMAH_LEAD_MINUTES
  );
  const [myMasjid, setMyMasjidState] = useState<MyMasjid | null>(readMyMasjid);
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>(getTimeFormat);

  const isRTL = RTL_LANGUAGES.has(language);

  useEffect(() => {
    setColorScheme(darkMode ? 'dark' : 'light');
  }, [darkMode, setColorScheme]);

  useEffect(() => {
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      // A full reload is required for RTL layout to take effect app-wide.
      // We don't auto-reload here; Settings screen prompts the user instead.
    }
  }, [isRTL]);

  useEffect(() => {
    if (hasSavedLocation) return;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { latitude, longitude } = position.coords;
        // Inside Bangladesh, name the spot after its upazila (more precise than the OS's city).
        const u = nearestUpazila(latitude, longitude);
        if (u) {
          const l = upazilaLabels(u, language);
          updateLocation({ lat: latitude, lng: longitude, name: l.name, district: l.district, division: l.division });
          return;
        }
        const place = await reverseGeocode(latitude, longitude, language);
        updateLocation({
          lat: place.lat,
          lng: place.lng,
          name: place.name,
          district: place.district ?? '',
          division: place.division ?? '',
        });
      } catch {
        // keep default location
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLocation = useCallback((next: Partial<AppLocation>) => {
    setLocation((prev) => {
      const merged = { ...prev, ...next };
      setJSON(LOCATION_KEY, merged);
      return merged;
    });
  }, []);

  const updateMethod = useCallback((next: string) => {
    setMethod(next);
    storage.set(METHOD_KEY, next);
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    setLanguageState(lang);
    storage.set(LANGUAGE_KEY, lang);
    // Saved upazila / default-city names follow the UI language.
    setLocation((prev) => {
      const relabeled = relabelLocation(prev, lang);
      if (!relabeled) return prev;
      // Don't persist the untouched default — that would skip GPS detection next launch.
      if (storage.contains(LOCATION_KEY)) setJSON(LOCATION_KEY, relabeled);
      return relabeled;
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkModeState((prev) => {
      const next = !prev;
      storage.set(DARK_MODE_KEY, String(next));
      return next;
    });
  }, []);

  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    storage.set(NOTIFICATIONS_KEY, String(enabled));
  }, []);

  const setPrayerCheckInEnabled = useCallback((enabled: boolean) => {
    setPrayerCheckInEnabledState(enabled);
    storage.set(CHECKIN_KEY, String(enabled));
  }, []);

  const setRamadanRemindersEnabled = useCallback((enabled: boolean) => {
    setRamadanRemindersEnabledState(enabled);
    storage.set(RAMADAN_REMINDERS_KEY, String(enabled));
  }, []);

  const setAdhanSound = useCallback((sound: AdhanSound) => {
    setAdhanSoundState(sound);
    storage.set(ADHAN_SOUND_KEY, sound);
  }, []);

  const setHijriOffset = useCallback((days: number) => {
    const clamped = Math.max(-2, Math.min(2, Math.round(days)));
    setHijriOffsetState(clamped);
    storage.set(HIJRI_OFFSET_KEY, String(clamped));
  }, []);

  const setJamahLeadMinutes = useCallback((minutes: number) => {
    setJamahLeadState(minutes);
    storage.set(JAMAH_LEAD_KEY, String(minutes));
  }, []);

  const setMyMasjid = useCallback((masjid: MyMasjid | null) => {
    writeMyMasjid(masjid);
    setMyMasjidState(masjid);
  }, []);

  const setTimeFormat = useCallback((format: TimeFormat) => {
    setTimeFormatState(format);
    storage.set(TIME_FORMAT_KEY, format);
  }, []);

  const value: AppContextValue = {
    location,
    method,
    language,
    isRTL,
    darkMode,
    notificationsEnabled,
    prayerCheckInEnabled,
    ramadanRemindersEnabled,
    adhanSound,
    fajrSoftAdhan,
    hijriOffset,
    islamicDayRemindersEnabled,
    sunnahFastRemindersEnabled,
    jamahRemindersEnabled,
    jamahLeadMinutes,
    jumuahReminderEnabled,
    myMasjid,
    timeFormat,
    updateLocation,
    updateMethod,
    setLanguage,
    toggleDarkMode,
    setNotificationsEnabled,
    setPrayerCheckInEnabled,
    setRamadanRemindersEnabled,
    setAdhanSound,
    setFajrSoftAdhan,
    setHijriOffset,
    setIslamicDayRemindersEnabled,
    setSunnahFastRemindersEnabled,
    setJamahRemindersEnabled,
    setJamahLeadMinutes,
    setJumuahReminderEnabled,
    setMyMasjid,
    setTimeFormat,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
