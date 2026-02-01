import apiClient from './api.js';

/**
 * Get fasting times for a coordinate and date
 */
export async function getFastingTimes(lat, lng, date, method = 'karachi', sehriMargin = 10, options = {}) {
  const params = {
    latitude: lat,
    longitude: lng,
    date: date,
    method: method,
    sehri_margin: sehriMargin,
    ...options
  };

  return apiClient.get('/fasting-times', { params });
}

/**
 * Get monthly fasting calendar
 */
export async function getMonthlyFastingCalendar(lat, lng, year, month, method = 'karachi', sehriMargin = 10, options = {}) {
  const params = {
    latitude: lat,
    longitude: lng,
    year: year,
    month: month,
    method: method,
    sehri_margin: sehriMargin,
    include_fasting: true,
    ...options
  };

  return apiClient.get('/calendar/monthly', { params });
}

/**
 * Get date range fasting calendar
 */
export async function getDateRangeFastingCalendar(lat, lng, startDate, endDate, method = 'karachi', sehriMargin = 10, options = {}) {
  const params = {
    latitude: lat,
    longitude: lng,
    start_date: startDate,
    end_date: endDate,
    method: method,
    sehri_margin: sehriMargin,
    include_fasting: true,
    ...options
  };

  return apiClient.get('/calendar/date-range', { params });
}

/**
 * Download fasting calendar
 */
export async function downloadFastingCalendar(lat, lng, startDate, endDate, format, method = 'karachi', sehriMargin = 10, options = {}) {
  const data = await getDateRangeFastingCalendar(lat, lng, startDate, endDate, method, sehriMargin, options);
  return { data, format };
}
