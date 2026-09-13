import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { I18nManager } from 'react-native';
import { useColorScheme as useNwColorScheme } from 'nativewind';
import * as Location from 'expo-location';

import { DEFAULT_LOCATION, DEFAULT_METHOD, SUPPORTED_LANGUAGES, type LanguageCode } from '../lib/constants';
import { getJSON, setJSON, storage } from '../lib/storage';
import { RTL_LANGUAGES } from '../data/translations';
import { reverseGeocode } from '../lib/geocoding';

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
  updateLocation: (next: Partial<AppLocation>) => void;
  updateMethod: (method: string) => void;
  setLanguage: (lang: LanguageCode) => void;
  toggleDarkMode: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  supportedLanguages: readonly LanguageCode[];
}

const AppContext = createContext<AppContextValue | null>(null);

const LOCATION_KEY = 'app_location';
const METHOD_KEY = 'app_method';
const LANGUAGE_KEY = 'app_language';
const DARK_MODE_KEY = 'app_dark_mode';
const NOTIFICATIONS_KEY = 'app_notifications_enabled';

export function AppProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useNwColorScheme();

  const [location, setLocation] = useState<AppLocation>(() =>
    getJSON<AppLocation>(LOCATION_KEY, {
      lat: DEFAULT_LOCATION.lat,
      lng: DEFAULT_LOCATION.lng,
      name: DEFAULT_LOCATION.name,
      district: DEFAULT_LOCATION.district,
      division: DEFAULT_LOCATION.division,
    })
  );
  const [hasSavedLocation] = useState(() => storage.contains(LOCATION_KEY));
  const [method, setMethod] = useState<string>(() => storage.getString(METHOD_KEY) ?? DEFAULT_METHOD);
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = storage.getString(LANGUAGE_KEY) as LanguageCode | undefined;
    return stored && SUPPORTED_LANGUAGES.includes(stored) ? stored : 'en';
  });
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const stored = storage.getString(DARK_MODE_KEY);
    return stored != null ? stored === 'true' : colorScheme === 'dark';
  });
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(
    () => storage.getString(NOTIFICATIONS_KEY) === 'true'
  );

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
        const place = await reverseGeocode(position.coords.latitude, position.coords.longitude);
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

  const value: AppContextValue = {
    location,
    method,
    language,
    isRTL,
    darkMode,
    notificationsEnabled,
    updateLocation,
    updateMethod,
    setLanguage,
    toggleDarkMode,
    setNotificationsEnabled,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
