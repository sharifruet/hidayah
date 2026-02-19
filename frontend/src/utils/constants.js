/**
 * Application constants
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// Bangladesh bounds
export const BANGLADESH_BOUNDS = {
  north: 26.638,
  south: 20.738,
  east: 92.673,
  west: 88.084,
  center: {
    lat: 23.685,
    lng: 90.3563
  }
};

// Default location (Dhaka)
export const DEFAULT_LOCATION = {
  lat: 23.8103,
  lng: 90.4125,
  name: 'Dhaka',
  district: 'Dhaka',
  division: 'Dhaka'
};

// Map configuration
export const MAP_CONFIG = {
  defaultZoom: 7,
  minZoom: 6,
  maxZoom: 18,
  center: [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]
};

// Prayer time labels
export const PRAYER_LABELS = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  sunset: 'Sunset',
  isha: 'Isha'
};

// Prayer time labels in Bengali
export const PRAYER_LABELS_BN = {
  fajr: 'ফজর',
  sunrise: 'সূর্যোদয়',
  dhuhr: 'যোহর',
  asr: 'আসর',
  maghrib: 'মাগরিব',
  sunset: 'সূর্যাস্ত',
  isha: 'ইশা'
};

// Date formats
export const DATE_FORMATS = {
  display: 'dd MMM yyyy',
  api: 'yyyy-MM-dd',
  monthYear: 'MMMM yyyy',
  year: 'yyyy'
};

// Calendar view types
export const CALENDAR_VIEWS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  DATE_RANGE: 'date-range'
};

// Export formats
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  CSV: 'csv',
  ICAL: 'ical',
  JSON: 'json'
};

// Default calculation method
export const DEFAULT_METHOD = 'karachi';

// Default Sehri margin (minutes)
export const DEFAULT_SEHRI_MARGIN = 10;

// Default sunset adjustment for Bangladesh/Dhaka (minutes)
// This adjusts sunset time to match local observations (29 minutes for Dhaka)
export const DEFAULT_SUNSET_ADJUSTMENT = 29;
