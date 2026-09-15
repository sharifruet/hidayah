import { useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { fetchSearch } from '../../../lib/services/quran';
import { backOr } from '../../../lib/navigation';
import { useApp } from '../../../context/AppContext';
import { tr } from '../../../data/translations';

interface SearchResult {
  surah: number;
  ayah: number;
  surah_name?: string;
  text?: string;
  text_ar?: string;
}

export default function QuranSearchScreen() {
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['quran-search', submitted],
    queryFn: () => fetchSearch(submitted),
    enabled: submitted.length > 1,
  });

  const results: SearchResult[] = (data as any)?.data ?? [];

  return (
    <Screen scroll={false}>
      <View className="px-4 flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => backOr('/quran')} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('quran_search_ayahs', language)}</Text>
      </View>

      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3 py-2.5">
          <Ionicons name="search" size={16} color="#7d879a" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => setSubmitted(query.trim())}
            placeholder={tr('quran_search_placeholder', language)}
            placeholderTextColor="#7d879a"
            returnKeyType="search"
            className="flex-1 ml-2 font-body text-sm text-ink-900 dark:text-white"
          />
          {isLoading ? <ActivityIndicator size="small" /> : null}
        </View>
      </View>

      {isError ? <Text className="font-body text-sm text-red-500 px-4 mb-2">{tr('error_generic', language)}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item, idx) => `${item.surah}-${item.ayah}-${idx}`}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
        ListEmptyComponent={
          submitted && !isLoading ? (
            <Text className="font-body text-sm text-ink-400 text-center mt-8">{tr('quran_no_results', language)} "{submitted}"</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/quran/${item.surah}/${item.ayah}` as never)}
            className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-4 mb-2.5"
          >
            <Text className="font-body-medium text-xs text-primary-600 dark:text-primary-400 mb-1.5">
              {item.surah_name ?? `${tr('quran_surah_tab', language)} ${item.surah}`} · {tr('quran_ayah', language)} {item.ayah}
            </Text>
            {item.text_ar ? (
              <Text className="font-arabic text-lg text-right text-ink-900 dark:text-white mb-1.5">
                {item.text_ar}
              </Text>
            ) : null}
            {item.text ? (
              <Text className="font-body text-sm text-ink-600 dark:text-ink-300">{item.text}</Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
