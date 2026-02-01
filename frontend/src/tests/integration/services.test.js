import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPrayerTimes, getMonthlyCalendar } from '../../services/prayerTimesService.js';
import apiClient from '../../services/api.js';

// Mock the API client
vi.mock('../../services/api.js', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('Prayer Times Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call API with correct parameters for prayer times', async () => {
    const mockResponse = {
      date: '2024-03-15',
      times: { fajr: '04:45', dhuhr: '12:15' }
    };

    apiClient.get.mockResolvedValue(mockResponse);

    const result = await getPrayerTimes(23.8103, 90.4125, '2024-03-15', 'karachi');

    expect(apiClient.get).toHaveBeenCalledWith('/prayer-times', {
      params: {
        latitude: 23.8103,
        longitude: 90.4125,
        date: '2024-03-15',
        method: 'karachi'
      }
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call API with correct parameters for monthly calendar', async () => {
    const mockResponse = {
      year: 2024,
      month: 3,
      days: []
    };

    apiClient.get.mockResolvedValue(mockResponse);

    const result = await getMonthlyCalendar(23.8103, 90.4125, 2024, 3, 'karachi');

    expect(apiClient.get).toHaveBeenCalledWith('/calendar/monthly', {
      params: {
        latitude: 23.8103,
        longitude: 90.4125,
        year: 2024,
        month: 3,
        method: 'karachi',
        include_fasting: true
      }
    });

    expect(result).toEqual(mockResponse);
  });
});
