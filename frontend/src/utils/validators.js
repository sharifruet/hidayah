/**
 * Validation utilities
 */

/**
 * Validate latitude
 */
export function validateLatitude(lat) {
  if (typeof lat !== 'number' || isNaN(lat)) {
    return { valid: false, error: 'Latitude must be a number' };
  }
  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }
  return { valid: true };
}

/**
 * Validate longitude
 */
export function validateLongitude(lng) {
  if (typeof lng !== 'number' || isNaN(lng)) {
    return { valid: false, error: 'Longitude must be a number' };
  }
  if (lng < -180 || lng > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }
  return { valid: true };
}

/**
 * Validate coordinates
 */
export function validateCoordinates(lat, lng) {
  const latValidation = validateLatitude(lat);
  if (!latValidation.valid) {
    return latValidation;
  }

  const lngValidation = validateLongitude(lng);
  if (!lngValidation.valid) {
    return lngValidation;
  }

  return { valid: true };
}

/**
 * Validate Bangladesh bounds
 */
export function validateBangladeshBounds(lat, lng) {
  const coordValidation = validateCoordinates(lat, lng);
  if (!coordValidation.valid) {
    return coordValidation;
  }

  const { north, south, east, west } = {
    north: 26.638,
    south: 20.738,
    east: 92.673,
    west: 88.084
  };

  if (lat < south || lat > north || lng < west || lng > east) {
    return {
      valid: false,
      error: 'Coordinates are outside Bangladesh bounds'
    };
  }

  return { valid: true };
}

/**
 * Validate date string (YYYY-MM-DD)
 */
export function validateDateString(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return { valid: false, error: 'Date is required' };
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateStr)) {
    return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }

  return { valid: true };
}

/**
 * Validate date range
 */
export function validateDateRange(startDate, endDate) {
  const startValidation = validateDateString(startDate);
  if (!startValidation.valid) {
    return startValidation;
  }

  const endValidation = validateDateString(endDate);
  if (!endValidation.valid) {
    return endValidation;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return { valid: false, error: 'Start date must be before end date' };
  }

  // Check max range (365 days)
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (daysDiff > 365) {
    return { valid: false, error: 'Date range cannot exceed 365 days' };
  }

  return { valid: true };
}
