import { useEffect, useRef, useState } from 'react';
import { FlatList, Share, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../../../components/ui/Screen';
import { hadithService, editionFor, hadithLanguageFor, type Hadith } from '../../../../../lib/services/hadith';
import { useApp } from '../../../../../context/AppContext';
import { tr } from '../../../../../data/translations';
import type { LanguageCode } from '../../../../../lib/constants';
import { ErrorState } from '../../../../../components/ui/ErrorState';
import { isHadithBookmarked, toggleHadithBookmark } from '../../../../../lib/saved';
import { localDigits } from '../../../../../lib/format';

function HadithCard({
  hadith, slug, collectionName, bookName, language, highlighted,
}: {
  hadith: Hadith; slug: string; collectionName: string; bookName: string; language: LanguageCode; highlighted?: boolean;
}) {
  const translation = hadith.translations.find((t) => t.language === hadithLanguageFor(language))?.text;
  const [saved, setSaved] = useState(() => isHadithBookmarked(slug, hadith.hadithnumber));

  function toggleSaved() {
    setSaved(
      toggleHadithBookmark({
        slug,
        collectionName,
        bookNumber: hadith.book_number,
        bookName,
        hadithnumber: hadith.hadithnumber,
        displayNumber: hadith.in_book_number ?? hadith.hadithnumber,
        preview: translation ?? hadith.text_ar,
      })
    );
  }

  async function share() {
    const text = [translation ?? hadith.text_ar, '', `— ${collectionName} ${localDigits(hadith.hadithnumber, language)}`]
      .filter((line) => line !== undefined)
      .join('\n');
    await Share.share({ message: text });
  }

  // With no translation to read, the Arabic is all there is — show it up front.
  const [showArabic, setShowArabic] = useState(!translation);

  return (
    <View
      className={`bg-white dark:bg-ink-900 border rounded-2xl p-4 mb-3 ${
        highlighted ? 'border-gold-500' : 'border-ink-100 dark:border-ink-800'
      }`}
    >
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row flex-wrap items-center flex-1 mr-2">
          <Text className="font-body-semibold text-sm text-primary-700 dark:text-primary-400 mr-2">
            {tr('hadith_number', language)} {localDigits(hadith.in_book_number ?? hadith.hadithnumber, language)}
          </Text>
          {hadith.grades?.map((g, i) => (
            <View key={i} className="bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full mr-1">
              <Text className="font-body text-[10px] text-amber-700 dark:text-amber-400">
                {g.grade}{g.name ? ` · ${g.name}` : ''}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={toggleSaved} hitSlop={8} accessibilityRole="button">
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={saved ? '#c99a45' : '#7d879a'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={share} hitSlop={8}>
            <Ionicons name="share-outline" size={18} color="#7d879a" />
          </TouchableOpacity>
        </View>
      </View>

      {translation ? (
        <Text className="font-body text-base text-ink-800 dark:text-ink-200 leading-[26px]">{translation}</Text>
      ) : (
        <Text className="font-body text-sm text-ink-400 italic">{tr('hadith_no_translation', language)}</Text>
      )}

      {showArabic ? (
        <View className="bg-ink-50 dark:bg-ink-800/60 rounded-xl p-3 mt-3">
          <Text className="font-arabic text-2xl leading-[44px] text-right text-ink-900 dark:text-white">
            {hadith.text_ar}
          </Text>
        </View>
      ) : null}

      {translation ? (
        <TouchableOpacity onPress={() => setShowArabic((v) => !v)} className="flex-row items-center mt-3 self-start" hitSlop={8}>
          <Text className="font-body-medium text-sm text-primary-700 dark:text-primary-400 mr-1">
            {tr(showArabic ? 'hadith_hide_arabic' : 'hadith_show_arabic', language)}
          </Text>
          <Ionicons name={showArabic ? 'chevron-up' : 'chevron-down'} size={14} color="#12654a" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default function HadithListScreen() {
  const { language } = useApp();
  // `h` (optional) is a hadith number to scroll to, e.g. when opening a saved hadith.
  const { slug, bookNumber, h } = useLocalSearchParams<{ slug: string; bookNumber: string; h?: string }>();
  const bookNum = Number(bookNumber);
  const target = h ? Number(h) : null;
  const listRef = useRef<FlatList<Hadith>>(null);
  const scrolled = useRef(false);

  const edition = editionFor(slug, language);

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['hadith-book', slug, bookNum, edition],
    queryFn: () => hadithService.getBookWithHadiths(slug, bookNum, [edition]),
    enabled: !!slug && !isNaN(bookNum),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const result = data?.data;
  const hadiths = result?.hadiths ?? [];

  useEffect(() => {
    if (scrolled.current || target == null || hadiths.length === 0) return;
    const idx = hadiths.findIndex((x) => x.hadithnumber === target);
    if (idx > 0) setTimeout(() => listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.05 }), 300);
    scrolled.current = true;
  }, [hadiths, target]);

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

      {isError && hadiths.length === 0 ? <ErrorState error={error} onRetry={refetch} retrying={isRefetching} /> : null}
      {isLoading && hadiths.length === 0 ? (
        <Text className="font-body text-sm text-ink-400 px-4">{tr('loading', language)}</Text>
      ) : null}

      <FlatList
        ref={listRef}
        onScrollToIndexFailed={({ index }) => setTimeout(() => listRef.current?.scrollToIndex({ index, animated: true }), 400)}
        data={hadiths}
        keyExtractor={(item) => String(item.hadithnumber)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
        renderItem={({ item }) => (
          <HadithCard
            hadith={item}
            slug={slug}
            collectionName={result?.collection.name ?? ''}
            bookName={result?.book.name ?? ''}
            language={language}
            highlighted={item.hadithnumber === target}
          />
        )}
      />
    </Screen>
  );
}
