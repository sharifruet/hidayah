import { useState } from 'react';
import { Share, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';

import { addBookmark, isBookmarked, removeBookmark } from '../../lib/bookmarks';
import { fetchTafsir, type QuranWord } from '../../lib/services/quran';
import { localDigits } from '../../lib/format';
import { tr } from '../../data/translations';
import type { LanguageCode } from '../../lib/constants';

export interface AyahRowData {
  surah: number;
  ayah: number;
  surahName: string;
  text_ar: string;
  basmalah?: string | null;
  /** Primary translation. */
  translation?: string;
  /** Secondary translation (shown under the primary when "both" is chosen). */
  translationBn?: string;
  /** Word-by-word breakdown, when enabled. */
  words?: QuranWord[];
}

interface AyahRowProps {
  data: AyahRowData;
  isPlaying: boolean;
  isCurrent?: boolean;
  hideTranslation: boolean;
  onPlay: () => void;
  language: LanguageCode;
  memorisationMode?: boolean;
  isRevealed?: boolean;
  onReveal?: () => void;
  arabicSize?: number;
  translationSize?: number;
  tafsirEdition?: string;
}

export function AyahRow({
  data,
  isPlaying,
  isCurrent,
  hideTranslation,
  onPlay,
  language,
  memorisationMode,
  isRevealed,
  onReveal,
  arabicSize = 26,
  translationSize = 14,
  tafsirEdition = 'en.kathir',
}: AyahRowProps) {
  const [revealed, setRevealed] = useState(!hideTranslation);
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(data.surah, data.ayah));
  const [tafsirOpen, setTafsirOpen] = useState(false);
  const memorisationHidden = memorisationMode === true && isRevealed !== true;

  // Cached (and, via the query persister, kept on-device) so re-opening an ayah's
  // tafsir — even offline — doesn't need a network round trip after the first time.
  const { data: tafsirData, isLoading: loadingTafsir } = useQuery({
    queryKey: ['tafsir', data.surah, data.ayah, tafsirEdition],
    queryFn: () => fetchTafsir(data.surah, data.ayah, tafsirEdition),
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
    const text = [data.text_ar, '', data.translation, '', `${tr('nav_quran', language)} ${localDigits(`${data.surah}:${data.ayah}`, language)}`].filter(Boolean).join('\n');
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
      {data.basmalah ? (
        <Text style={{ lineHeight: 38 }} className="font-arabic text-xl text-center text-primary-700 dark:text-primary-400 mb-3">
          {data.basmalah}
        </Text>
      ) : null}

      <View className="flex-row items-center justify-between mb-3">
        <View className="w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
          <Text className="font-body-semibold text-[11px] text-primary-700 dark:text-primary-400">{localDigits(data.ayah, language)}</Text>
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

      {memorisationHidden ? (
        <TouchableOpacity
          onPress={onReveal}
          className="py-6 items-center justify-center rounded-xl border-2 border-dashed border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800/60"
        >
          <Ionicons name="eye-outline" size={18} color="#7d879a" />
          <Text className="font-body-medium text-xs text-ink-400 mt-1.5">{tr('quran_tap_to_reveal', language)}</Text>
        </TouchableOpacity>
      ) : (
        <>
          {data.words?.length ? (
            // Right-to-left grid of words, each with its meaning underneath.
            <View className="flex-row-reverse flex-wrap">
              {data.words.map((w) => (
                <View key={w.position} className="items-center mx-1 mb-2.5" style={{ maxWidth: '45%' }}>
                  <Text className="font-arabic text-ink-900 dark:text-white" style={{ fontSize: arabicSize * 0.9, lineHeight: arabicSize * 1.7 }}>
                    {w.text_ar}
                  </Text>
                  <Text className="font-body text-[11px] text-primary-700 dark:text-primary-400 text-center" numberOfLines={2}>
                    {w.gloss}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="font-arabic text-right text-ink-900 dark:text-white" style={{ fontSize: arabicSize, lineHeight: arabicSize * 2 }}>
              {data.text_ar}
            </Text>
          )}

          {hideTranslation && !revealed ? (
            <TouchableOpacity onPress={() => setRevealed(true)} className="mt-2 py-2 items-center bg-ink-50 dark:bg-ink-800 rounded-lg">
              <Text className="font-body-medium text-xs text-ink-400">{tr('quran_reveal_translation', language)}</Text>
            </TouchableOpacity>
          ) : data.translation ? (
            <Text className="font-body text-ink-600 dark:text-ink-300 mt-3" style={{ fontSize: translationSize, lineHeight: translationSize * 1.6 }}>
              {data.translation}
            </Text>
          ) : null}

          {revealed && data.translationBn ? (
            <Text className="font-body text-ink-500 dark:text-ink-400 mt-1.5" style={{ fontSize: translationSize * 0.93, lineHeight: translationSize * 1.5 }}>
              {data.translationBn}
            </Text>
          ) : null}
        </>
      )}

      {tafsirOpen ? (
        <View className="mt-3 pt-3 border-t border-ink-100 dark:border-ink-800">
          {loadingTafsir ? (
            <Text className="font-body text-xs text-ink-400">{tr('quran_tafsir_loading', language)}</Text>
          ) : (
            <Text className="font-body text-ink-600 dark:text-ink-300" style={{ fontSize: translationSize, lineHeight: translationSize * 1.6 }}>
              {tafsirText ?? tr('quran_tafsir_unavailable', language)}
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}
