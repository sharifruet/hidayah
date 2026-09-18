import apiClient from './api.js';

export const JAMAH_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumuah'];

/**
 * Masjids within `radiusKm` of a point, nearest first
 */
export function getNearbyMasjids(lat, lng, radiusKm = 5, limit = 20) {
  return apiClient.get('/masjids/nearby', {
    params: { lat, lng, radius_km: radiusKm, limit },
  });
}

/**
 * Search masjids by name/address; lat/lng (optional) adds distance + sorts by it
 */
export function searchMasjids(q, { lat, lng, limit = 20 } = {}) {
  return apiClient.get('/masjids', {
    params: { q, limit, ...(lat != null && lng != null && { lat, lng }) },
  });
}

/**
 * Single masjid with jamah times; lat/lng (optional) adds distance
 */
export function getMasjid(id, { lat, lng } = {}) {
  return apiClient.get(`/masjids/${id}`, {
    params: lat != null && lng != null ? { lat, lng } : {},
  });
}

/**
 * Community submission of a new masjid
 */
export function createMasjid(data) {
  return apiClient.post('/masjids', data);
}

/**
 * Set/update jamah times: { fajr: 'HH:MM', ... } — null/'' clears a prayer
 */
export function updateJamahTimes(id, times) {
  return apiClient.put(`/masjids/${id}/jamah`, times);
}
