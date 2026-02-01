import { useState, useEffect, useCallback } from 'react';
import { searchLocations, getLocationByCoordinates } from '../services/locationService.js';
import { validateBangladeshBounds } from '../utils/validators.js';

/**
 * Hook for location search and geolocation
 */
export function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Search for locations by query
   */
  const search = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setError('Search query is required');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchLocations(query.trim());
      return response.results || [];
    } catch (err) {
      setError(err.message || 'Failed to search locations');
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
      setError(validation.error);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const locationData = await getLocationByCoordinates(lat, lng);
      setLocation(locationData);
      return locationData;
    } catch (err) {
      setError(err.message || 'Failed to get location');
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
      setError('Geolocation is not supported by your browser');
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
            setError(error.message || 'Failed to get location data');
            setLoading(false);
            reject(error);
          }
        },
        (err) => {
          const errorMessage = err.message || 'Failed to get current location';
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
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
    error,
    search,
    getByCoordinates,
    getCurrentLocation,
    setLocation: setLocationManual
  };
}
