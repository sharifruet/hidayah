import { useQuery } from '@tanstack/react-query';
import { getPrayerTimes } from '../services/prayerTimesService.js';
import { format } from 'date-fns';

/**
 * Hook to fetch prayer times
 */
export function usePrayerTimes(lat, lng, date, method = 'karachi', options = {}) {
  const dateStr = date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['prayer-times', lat, lng, dateStr, method, options],
    queryFn: () => getPrayerTimes(lat, lng, dateStr, method, options),
    enabled: !!lat && !!lng && !!dateStr,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
}
