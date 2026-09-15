import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../../../components/ui/Screen';
import { hadithService, type HadithBook } from '../../../../../lib/services/hadith';
import { useApp } from '../../../../../context/AppContext';
import { tr } from '../../../../../data/translations';

export default function HadithBooksScreen() {
  const { language } = useApp();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data: collectionsData } = useQuery({
    queryKey: ['hadith-collections'],
    queryFn: hadithService.listCollections,
    staleTime: 24 * 60 * 60 * 1000,
  });
  const collection = collectionsData?.data?.find((c) => c.slug === slug);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hadith-books', slug],
    queryFn: () => hadithService.listBooks(slug),
    enabled: !!slug,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const books = data?.data ?? [];

  return (
    <Screen scroll={false}>
      <View className="px-4 flex-row items-center mt-4 mb-1">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-xl text-ink-900 dark:text-white flex-1" numberOfLines={1}>
          {collection?.name ?? tr('hadith_title', language)}
        </Text>
      </View>
      <Text className="font-body text-xs text-ink-400 px-4 mb-4 ml-9">
        {collection ? `${collection.total_hadiths} ${tr('hadith_hadiths_count', language)}` : ''}
      </Text>

      {isError && books.length === 0 ? (
        <Text className="font-body text-sm text-red-500 px-4 mb-2">{tr('error_generic', language)}</Text>
      ) : null}
      {isLoading && books.length === 0 ? (
        <Text className="font-body text-sm text-ink-400 px-4">{tr('loading', language)}</Text>
      ) : null}

      <FlatList
        data={books}
        keyExtractor={(item) => String(item.book_number)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
        renderItem={({ item }: { item: HadithBook }) => (
          <TouchableOpacity
            onPress={() => router.push(`/more/hadith/${slug}/${item.book_number}` as never)}
            className="flex-row items-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3.5 py-3 mb-2"
          >
            <View className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
              <Text className="font-body-semibold text-[11px] text-primary-700 dark:text-primary-400">{item.book_number}</Text>
            </View>
            <View className="flex-1 ml-3">
              <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{item.name}</Text>
              <Text className="font-body text-xs text-ink-400 mt-0.5">
                {tr('hadith_number_range', language)} {item.hadithnumber_first}–{item.hadithnumber_last}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#7d879a" />
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
