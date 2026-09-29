import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { gregorianToHijri } from '../../lib/hijri';
import { localISODate } from '../../lib/dates';
import { islamicDaysOn } from '../../lib/islamicDays';
import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';
import { localDigits } from '../../lib/format';


export function MonthCalendarGrid({ year, month }: { year: number; month: number }) {
  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = firstOfMonth.getDay();
  const today = new Date();
  const { hijriOffset, language } = useApp();
  const weekdays = tr('calendar_weekdays_short', language).split(',');

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month - 1, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View>
      <View className="flex-row mb-2">
        {weekdays.map((w, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="font-body-medium text-xs text-ink-400">{w}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((date, idx) => {
          if (!date) return <View key={idx} style={{ width: '14.28%' }} className="aspect-square" />;
          const hijri = gregorianToHijri(date, hijriOffset);
          const events = islamicDaysOn(date, hijriOffset);
          const special = events.some((e) => e.kind !== 'fast');
          const fast = events.some((e) => e.kind === 'fast');
          const isToday = date.toDateString() === today.toDateString();
          const isFirstOfHijriMonth = hijri.day === 1;
          return (
            <TouchableOpacity
              key={idx}
              style={{ width: '14.28%' }}
              className="aspect-square items-center justify-center"
              onPress={() => router.push({ pathname: '/prayer', params: { date: localISODate(date) } })}
            >
              <View
                className={`w-9 h-9 items-center justify-center rounded-full ${
                  isToday ? 'bg-primary-600' : special ? 'bg-gold-500/15' : ''
                }`}
              >
                <Text
                  className={`font-body-semibold text-sm ${
                    isToday ? 'text-white' : 'text-ink-900 dark:text-white'
                  }`}
                >
                  {localDigits(date.getDate(), language)}
                </Text>
              </View>
              <Text
                className={`font-body text-[9px] mt-0.5 ${
                  isFirstOfHijriMonth ? 'text-gold-600 font-body-medium' : 'text-ink-400'
                }`}
              >
                {localDigits(hijri.day, language)}
              </Text>
              <View className="flex-row h-1 mt-0.5">
                {special ? <View className="w-1 h-1 rounded-full bg-gold-500 mx-px" /> : null}
                {fast ? <View className="w-1 h-1 rounded-full bg-sky-500 mx-px" /> : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
