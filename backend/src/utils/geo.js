/**
 * Geographic helpers for distance-based lookups (e.g. nearby masjids).
 */

const EARTH_RADIUS_KM = 6371;
const KM_PER_DEGREE_LAT = 111.32;

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Great-circle distance between two coordinates in kilometres.
 */
export function haversineKm(lat1, lng1, lat2, lng2) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * Axis-aligned bounding box that fully contains a circle of `radiusKm`
 * around a point — used as a cheap SQL prefilter before the exact
 * Haversine distance is computed.
 */
export function boundingBox(lat, lng, radiusKm) {
  const dLat = radiusKm / KM_PER_DEGREE_LAT;
  // Longitude degrees shrink towards the poles; guard against division by ~0.
  const cosLat = Math.max(Math.cos(toRadians(lat)), 0.01);
  const dLng = radiusKm / (KM_PER_DEGREE_LAT * cosLat);
  return {
    minLat: Math.max(-90, lat - dLat),
    maxLat: Math.min(90, lat + dLat),
    minLng: Math.max(-180, lng - dLng),
    maxLng: Math.min(180, lng + dLng),
  };
}
