import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchMushafPage, splitBasmalah } from '../../lib/services/quran';
import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';

const MAX_PAGE = 604;

interface MushafSurah {
  number: number;
  name_ar: string;
  name_en: string;
  ayah_count: number;
  revelation_type: string;
  ayahs: { number: number; text_ar: string }[];
}

interface MushafPageData {
  page_number: number;
  juz: number;
  surahs: MushafSurah[];
}

export function MushafScreen({ pageNumber }: { pageNumber: number }) {
  const { language } = useApp();
  const insets = useSafeAreaInsets();
  const [jumpValue, setJumpValue] = useState('');

  const valid = !isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= MAX_PAGE;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['mushaf-page', pageNumber],
    queryFn: () => fetchMushafPage(pageNumber, []),
    enabled: valid,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const pageData: MushafPageData | undefined = (data as any)?.data;

  function goToPage(n: number) {
    router.replace(`/quran/page/${Math.max(1, Math.min(MAX_PAGE, n))}` as never);
  }

  function handleJump() {
    const n = parseInt(jumpValue, 10);
    if (!isNaN(n)) {
      goToPage(n);
      setJumpValue('');
    }
  }

  if (!valid) {
    return (
      <View className="flex-1 items-center justify-center bg-[#faf6ef] dark:bg-ink-950 px-8" style={{ paddingTop: insets.top }}>
        <Text className="font-body text-sm text-ink-400 text-center mb-4">{tr('quran_mushaf_invalid', language)}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="font-body-medium text-sm text-primary-600">{tr('nav_quran', language)}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#faf6ef] dark:bg-ink-950" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-3 py-2.5 border-b border-amber-200/60 dark:border-ink-800 gap-2">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="chevron-back" size={20} color="#166534" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1} className={pageNumber <= 1 ? 'opacity-30' : ''}>
          <Ionicons name="chevron-back" size={16} color="#166534" />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-body-semibold text-sm text-green-900 dark:text-green-400">
            {tr('quran_mushaf_page', language)} {pageNumber}
            {pageData ? `  ·  ${tr('quran_mushaf_juz', language)} ${pageData.juz}` : ''}
          </Text>
        </View>

        <TouchableOpacity onPress={() => goToPage(pageNumber + 1)} disabled={pageNumber >= MAX_PAGE} className={pageNumber >= MAX_PAGE ? 'opacity-30' : ''}>
          <Ionicons name="chevron-forward" size={16} color="#166534" />
        </TouchableOpacity>

        <TextInput
          value={jumpValue}
          onChangeText={setJumpValue}
          onSubmitEditing={handleJump}
          keyboardType="number-pad"
          placeholder={tr('quran_mushaf_jump_placeholder', language)}
          placeholderTextColor="#9ca3af"
          className="w-14 px-2 py-1 text-xs border border-amber-300 dark:border-ink-700 rounded bg-white dark:bg-ink-900 text-ink-900 dark:text-white"
        />
        <TouchableOpacity onPress={handleJump} className="px-2 py-1.5 bg-green-700 rounded">
          <Text className="font-body-medium text-xs text-white">{tr('quran_mushaf_go', language)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}>
        {isLoading ? <ActivityIndicator color="#166534" style={{ marginTop: 24 }} /> : null}
        {isError ? <Text className="font-body text-sm text-red-500 text-center mt-6">{tr('error_generic', language)}</Text> : null}

        {pageData?.surahs.map((surah, idx) => (
          <View key={surah.number} className={idx > 0 ? 'mt-8' : ''}>
            {surah.ayahs[0]?.number === 1 ? (
              <View className="items-center mb-5">
                <View className="w-full border border-green-600/40 dark:border-green-700/40 rounded px-6 py-4 bg-green-50/60 dark:bg-green-950/30">
                  <TouchableOpacity onPress={() => router.push(`/quran/${surah.number}` as never)}>
                    <Text className="font-arabic text-3xl text-green-900 dark:text-green-300 text-center leading-loose">
                      {surah.name_ar}
                    </Text>
                    <Text className="font-body-medium text-xs text-green-800 dark:text-green-500 text-center mt-1">
                      {surah.name_en} · {surah.ayah_count} {tr('quran_ayahs', language)} · {surah.revelation_type}
                    </Text>
                  </TouchableOpacity>
                </View>
                {surah.number !== 1 && surah.number !== 9 ? (
                  <Text className="font-arabic text-2xl text-ink-800 dark:text-ink-200 text-center mt-4">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                  </Text>
                ) : null}
              </View>
            ) : null}

            <Text
              className="font-arabic text-[22px] leading-[46px] text-right text-ink-900 dark:text-ink-100"
              style={{ writingDirection: 'rtl' }}
            >
              {surah.ayahs
                .map((ayah) => `${splitBasmalah(surah.number, ayah.number, ayah.text_ar).text} ۝${ayah.number} `)
                .join('')}
            </Text>
          </View>
        ))}

        {pageData ? (
          <View className="flex-row items-center justify-center gap-3 mt-10">
            <View className="flex-1 h-px bg-amber-200 dark:bg-ink-800" />
            <Text className="font-body-medium text-xs text-green-800 dark:text-green-600">{pageNumber}</Text>
            <View className="flex-1 h-px bg-amber-200 dark:bg-ink-800" />
          </View>
        ) : null}

        {pageData ? (
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={() => goToPage(pageNumber - 1)}
              disabled={pageNumber <= 1}
              className={`flex-row items-center px-4 py-2 rounded-lg border border-amber-200 dark:border-ink-800 ${pageNumber <= 1 ? 'opacity-30' : ''}`}
            >
              <Ionicons name="chevron-back" size={14} color="#166534" />
              <Text className="font-body-medium text-xs text-green-800 dark:text-green-500 ml-1">{tr('quran_mushaf_prev', language)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => goToPage(pageNumber + 1)}
              disabled={pageNumber >= MAX_PAGE}
              className={`flex-row items-center px-4 py-2 rounded-lg border border-amber-200 dark:border-ink-800 ${pageNumber >= MAX_PAGE ? 'opacity-30' : ''}`}
            >
              <Text className="font-body-medium text-xs text-green-800 dark:text-green-500 mr-1">{tr('quran_mushaf_next', language)}</Text>
              <Ionicons name="chevron-forward" size={14} color="#166534" />
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
