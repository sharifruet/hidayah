import { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../../components/ui/Screen';
import { hadithService, hadithLanguageFor, type HadithCollection } from '../../../../lib/services/hadith';
import { useApp } from '../../../../context/AppContext';
import { tr } from '../../../../data/translations';

export default function HadithCollectionsScreen() {
  const { language } = useApp();
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hadith-collections'],
    queryFn: hadithService.listCollections,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const searchLanguage = hadithLanguageFor(language);

  const { data: searchData, isLoading: searching } = useQuery({
    queryKey: ['hadith-search', submitted, searchLanguage],
    queryFn: () => hadithService.search(submitted, { language: searchLanguage, limit: 30 }),
    enabled: submitted.length > 1,
  });

  const collections = data?.data ?? [];
  const matches = searchData?.data?.matches ?? [];
  const showingSearch = submitted.length > 1;

  return (
    <Screen scroll={false}>
      <View className="px-4 flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('hadith_title', language)}</Text>
      </View>

      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3 py-2.5">
          <Ionicons name="search" size={15} color="#7d879a" />
          <TextInput
            value={q}
            onChangeText={setQ}
            onSubmitEditing={() => setSubmitted(q.trim())}
            placeholder={tr('hadith_search_placeholder', language)}
            placeholderTextColor="#7d879a"
            returnKeyType="search"
            className="flex-1 ml-2 font-body text-sm text-ink-900 dark:text-white"
          />
        </View>
      </View>

      {isError && collections.length === 0 && !showingSearch ? (
        <Text className="font-body text-sm text-red-500 px-4 mb-2">{tr('error_generic', language)}</Text>
      ) : null}
      {(isLoading && !showingSearch) || (searching && showingSearch) ? (
        <Text className="font-body text-sm text-ink-400 px-4">{tr('loading', language)}</Text>
      ) : null}

      {showingSearch ? (
        <FlatList
          data={matches}
          keyExtractor={(item, idx) => `${item.collection_slug}-${item.hadithnumber}-${idx}`}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
          ListEmptyComponent={
            !searching ? (
              <Text className="font-body text-sm text-ink-400 text-center mt-8">{tr('hadith_no_results', language)}</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/more/hadith/${item.collection_slug}/${item.book_number}` as never)}
              className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-4 mb-2.5"
            >
              <Text className="font-body-medium text-xs text-primary-600 dark:text-primary-400 mb-1.5">
                {item.collection_name} · #{item.hadithnumber}
              </Text>
              <Text className="font-body text-sm text-ink-700 dark:text-ink-300" numberOfLines={3}>
                {item.text}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
          renderItem={({ item }: { item: HadithCollection }) => (
            <TouchableOpacity
              onPress={() => router.push(`/more/hadith/${item.slug}` as never)}
              className="flex-row items-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3.5 py-3.5 mb-2.5"
            >
              <View className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
                <Ionicons name="chatbox-ellipses-outline" size={18} color="#22a06d" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{item.name}</Text>
                <Text className="font-body text-xs text-ink-400 mt-0.5">
                  {item.total_hadiths} {tr('hadith_hadiths_count', language)} · {item.total_books} {tr('hadith_books_count', language)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#7d879a" />
            </TouchableOpacity>
          )}
        />
      )}
    </Screen>
  );
}
