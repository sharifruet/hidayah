import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext';
import { getPrayerTimes } from '../lib/services/prayer';
import { getDeviceTimezoneOffset } from '../lib/prayerMath';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function usePrayerTimes(dateOverride?: string) {
  const { location, method } = useApp();
  const date = dateOverride ?? todayISO();
  const timezone = getDeviceTimezoneOffset();

  return useQuery({
    queryKey: ['prayer-times', location.lat, location.lng, method, date, timezone],
    queryFn: () => getPrayerTimes(location.lat, location.lng, date, method, { timezone }),
    staleTime: 5 * 60 * 1000,
  });
}
