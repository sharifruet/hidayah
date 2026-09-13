import { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { fetchSurahs, type Surah } from '../../../lib/services/quran';
import { loadLastRead, getReadSurahs, getKhatmPercent, getStreak } from '../../../lib/progress';
import { useApp } from '../../../context/AppContext';
import { tr } from '../../../data/translations';

export default function QuranIndexScreen() {
  const { language } = useApp();
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['quran-surahs'],
    queryFn: fetchSurahs,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const surahs = data?.data ?? [];
  const lastRead = loadLastRead();
  const readSet = getReadSurahs();
  const khatmPct = getKhatmPercent();
  const streak = getStreak();

  const filtered = search.trim()
    ? surahs.filter(
        (s) =>
          s.name_en.toLowerCase().includes(search.toLowerCase()) ||
          String(s.number).includes(search) ||
          s.name_en_trans?.toLowerCase().includes(search.toLowerCase())
      )
    : surahs;

  return (
    <Screen scroll={false}>
      <View className="px-4">
        <View className="flex-row items-start justify-between mt-4 mb-4">
          <View>
            <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('quran_title', language)}</Text>
            <Text className="font-body text-sm text-ink-400 mt-0.5">{tr('quran_surah_count', language)}</Text>
          </View>

          <View className="flex-row gap-2">
            {streak > 0 ? (
              <View className="items-center bg-orange-50 dark:bg-orange-900/20 rounded-xl px-2.5 py-1.5">
                <Text className="text-base leading-none">🔥</Text>
                <Text className="font-body-bold text-xs text-orange-600 dark:text-orange-400 mt-0.5">{streak}</Text>
              </View>
            ) : null}
            <View className="items-center bg-primary-50 dark:bg-primary-900/20 rounded-xl px-2.5 py-1.5">
              <Ionicons name="calendar-outline" size={14} color="#15805a" />
              <Text className="font-body-bold text-xs text-primary-600 dark:text-primary-400 mt-0.5">{khatmPct}%</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                lastRead
                  ? router.push(`/quran/${lastRead.surah}/${lastRead.ayah}` as never)
                  : router.push('/quran/bookmarks')
              }
              className="items-center bg-blue-50 dark:bg-blue-900/20 rounded-xl px-2.5 py-1.5"
            >
              <Ionicons name="bookmark-outline" size={14} color="#3b82f6" />
              <Text className="font-body-bold text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                {lastRead ? lastRead.surah : '—'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center gap-2 mb-3">
          <View className="flex-row bg-ink-100 dark:bg-ink-800 rounded-lg p-1">
            <View className="px-3 py-1.5 rounded-md bg-white dark:bg-ink-700">
              <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{tr('quran_surah_tab', language)}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/quran/juz')} className="px-3 py-1.5">
            <Text className="font-body-medium text-sm text-ink-400">{tr('quran_juz_tab', language)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/quran/search')}
            className="flex-1 flex-row items-center justify-end"
          >
            <Ionicons name="search-outline" size={16} color="#5b6579" />
            <Text className="font-body-medium text-sm text-ink-600 dark:text-ink-300 ml-1.5">{tr('quran_search_ayahs', language)}</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3 py-2.5 mb-3">
          <Ionicons name="search" size={15} color="#7d879a" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={tr('quran_search_surah', language)}
            placeholderTextColor="#7d879a"
            className="flex-1 ml-2 font-body text-sm text-ink-900 dark:text-white"
          />
        </View>

        {isError ? <Text className="font-body text-sm text-red-500 mb-3">{tr('quran_load_error', language)}</Text> : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={isLoading ? <Text className="font-body text-sm text-ink-400 px-1">{tr('quran_loading', language)}</Text> : null}
        renderItem={({ item }: { item: Surah }) => {
          const isRead = readSet.has(item.number);
          return (
            <TouchableOpacity
              onPress={() => router.push(`/quran/${item.number}` as never)}
              className="flex-row items-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3.5 py-3 mb-2"
            >
              <View className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
                {isRead ? (
                  <Ionicons name="checkmark" size={16} color="#15805a" />
                ) : (
                  <Text className="font-body-semibold text-xs text-primary-700 dark:text-primary-400">{item.number}</Text>
                )}
              </View>
              <View className="flex-1 ml-3">
                <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{item.name_en}</Text>
                <Text className="font-body text-xs text-ink-400 mt-0.5">
                  {item.name_en_trans ? `${item.name_en_trans} · ` : ''}
                  {item.revelation_type ? `${item.revelation_type} · ` : ''}{item.ayah_count ?? '—'} {tr('quran_ayahs', language)}
                </Text>
              </View>
              {item.name_ar ? (
                <Text className="font-arabic text-lg text-ink-700 dark:text-ink-300">{item.name_ar}</Text>
              ) : null}
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
}
