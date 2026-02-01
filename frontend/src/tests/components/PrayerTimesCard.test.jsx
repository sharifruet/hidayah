import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrayerTimesCard from '../../components/prayer/PrayerTimesCard.jsx';
import { AppProvider } from '../../context/AppContext.jsx';
import * as prayerTimesService from '../../services/prayerTimesService.js';

// Mock the service
vi.mock('../../services/prayerTimesService.js', () => ({
  getPrayerTimes: vi.fn()
}));

describe('PrayerTimesCard', () => {
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

  const renderWithProviders = (component) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          {component}
        </AppProvider>
      </QueryClientProvider>
    );
  };

  it('should render loading state', async () => {
    prayerTimesService.getPrayerTimes.mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithProviders(<PrayerTimesCard />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render prayer times when data is loaded', async () => {
    const mockData = {
      date: '2024-03-15',
      method: 'karachi',
      times: {
        fajr: '04:45',
        sunrise: '06:00',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '18:30',
        isha: '19:45'
      },
      location: {
        latitude: 23.8103,
        longitude: 90.4125,
        name: 'Dhaka'
      }
    };

    prayerTimesService.getPrayerTimes.mockResolvedValue(mockData);

    renderWithProviders(<PrayerTimesCard />);

    await waitFor(() => {
      expect(screen.getByText('04:45')).toBeInTheDocument();
      expect(screen.getByText('12:15')).toBeInTheDocument();
      expect(screen.getByText('18:30')).toBeInTheDocument();
    });
  });

  it('should render error message on error', async () => {
    prayerTimesService.getPrayerTimes.mockRejectedValue(new Error('API Error'));

    renderWithProviders(<PrayerTimesCard />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
