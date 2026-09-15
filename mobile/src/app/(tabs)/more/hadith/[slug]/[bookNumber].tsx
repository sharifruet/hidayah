import { FlatList, Share, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../../../components/ui/Screen';
import { hadithService, defaultEdition, type Hadith } from '../../../../../lib/services/hadith';
import { useApp } from '../../../../../context/AppContext';
import { tr } from '../../../../../data/translations';
import type { LanguageCode } from '../../../../../lib/constants';

function HadithCard({ hadith, collectionName, language }: { hadith: Hadith; collectionName: string; language: LanguageCode }) {
  const translation = hadith.translations.find((t) => t.language === 'en')?.text;

  async function share() {
    const text = [translation, '', `${collectionName} ${hadith.hadithnumber}`].filter(Boolean).join('\n');
    await Share.share({ message: text });
  }

  return (
    <View className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 mb-3">
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full">
          <Text className="font-body-semibold text-[11px] text-primary-700 dark:text-primary-400">#{hadith.hadithnumber}</Text>
        </View>
        <TouchableOpacity onPress={share}>
          <Ionicons name="share-outline" size={18} color="#7d879a" />
        </TouchableOpacity>
      </View>
      {translation ? (
        <Text className="font-body text-sm text-ink-700 dark:text-ink-300 leading-relaxed">{translation}</Text>
      ) : (
        <Text className="font-body text-sm text-ink-400 italic">{tr('hadith_no_translation', language)}</Text>
      )}
      {hadith.grades?.length ? (
        <Text className="font-body text-xs text-ink-400 mt-2.5">
          {hadith.grades.map((g) => `${g.name}: ${g.grade}`).join(' · ')}
        </Text>
      ) : null}
    </View>
  );
}

export default function HadithListScreen() {
  const { language } = useApp();
  const { slug, bookNumber } = useLocalSearchParams<{ slug: string; bookNumber: string }>();
  const bookNum = Number(bookNumber);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hadith-book', slug, bookNum],
    queryFn: () => hadithService.getBookWithHadiths(slug, bookNum, [defaultEdition(slug)]),
    enabled: !!slug && !isNaN(bookNum),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const result = data?.data;
  const hadiths = result?.hadiths ?? [];

  return (
    <Screen scroll={false}>
      <View className="px-4 flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-body-bold text-lg text-ink-900 dark:text-white" numberOfLines={1}>
            {result?.book.name ?? '…'}
          </Text>
          <Text className="font-body text-xs text-ink-400" numberOfLines={1}>
            {result?.collection.name}
          </Text>
        </View>
      </View>

      {isError && hadiths.length === 0 ? (
        <Text className="font-body text-sm text-red-500 px-4 mb-2">{tr('error_generic', language)}</Text>
      ) : null}
      {isLoading && hadiths.length === 0 ? (
        <Text className="font-body text-sm text-ink-400 px-4">{tr('loading', language)}</Text>
      ) : null}

      <FlatList
        data={hadiths}
        keyExtractor={(item) => String(item.hadithnumber)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
        renderItem={({ item }) => (
          <HadithCard hadith={item} collectionName={result?.collection.name ?? ''} language={language} />
        )}
      />
    </Screen>
  );
}
