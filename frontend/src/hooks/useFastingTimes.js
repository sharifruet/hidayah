import { useQuery } from '@tanstack/react-query';
import { getFastingTimes } from '../services/fastingTimesService.js';
import { format } from 'date-fns';

/**
 * Hook to fetch fasting times
 */
export function useFastingTimes(lat, lng, date, method = 'karachi', sehriMargin = 10, options = {}) {
  const dateStr = date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['fasting-times', lat, lng, dateStr, method, sehriMargin, options],
    queryFn: () => getFastingTimes(lat, lng, dateStr, method, sehriMargin, options),
    enabled: !!lat && !!lng && !!dateStr,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
