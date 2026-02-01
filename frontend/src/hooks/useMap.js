import { useState, useCallback } from 'react';
import { validateBangladeshBounds } from '../utils/validators.js';
import { BANGLADESH_BOUNDS } from '../utils/constants.js';

/**
 * Hook for map interactions
 */
export function useMap(initialCenter = null) {
  const [center, setCenter] = useState(initialCenter || [BANGLADESH_BOUNDS.center.lat, BANGLADESH_BOUNDS.center.lng]);
  const [zoom, setZoom] = useState(7);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  /**
   * Handle map click
   */
  const handleMapClick = useCallback((e) => {
    const { lat, lng } = e.latlng;

    // Validate coordinates
    const validation = validateBangladeshBounds(lat, lng);
    if (!validation.valid) {
      console.warn('Coordinates outside Bangladesh bounds:', validation.error);
      return;
    }

    setSelectedCoordinates({ lat, lng });
    setCenter([lat, lng]);
  }, []);

  /**
   * Set coordinates programmatically
   */
  const setCoordinates = useCallback((lat, lng) => {
    const validation = validateBangladeshBounds(lat, lng);
    if (!validation.valid) {
      console.warn('Invalid coordinates:', validation.error);
      return;
    }

    setSelectedCoordinates({ lat, lng });
    setCenter([lat, lng]);
  }, []);

  /**
   * Get map bounds for Bangladesh
   */
  const getBounds = useCallback(() => {
    return [
      [BANGLADESH_BOUNDS.south, BANGLADESH_BOUNDS.west],
      [BANGLADESH_BOUNDS.north, BANGLADESH_BOUNDS.east]
    ];
  }, []);

  return {
    center,
    zoom,
    selectedCoordinates,
    handleMapClick,
    setCoordinates,
    setZoom,
    getBounds
  };
}
