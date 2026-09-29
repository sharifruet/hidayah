import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext';
import { localPrayerTimes } from '../lib/prayerCalc';
import { getDeviceTimezoneOffset } from '../lib/prayerMath';
import { localISODate } from '../lib/dates';

/** Prayer times for the current location/method, computed on-device so they work offline. */
export function usePrayerTimes(dateOverride?: string) {
  const { location, method } = useApp();
  const date = dateOverride ?? localISODate();
  const timezone = getDeviceTimezoneOffset();

  return useQuery({
    queryKey: ['prayer-times', location.lat, location.lng, method, date, timezone],
    queryFn: () => localPrayerTimes(location.lat, location.lng, date, method),
    staleTime: Infinity,
    networkMode: 'always',
  });
}
