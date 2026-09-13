import apiClient from '../api';

export interface PrayerTimesResponse {
  date: string;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
    name?: string;
    name_bengali?: string;
    district?: string;
    division?: string;
  };
  coordinates: { latitude: number; longitude: number };
  method: string;
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    sunset: string;
    isha: string;
  };
  calculated_at: string;
}

export interface PrayerTimesOptions {
  fajr_angle?: number;
  isha_angle?: number;
  isha_time_adjustment?: number;
  asr_method?: string;
  dhuhr_adjustment?: number;
  maghrib_adjustment?: number;
  sunset_adjustment?: number;
  sunset_angle?: number;
  hijri_adjustment?: number;
  timezone?: string;
}

export async function getPrayerTimes(
  lat: number,
  lng: number,
  date: string,
  method = 'karachi',
  options: PrayerTimesOptions = {}
): Promise<PrayerTimesResponse> {
  return apiClient.get('/prayer-times', {
    params: { latitude: lat, longitude: lng, date, method, ...options },
  });
}

export interface CalendarDay {
  date: string;
  hijri?: { year: number; month: number; day: number };
  times: PrayerTimesResponse['times'];
}

export async function getMonthlyCalendar(
  lat: number,
  lng: number,
  year: number,
  month: number,
  method = 'karachi',
  options: PrayerTimesOptions = {}
) {
  return apiClient.get('/calendar/monthly', {
    params: { latitude: lat, longitude: lng, year, month, method, ...options },
  });
}

export async function getYearlyCalendar(
  lat: number,
  lng: number,
  year: number,
  method = 'karachi',
  format: 'summary' | 'full' = 'summary',
  options: PrayerTimesOptions = {}
) {
  return apiClient.get('/calendar/yearly', {
    params: { latitude: lat, longitude: lng, year, method, format, ...options },
  });
}

export async function getDateRangeCalendar(
  lat: number,
  lng: number,
  startDate: string,
  endDate: string,
  method = 'karachi',
  options: PrayerTimesOptions = {}
) {
  return apiClient.get('/calendar/date-range', {
    params: { latitude: lat, longitude: lng, start_date: startDate, end_date: endDate, method, ...options },
  });
}

export interface CalculationMethod {
  code: string;
  name: string;
  fajr_angle?: number;
  isha_angle?: number;
  isha_time_adjustment?: number;
  isha_calculation_type?: string;
  asr_method?: string;
  dhuhr_adjustment?: number;
  maghrib_adjustment?: number;
  is_default?: boolean;
  description?: string;
}

export async function getMethods(): Promise<{ methods: CalculationMethod[]; total_methods: number }> {
  return apiClient.get('/methods');
}

export async function searchLocations(query: string, limit = 10) {
  return apiClient.get('/locations/search', { params: { query, limit } });
}

export async function getLocationByCoordinates(lat: number, lng: number) {
  try {
    const response: any = await apiClient.get('/prayer-times', {
      params: { latitude: lat, longitude: lng, date: new Date().toISOString().split('T')[0] },
    });
    return {
      latitude: lat,
      longitude: lng,
      name: response.location?.name ?? null,
      district: response.location?.district ?? null,
      division: response.location?.division ?? null,
      timezone: response.location?.timezone ?? '+00:00',
    };
  } catch {
    return { latitude: lat, longitude: lng, name: null, district: null, division: null, timezone: '+00:00' };
  }
}
