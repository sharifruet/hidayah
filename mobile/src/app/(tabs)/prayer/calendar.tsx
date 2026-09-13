import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { MonthCalendarGrid } from '../../../components/prayer/MonthCalendarGrid';
import { YearCalendarGrid } from '../../../components/prayer/YearCalendarGrid';
import { DateRangeCalendarView } from '../../../components/prayer/DateRangeCalendarView';
import { HIJRI_MONTH_NAMES_EN } from '../../../lib/hijri';
import { tr } from '../../../data/translations';
import { useApp } from '../../../context/AppContext';
import type { LanguageCode } from '../../../lib/constants';

const LOCALE_MAP: Record<LanguageCode, string> = { en: 'en-US', bn: 'bn-BD', ur: 'ur-PK', tr: 'tr-TR', id: 'id-ID' };
type CalendarViewMode = 'month' | 'year' | 'range';

export default function CalendarScreen() {
  const { language } = useApp();
  const now = new Date();
  const [view, setView] = useState<CalendarViewMode>('month');
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString(LOCALE_MAP[language], { month: 'long' });

  function shiftMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  const TABS: { key: CalendarViewMode; label: string }[] = [
    { key: 'month', label: tr('calendar_view_month', language) },
    { key: 'year', label: tr('calendar_view_year', language) },
    { key: 'range', label: tr('calendar_view_range', language) },
  ];

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('calendar_title', language)}</Text>
      </View>

      <View className="flex-row bg-ink-100 dark:bg-ink-800 rounded-lg p-1 mb-4 self-start">
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setView(t.key)}
            className={`px-3.5 py-1.5 rounded-md ${view === t.key ? 'bg-white dark:bg-ink-700' : ''}`}
          >
            <Text
              className={`font-body-medium text-sm ${
                view === t.key ? 'text-ink-900 dark:text-white' : 'text-ink-400'
              }`}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {view === 'month' ? (
        <>
          <Card className="p-4 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity onPress={() => shiftMonth(-1)} className="p-2">
                <Ionicons name="chevron-back" size={18} color="#5b6579" />
              </TouchableOpacity>
              <Text className="font-body-semibold text-base text-ink-900 dark:text-white">
                {monthLabel} {year}
              </Text>
              <TouchableOpacity onPress={() => shiftMonth(1)} className="p-2">
                <Ionicons name="chevron-forward" size={18} color="#5b6579" />
              </TouchableOpacity>
            </View>

            <MonthCalendarGrid year={year} month={month} />
          </Card>

          <Card className="p-4">
            <Text className="font-body-medium text-xs text-ink-400 mb-1">{tr('calendar_hijri_months', language)}</Text>
            <Text className="font-body text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
              {HIJRI_MONTH_NAMES_EN.join(' · ')}
            </Text>
          </Card>
        </>
      ) : view === 'year' ? (
        <>
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => setYear((y) => y - 1)} className="p-2">
              <Ionicons name="chevron-back" size={18} color="#5b6579" />
            </TouchableOpacity>
            <Text className="font-body-semibold text-base text-ink-900 dark:text-white">{year}</Text>
            <TouchableOpacity onPress={() => setYear((y) => y + 1)} className="p-2">
              <Ionicons name="chevron-forward" size={18} color="#5b6579" />
            </TouchableOpacity>
          </View>
          <YearCalendarGrid
            year={year}
            onSelectMonth={(m) => {
              setMonth(m);
              setView('month');
            }}
          />
        </>
      ) : (
        <DateRangeCalendarView />
      )}
    </Screen>
  );
}
