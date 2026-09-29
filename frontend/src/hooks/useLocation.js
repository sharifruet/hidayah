import { useState, useCallback } from 'react';
import { searchLocations, getLocationByCoordinates } from '../services/locationService.js';
import { validateBangladeshBounds } from '../utils/validators.js';
import { useAppLocale } from '../context/AppContext.jsx';
import { tr } from '../i18n/translations.js';

/**
 * Hook for location search and geolocation. `error` is a localized, user-facing message
 * (the hook stores a translation key so it follows language changes).
 */
export function useLocation() {
  const { language } = useAppLocale();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Search for locations by query
   */
  const search = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchLocations(query.trim());
      return response.results || [];
    } catch {
      setError('pr_loc_search_failed');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get location by coordinates
   */
  const getByCoordinates = useCallback(async (lat, lng) => {
    const validation = validateBangladeshBounds(lat, lng);
    if (!validation.valid) {
      setError('pr_loc_outside_bd');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const locationData = await getLocationByCoordinates(lat, lng);
      setLocation(locationData);
      return locationData;
    } catch {
      setError('pr_loc_lookup_failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get current location using browser geolocation
   */
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('pr_geo_unsupported');
      return Promise.reject(new Error('Geolocation not supported'));
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const locationData = await getByCoordinates(latitude, longitude);
            resolve(locationData);
          } catch (error) {
            setError('pr_loc_lookup_failed');
            setLoading(false);
            reject(error);
          }
        },
        (err) => {
          setError('pr_geo_failed');
          setLoading(false);
          reject(new Error(err.message || 'Failed to get current location'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, [getByCoordinates]);

  /**
   * Set location manually
   */
  const setLocationManual = useCallback((locationData) => {
    setLocation(locationData);
    setError(null);
  }, []);

  return {
    location,
    loading,
    error: error ? tr(error, language) : null,
    search,
    getByCoordinates,
    getCurrentLocation,
    setLocation: setLocationManual
  };
}
