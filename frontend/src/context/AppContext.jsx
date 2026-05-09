import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DEFAULT_LOCATION, DEFAULT_METHOD } from '../utils/constants.js';
import { RTL_LANGUAGES } from '../i18n/translations.js';
import { getLocationByCoordinates } from '../services/locationService.js';

const AppContext = createContext(null);

const SUPPORTED_LANGUAGES = ['en', 'bn', 'ur', 'tr', 'id'];

const LOCATION_KEY = 'app_location';

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
    return saved ?? {
      lat: DEFAULT_LOCATION.lat,
      lng: DEFAULT_LOCATION.lng,
      name: DEFAULT_LOCATION.name,
      district: DEFAULT_LOCATION.district,
      division: DEFAULT_LOCATION.division,
    };
  });

  const [method, setMethod]          = useState(DEFAULT_METHOD);
  const [language, setLanguageState] = useState(loadPersistedLanguage);
  const [darkMode, setDarkModeState]  = useState(loadPersistedDarkMode);

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
          updateLocation({
            lat: data.latitude,
            lng: data.longitude,
            name: data.name || DEFAULT_LOCATION.name,
            district: data.district || '',
            division: data.division || '',
          });
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

  const value = {
    location,
    method,
    language,
    isRTL,
    darkMode,
    updateLocation,
    updateMethod,
    setLanguage,
    toggleLanguage,
    toggleDarkMode,
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
