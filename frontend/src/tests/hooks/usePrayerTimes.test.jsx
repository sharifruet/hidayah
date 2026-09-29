import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePrayerTimes } from '../../hooks/usePrayerTimes.js';
import * as prayerTimesService from '../../services/prayerTimesService.js';

vi.mock('../../services/prayerTimesService.js');

describe('usePrayerTimes', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should fetch prayer times', async () => {
    const mockData = {
      date: '2024-03-15',
      times: {
        fajr: '04:45',
        dhuhr: '12:15',
        maghrib: '18:30'
      }
    };

    prayerTimesService.getPrayerTimes.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => usePrayerTimes(23.8103, 90.4125, new Date('2024-03-15'), 'karachi'),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(prayerTimesService.getPrayerTimes).toHaveBeenCalledWith(
      23.8103,
      90.4125,
      '2024-03-15',
      'karachi',
      {}
    );
  });

  it('should not fetch when coordinates are missing', () => {
    const { result } = renderHook(
      () => usePrayerTimes(null, null, new Date('2024-03-15'), 'karachi'),
      { wrapper }
    );

    expect(result.current.isFetching).toBe(false);
    expect(prayerTimesService.getPrayerTimes).not.toHaveBeenCalled();
  });
});
