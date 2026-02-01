import { getPrayerTimesService } from './prayerTimesService.js';

/**
 * Batch calculate prayer times for multiple coordinates
 * @param {Array} coordinates - Array of {latitude, longitude} objects
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} method - Calculation method
 * @param {object} options - Additional calculation options
 */
export async function batchPrayerTimesService(coordinates, date, method = 'hanafi', options = {}) {
  // Process all coordinates in parallel
  const promises = coordinates.map(async (coord) => {
    try {
      const result = await getPrayerTimesService(
        coord.latitude,
        coord.longitude,
        date,
        method,
        options
      );

      // Format response to match technical document
      const response = {
        coordinates: {
          latitude: coord.latitude,
          longitude: coord.longitude
        },
        times: result.times
      };

      // Add location info if available
      if (result.location && (result.location.name || result.location.district || result.location.division)) {
        response.location = {};
        if (result.location.name) response.location.name = result.location.name;
        if (result.location.district) response.location.district = result.location.district;
        if (result.location.division) response.location.division = result.location.division;
      }

      return response;
    } catch (error) {
      // Return error for this coordinate but continue processing others
      return {
        coordinates: {
          latitude: coord.latitude,
          longitude: coord.longitude
        },
        error: {
          code: 'CALCULATION_ERROR',
          message: error.message || 'Failed to calculate prayer times for this coordinate'
        }
      };
    }
  });

  const resolved = await Promise.all(promises);
  return resolved;
}
