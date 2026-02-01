import apiClient from './api.js';

/**
 * Search for locations
 */
export async function searchLocations(query, limit = 10, district = null, division = null) {
  const params = {
    query: query,
    limit: limit,
    ...(district && { district }),
    ...(division && { division })
  };

  return apiClient.get('/locations/search', { params });
}

/**
 * Get location by coordinates (reverse geocoding)
 * This uses the prayer times endpoint to get location info
 */
export async function getLocationByCoordinates(lat, lng) {
  try {
    // Use prayer times endpoint to get location info
    const response = await apiClient.get('/prayer-times', {
      params: {
        latitude: lat,
        longitude: lng,
        date: new Date().toISOString().split('T')[0]
      }
    });

    return {
      latitude: lat,
      longitude: lng,
      name: response.location?.name || null,
      name_bengali: response.location?.name_bengali || null,
      district: response.location?.district || null,
      division: response.location?.division || null,
      timezone: response.location?.timezone || '+06:00'
    };
  } catch (error) {
    // Return coordinates even if location name not found
    return {
      latitude: lat,
      longitude: lng,
      name: null,
      district: null,
      division: null,
      timezone: '+06:00'
    };
  }
}

/**
 * Get available calculation methods
 */
export async function getMethods() {
  return apiClient.get('/methods');
}
