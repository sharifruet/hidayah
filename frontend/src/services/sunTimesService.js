import apiClient from './api.js';

/**
 * Get sun times (sunrise, sunset, day length)
 */
export async function getSunTimes(lat, lng, date, options = {}) {
  const params = {
    latitude: lat,
    longitude: lng,
    date: date,
    ...options
  };

  return apiClient.get('/sun-times', { params });
}
