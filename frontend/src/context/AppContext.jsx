import { createContext, useContext, useState, useCallback } from 'react';
import { DEFAULT_LOCATION, DEFAULT_METHOD, DEFAULT_SEHRI_MARGIN } from '../utils/constants.js';

const AppContext = createContext(null);

/**
 * App context provider
 */
export function AppProvider({ children }) {
  const [location, setLocation] = useState({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
    name: DEFAULT_LOCATION.name,
    district: DEFAULT_LOCATION.district,
    division: DEFAULT_LOCATION.division
  });

  const [method, setMethod] = useState(DEFAULT_METHOD);
  const [sehriMargin, setSehriMargin] = useState(DEFAULT_SEHRI_MARGIN);
  const [language, setLanguage] = useState('en'); // 'en' or 'bn'

  /**
   * Update location
   */
  const updateLocation = useCallback((newLocation) => {
    setLocation(prev => ({
      ...prev,
      ...newLocation
    }));
  }, []);

  /**
   * Update calculation method
   */
  const updateMethod = useCallback((newMethod) => {
    setMethod(newMethod);
  }, []);

  /**
   * Update Sehri margin
   */
  const updateSehriMargin = useCallback((margin) => {
    setSehriMargin(margin);
  }, []);

  /**
   * Toggle language
   */
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  }, []);

  const value = {
    location,
    method,
    sehriMargin,
    language,
    updateLocation,
    updateMethod,
    updateSehriMargin,
    toggleLanguage
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook to use app context
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
