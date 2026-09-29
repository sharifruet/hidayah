import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { RangePickerGrid } from './RangePickerGrid';
import { Card } from '../ui/Card';
import { getDateRangeCalendar } from '../../lib/services/prayer';
import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';
import type { PrayerKey } from '../../lib/constants';
import { formatDate, formatTime } from '../../lib/format';
import { localISODate, parseLocalISODate } from '../../lib/dates';
import { ErrorState } from '../ui/ErrorState';

const MAX_DAYS = 365;
const SHOWN_PRAYERS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const RANGE_DATE: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };

function toISO(d: Date): string {
  return localISODate(d);
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

interface RangeDay {
  date: string;
  day_of_week: string;
  prayer_times: Record<string, string>;
}

export function DateRangeCalendarView() {
  const { location, method, language, timeFormat } = useApp();
  const today = new Date();

  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);

  const tooLong = !!(start && end && (parseLocalISODate(end).getTime() - parseLocalISODate(start).getTime()) / 86400000 > MAX_DAYS);

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['date-range-calendar', location.lat, location.lng, start, end, method],
    queryFn: () => getDateRangeCalendar(location.lat, location.lng, start!, end!, method),
    enabled: !!start && !!end && !tooLong,
  });

  function setQuickRange(days: number) {
    setStart(toISO(today));
    setEnd(toISO(addDays(today, days - 1)));
    setCustomOpen(false);
  }

  function setThisMonth() {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setStart(toISO(first));
    setEnd(toISO(last));
    setCustomOpen(false);
  }

  function onPickDate(iso: string) {
    if (!start || (start && end)) {
      setStart(iso);
      setEnd(null);
    } else if (iso < start) {
      setStart(iso);
    } else {
      setEnd(iso);
    }
  }

  const days: RangeDay[] = (data as any)?.days ?? [];

  return (
    <View>
      <View className="flex-row flex-wrap gap-2 mb-3">
        <TouchableOpacity onPress={() => setQuickRange(7)} className="px-3 py-1.5 rounded-full bg-ink-100 dark:bg-ink-800">
          <Text className="font-body-medium text-xs text-ink-700 dark:text-ink-300">{tr('calendar_range_next_7', language)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setQuickRange(14)} className="px-3 py-1.5 rounded-full bg-ink-100 dark:bg-ink-800">
          <Text className="font-body-medium text-xs text-ink-700 dark:text-ink-300">{tr('calendar_range_next_14', language)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setQuickRange(30)} className="px-3 py-1.5 rounded-full bg-ink-100 dark:bg-ink-800">
          <Text className="font-body-medium text-xs text-ink-700 dark:text-ink-300">{tr('calendar_range_next_30', language)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={setThisMonth} className="px-3 py-1.5 rounded-full bg-ink-100 dark:bg-ink-800">
          <Text className="font-body-medium text-xs text-ink-700 dark:text-ink-300">{tr('calendar_range_this_month', language)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCustomOpen((o) => !o)}
          className={`px-3 py-1.5 rounded-full ${customOpen ? 'bg-primary-600' : 'bg-ink-100 dark:bg-ink-800'}`}
        >
          <Text className={`font-body-medium text-xs ${customOpen ? 'text-white' : 'text-ink-700 dark:text-ink-300'}`}>
            {tr('calendar_range_custom', language)}
          </Text>
        </TouchableOpacity>
      </View>

      {customOpen ? (
        <Card className="p-4 mb-3">
          <Text className="font-body text-xs text-ink-400 mb-2">
            {!start
              ? tr('calendar_range_tap_start', language)
              : !end
                ? tr('calendar_range_tap_end', language)
                : `${formatDate(parseLocalISODate(start), language, RANGE_DATE)} → ${formatDate(parseLocalISODate(end), language, RANGE_DATE)}`}
          </Text>
          <RangePickerGrid
            viewYear={viewYear}
            viewMonth={viewMonth}
            onNavigate={(y, m) => {
              setViewYear(y);
              setViewMonth(m);
            }}
            start={start}
            end={end}
            onPickDate={onPickDate}
          />
        </Card>
      ) : null}

      {tooLong ? <Text className="font-body text-sm text-red-500 mb-3">{tr('calendar_range_too_long', language)}</Text> : null}

      {!start || !end ? (
        !tooLong ? <Text className="font-body text-sm text-ink-400">{tr('calendar_range_empty', language)}</Text> : null
      ) : isLoading ? (
        <View className="items-center py-8">
          <ActivityIndicator color="#15805a" />
          <Text className="font-body text-xs text-ink-400 mt-2">{tr('calendar_range_loading', language)}</Text>
        </View>
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} retrying={isRefetching} compact />
      ) : (
        <View>
          {days.map((day) => (
            <Card key={day.date} className="p-3.5 mb-2">
              <Text className="font-body-semibold text-sm text-ink-900 dark:text-white mb-2">
                {formatDate(parseLocalISODate(day.date), language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
              <View className="flex-row flex-wrap gap-x-4 gap-y-1">
                {SHOWN_PRAYERS.map((key) => (
                  <Text key={key} className="font-body text-xs text-ink-500 dark:text-ink-400">
                    {tr(`prayer_${key}`, language)}: {day.prayer_times[key] ? formatTime(day.prayer_times[key], language, timeFormat) : '—'}
                  </Text>
                ))}
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}
