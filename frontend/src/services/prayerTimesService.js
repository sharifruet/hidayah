import apiClient from './api.js';

/**
 * Get prayer times for a coordinate and date
 */
export async function getPrayerTimes(lat, lng, date, method = 'karachi', options = {}) {
  const params = {
    latitude: lat,
    longitude: lng,
    date: date,
    method: method,
    ...options
  };

  return apiClient.get('/prayer-times', { params });
}

/**
 * Get monthly calendar
 */
export async function getMonthlyCalendar(lat, lng, year, month, method = 'karachi', includeFasting = true, options = {}) {
  const params = {
    latitude: lat,
    longitude: lng,
    year: year,
    month: month,
    method: method,
    include_fasting: includeFasting,
    ...options
  };

  return apiClient.get('/calendar/monthly', { params });
}

/**
 * Get yearly calendar
 */
export async function getYearlyCalendar(lat, lng, year, method = 'karachi', format = 'summary', includeFasting = true, options = {}) {
  const params = {
    latitude: lat,
    longitude: lng,
    year: year,
    method: method,
    format: format,
    include_fasting: includeFasting,
    ...options
  };

  return apiClient.get('/calendar/yearly', { params });
}

/**
 * Get date range calendar
 */
export async function getDateRangeCalendar(lat, lng, startDate, endDate, method = 'karachi', includeFasting = true, options = {}) {
  const params = {
    latitude: lat,
    longitude: lng,
    start_date: startDate,
    end_date: endDate,
    method: method,
    include_fasting: includeFasting,
    ...options
  };

  return apiClient.get('/calendar/date-range', { params });
}

/**
 * Download calendar (prepare data for download)
 */
export async function downloadCalendar(lat, lng, viewType, params, format, method = 'karachi', options = {}) {
  let data;

  switch (viewType) {
    case 'monthly':
      data = await getMonthlyCalendar(lat, lng, params.year, params.month, method, true, options);
      break;
    case 'yearly':
      data = await getYearlyCalendar(lat, lng, params.year, method, 'full', true, options);
      break;
    case 'date-range':
      data = await getDateRangeCalendar(lat, lng, params.startDate, params.endDate, method, true, options);
      break;
    default:
      throw new Error(`Invalid view type: ${viewType}`);
  }

  return { data, format };
}

/**
 * Print calendar (prepare data for printing)
 */
export async function printCalendar(lat, lng, viewType, params, method = 'karachi', options = {}) {
  return downloadCalendar(lat, lng, viewType, params, 'pdf', method, options);
}
