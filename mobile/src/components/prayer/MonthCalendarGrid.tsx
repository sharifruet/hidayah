import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { gregorianToHijri } from '../../lib/hijri';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function MonthCalendarGrid({ year, month }: { year: number; month: number }) {
  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = firstOfMonth.getDay();
  const today = new Date();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month - 1, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View>
      <View className="flex-row mb-2">
        {WEEKDAYS.map((w, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="font-body-medium text-xs text-ink-400">{w}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((date, idx) => {
          if (!date) return <View key={idx} style={{ width: '14.28%' }} className="aspect-square" />;
          const hijri = gregorianToHijri(date);
          const isToday = date.toDateString() === today.toDateString();
          const isFirstOfHijriMonth = hijri.day === 1;
          return (
            <TouchableOpacity
              key={idx}
              style={{ width: '14.28%' }}
              className="aspect-square items-center justify-center"
              onPress={() => router.push({ pathname: '/prayer', params: { date: date.toISOString().slice(0, 10) } })}
            >
              <View
                className={`w-9 h-9 items-center justify-center rounded-full ${
                  isToday ? 'bg-primary-600' : ''
                }`}
              >
                <Text
                  className={`font-body-semibold text-sm ${
                    isToday ? 'text-white' : 'text-ink-900 dark:text-white'
                  }`}
                >
                  {date.getDate()}
                </Text>
              </View>
              <Text
                className={`font-body text-[9px] mt-0.5 ${
                  isFirstOfHijriMonth ? 'text-gold-600 font-body-medium' : 'text-ink-400'
                }`}
              >
                {hijri.day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
