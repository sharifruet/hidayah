import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DEFAULT_LOCATION, DEFAULT_METHOD } from '../utils/constants.js';
import { RTL_LANGUAGES } from '../i18n/translations.js';
import { getLocationByCoordinates } from '../services/locationService.js';
import { HIJRI_OFFSET_KEY, getHijriOffset } from '../utils/hijri.js';
import { TIME_FORMAT_KEY, getTimeFormat } from '../utils/format.js';
import { toAppLocation } from '../utils/place.js';

const AppContext = createContext(null);

const SUPPORTED_LANGUAGES = ['en', 'bn', 'ur', 'tr', 'id'];

const LOCATION_KEY = 'app_location';
const METHOD_KEY = 'app_method';
const MY_MASJID_KEY = 'app_my_masjid';

function loadMyMasjid() {
  try {
    return JSON.parse(localStorage.getItem(MY_MASJID_KEY)) || null;
  } catch {
    return null;
  }
}

function loadPersistedMethod() {
  try {
    const stored = localStorage.getItem(METHOD_KEY);
    if (stored) return stored;
  } catch {}
  return DEFAULT_METHOD;
}

function loadPersistedLanguage() {
  try {
    const stored = localStorage.getItem('app_language');
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;
  } catch {}
  return 'bn'; // Default to Bangla
}

function loadPersistedLocation() {
  try {
    const stored = JSON.parse(localStorage.getItem(LOCATION_KEY));
    if (stored?.lat && stored?.lng) return stored;
  } catch {}
  return null;
}

function loadPersistedDarkMode() {
  try {
    const stored = localStorage.getItem('app_dark_mode');
    if (stored !== null) return stored === 'true';
  } catch {}
  // Respect system preference as default
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function AppProvider({ children }) {
  const [location, setLocation] = useState(() => {
    const saved = loadPersistedLocation();
    return saved ?? { ...DEFAULT_LOCATION };
  });

  const [method, setMethod]          = useState(loadPersistedMethod);
  const [language, setLanguageState] = useState(loadPersistedLanguage);
  const [darkMode, setDarkModeState]  = useState(loadPersistedDarkMode);
  const [hijriOffset, setHijriOffsetState] = useState(getHijriOffset);
  const [myMasjid, setMyMasjidState] = useState(loadMyMasjid);
  const [timeFormat, setTimeFormatState] = useState(getTimeFormat);

  const isRTL = RTL_LANGUAGES.has(language);

  // Keep <html dir> and dark class in sync
  useEffect(() => {
    document.documentElement.dir  = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const updateLocation = useCallback((newLocation) => {
    setLocation((prev) => {
      const next = { ...prev, ...newLocation };
      try { localStorage.setItem(LOCATION_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // Auto-detect location on first launch (no saved location yet)
  useEffect(() => {
    if (loadPersistedLocation()) return; // already have a saved location
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getLocationByCoordinates(latitude, longitude);
          updateLocation({ ...toAppLocation(data), name: data.name || DEFAULT_LOCATION.name });
        } catch {
          // silently keep Dhaka default
        }
      },
      () => {
        // permission denied or unavailable — keep Dhaka default
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [updateLocation]);

  const updateMethod = useCallback((newMethod) => {
    setMethod(newMethod);
    try { localStorage.setItem(METHOD_KEY, newMethod); } catch {}
  }, []);

  /** Set UI language and persist the choice. */
  const setLanguage = useCallback((lang) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    setLanguageState(lang);
    try { localStorage.setItem('app_language', lang); } catch {}
  }, []);

  /** Legacy toggle kept for backward-compat (en ↔ bn). */
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  }, [language, setLanguage]);

  const toggleDarkMode = useCallback(() => {
    setDarkModeState((prev) => {
      const next = !prev;
      try { localStorage.setItem('app_dark_mode', String(next)); } catch {}
      return next;
    });
  }, []);

  /** Moon-sighting adjustment (-2…2 days) applied to every Hijri date. */
  const setHijriOffset = useCallback((days) => {
    const clamped = Math.max(-2, Math.min(2, Math.round(days)));
    setHijriOffsetState(clamped);
    try { localStorage.setItem(HIJRI_OFFSET_KEY, String(clamped)); } catch {}
  }, []);

  /** { id, name, name_bn, jamah } of the user's masjid, or null to clear. */
  const setMyMasjid = useCallback((masjid) => {
    setMyMasjidState(masjid);
    try {
      if (masjid) localStorage.setItem(MY_MASJID_KEY, JSON.stringify(masjid));
      else localStorage.removeItem(MY_MASJID_KEY);
    } catch {}
  }, []);

  /** '12h' (default) or '24h' for every displayed time. */
  const setTimeFormat = useCallback((format) => {
    setTimeFormatState(format);
    try { localStorage.setItem(TIME_FORMAT_KEY, format); } catch {}
  }, []);

  const value = {
    location,
    method,
    language,
    isRTL,
    darkMode,
    hijriOffset,
    myMasjid,
    timeFormat,
    updateLocation,
    updateMethod,
    setLanguage,
    toggleLanguage,
    toggleDarkMode,
    setHijriOffset,
    setMyMasjid,
    setTimeFormat,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

/**
 * Like `useApp`, but returns `{ language: 'en', timeFormat: '12h' }` defaults outside an
 * `AppProvider` instead of throwing — for leaf components (ErrorMessage, Loading) that are
 * also rendered standalone (tests, error boundaries).
 */
export function useAppLocale() {
  const context = useContext(AppContext);
  return {
    language: context?.language ?? 'en',
    timeFormat: context?.timeFormat ?? '12h',
  };
}
