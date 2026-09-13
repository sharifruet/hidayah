import { useState } from 'react';
import { Share, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';

import { addBookmark, isBookmarked, removeBookmark } from '../../lib/bookmarks';
import { fetchTafsir } from '../../lib/services/quran';
import { tr } from '../../data/translations';
import type { LanguageCode } from '../../lib/constants';

export interface AyahRowData {
  surah: number;
  ayah: number;
  surahName: string;
  text_ar: string;
  translation?: string;
  translationBn?: string;
}

interface AyahRowProps {
  data: AyahRowData;
  isPlaying: boolean;
  isCurrent?: boolean;
  hideTranslation: boolean;
  onPlay: () => void;
  language: LanguageCode;
}

export function AyahRow({ data, isPlaying, isCurrent, hideTranslation, onPlay, language }: AyahRowProps) {
  const [revealed, setRevealed] = useState(!hideTranslation);
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(data.surah, data.ayah));
  const [tafsirOpen, setTafsirOpen] = useState(false);

  // Cached (and, via the query persister, kept on-device) so re-opening an ayah's
  // tafsir — even offline — doesn't need a network round trip after the first time.
  const { data: tafsirData, isLoading: loadingTafsir } = useQuery({
    queryKey: ['tafsir', data.surah, data.ayah, 'en.kathir'],
    queryFn: () => fetchTafsir(data.surah, data.ayah, 'en.kathir'),
    enabled: tafsirOpen,
    staleTime: 24 * 60 * 60 * 1000,
  });
  const tafsirText: string | null = (tafsirData as any)?.text ?? (tafsirData as any)?.data?.text ?? null;

  function toggleBookmark() {
    if (bookmarked) {
      removeBookmark(data.surah, data.ayah);
      setBookmarked(false);
    } else {
      addBookmark({
        surah: data.surah,
        ayah: data.ayah,
        surahName: data.surahName,
        text_ar: data.text_ar,
        translationText: data.translation ?? '',
      });
      setBookmarked(true);
    }
  }

  async function share() {
    const text = [data.text_ar, '', data.translation, '', `Qur'an ${data.surah}:${data.ayah}`].filter(Boolean).join('\n');
    await Share.share({ message: text });
  }

  function toggleTafsir() {
    setTafsirOpen((o) => !o);
  }

  return (
    <View
      className={`bg-white dark:bg-ink-900 border rounded-2xl p-4 mb-3 ${
        isCurrent ? 'border-primary-400' : 'border-ink-100 dark:border-ink-800'
      }`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
          <Text className="font-body-semibold text-[11px] text-primary-700 dark:text-primary-400">{data.ayah}</Text>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={onPlay}>
            <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle-outline'} size={22} color="#15805a" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTafsir}>
            <Ionicons name="chatbox-ellipses-outline" size={20} color="#7d879a" />
          </TouchableOpacity>
          <TouchableOpacity onPress={share}>
            <Ionicons name="share-outline" size={20} color="#7d879a" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleBookmark}>
            <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={20} color={bookmarked ? '#c99a45' : '#7d879a'} />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="font-arabic text-[26px] leading-[52px] text-right text-ink-900 dark:text-white">
        {data.text_ar}
      </Text>

      {hideTranslation && !revealed ? (
        <TouchableOpacity onPress={() => setRevealed(true)} className="mt-2 py-2 items-center bg-ink-50 dark:bg-ink-800 rounded-lg">
          <Text className="font-body-medium text-xs text-ink-400">{tr('quran_reveal_translation', language)}</Text>
        </TouchableOpacity>
      ) : data.translation ? (
        <Text className="font-body text-sm text-ink-600 dark:text-ink-300 leading-relaxed mt-3">{data.translation}</Text>
      ) : null}

      {revealed && data.translationBn ? (
        <Text className="font-body text-sm text-ink-500 dark:text-ink-400 leading-relaxed mt-1.5">{data.translationBn}</Text>
      ) : null}

      {tafsirOpen ? (
        <View className="mt-3 pt-3 border-t border-ink-100 dark:border-ink-800">
          {loadingTafsir ? (
            <Text className="font-body text-xs text-ink-400">{tr('quran_tafsir_loading', language)}</Text>
          ) : (
            <Text className="font-body text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
              {tafsirText ?? tr('quran_tafsir_unavailable', language)}
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}
