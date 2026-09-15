import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, type ViewToken } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AyahRow } from './AyahRow';
import { AudioPlayerBar } from './AudioPlayerBar';
import { ReaderSettingsSheet, type ReaderSettings } from './ReaderSettingsSheet';
import { fetchReciters, fetchSurahAyahs, findTranslation, splitBasmalah, type Ayah } from '../../lib/services/quran';
import { loadReaderSettings, markSurahRead, saveLastRead, saveReaderSettings } from '../../lib/progress';
import { useSurahPlayback } from '../../hooks/useSurahPlayback';
import { cacheSurahAudio } from '../../lib/offlineAudio';
import { backOr } from '../../lib/navigation';
import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';

const DEFAULT_SETTINGS: ReaderSettings = {
  showBengali: false,
  hideTranslation: false,
  memorisationMode: false,
  repeatCount: 3,
  playbackRate: 1,
};

export function ReaderScreen({ surahNumber, initialAyah }: { surahNumber: number; initialAyah?: number }) {
  const { language } = useApp();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<ReaderSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...loadReaderSettings<ReaderSettings>(),
  }));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [audioCached, setAudioCached] = useState(false);
  const [revealedAyahs, setRevealedAyahs] = useState<Set<number>>(new Set());
  const listRef = useRef<FlatList<Ayah>>(null);
  const scrolledOnce = useRef(false);

  const translations = useMemo(
    () => (settings.showBengali ? ['en.sahih', 'bn.bengali'] : ['en.sahih']),
    [settings.showBengali]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['surah-ayahs', surahNumber, translations.join(',')],
    queryFn: () => fetchSurahAyahs(surahNumber, { translations }),
    // Qur'an text doesn't change — once cached (on-device or in-memory), don't spend a
    // network round trip re-validating it just because the screen was reopened.
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: recitersData } = useQuery({ queryKey: ['reciters'], queryFn: fetchReciters, staleTime: Infinity });
  const reciter = recitersData?.data?.[0];

  const surahMeta = data?.data.surah;
  const ayahs = data?.data.ayahs ?? [];

  const player = useSurahPlayback(surahNumber, ayahs, reciter, settings.memorisationMode ? settings.repeatCount : 1);

  useEffect(() => {
    saveReaderSettings(settings);
  }, [settings]);

  useEffect(() => {
    player.setRate(settings.playbackRate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.playbackRate]);

  // Reset per-ayah reveal state whenever memorisation mode is toggled off or the surah changes.
  useEffect(() => {
    setRevealedAyahs(new Set());
  }, [settings.memorisationMode, surahNumber]);

  // Once a chapter is opened, quietly download its recitation audio in the background
  // so it plays back offline afterwards — one ayah at a time, skipping anything already cached.
  useEffect(() => {
    if (!reciter || ayahs.length === 0) return;
    const controller = new AbortController();
    setAudioCached(false);
    cacheSurahAudio(
      reciter.id,
      reciter.audio_url_template,
      surahNumber,
      ayahs.map((a) => a.number),
      controller.signal
    ).then(() => {
      if (!controller.signal.aborted) setAudioCached(true);
    });
    return () => controller.abort();
  }, [reciter, surahNumber, ayahs.length]);

  useEffect(() => {
    if (!scrolledOnce.current && initialAyah && ayahs.length > 0) {
      const idx = ayahs.findIndex((a) => a.number === initialAyah);
      if (idx > 0) {
        setTimeout(() => listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.1 }), 300);
      }
      scrolledOnce.current = true;
    }
  }, [ayahs, initialAyah]);

  function onViewableItemsChanged({ viewableItems }: { viewableItems: ViewToken[] }) {
    if (viewableItems.length === 0) return;
    const topAyah = viewableItems[0].item as Ayah;
    saveLastRead(surahNumber, topAyah.number);
    const lastVisible = viewableItems[viewableItems.length - 1].item as Ayah;
    if (surahMeta && lastVisible.number >= surahMeta.ayah_count) {
      markSurahRead(surahNumber);
    }
  }

  function handleReveal(ayahNumber: number) {
    setRevealedAyahs((prev) => new Set(prev).add(ayahNumber));
  }

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <View className="flex-row items-center justify-between px-4 pb-3" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => backOr('/quran')} className="mr-2 p-1">
            <Ionicons name="chevron-back" size={22} color="#5b6579" />
          </TouchableOpacity>
          <View>
            <Text className="font-body-bold text-lg text-ink-900 dark:text-white">
              {surahMeta?.name_en ?? `${tr('quran_surah_tab', language)} ${surahNumber}`}
            </Text>
            {surahMeta ? (
              <Text className="font-body text-xs text-ink-400">
                {surahMeta.name_en_trans} · {surahMeta.ayah_count} {tr('quran_ayahs', language)}
              </Text>
            ) : null}
          </View>
        </View>
        {surahMeta ? <Text className="font-arabic text-xl text-ink-700 dark:text-ink-300 mr-2">{surahMeta.name_ar}</Text> : null}
        {audioCached ? (
          <Ionicons name="cloud-done-outline" size={16} color="#15805a" style={{ marginRight: 6 }} />
        ) : null}
        <TouchableOpacity onPress={() => setSettingsOpen(true)} className="p-1.5">
          <Ionicons name="options-outline" size={20} color="#5b6579" />
        </TouchableOpacity>
      </View>

      {isError && ayahs.length === 0 ? (
        <Text className="font-body text-sm text-red-500 px-4">{tr('error_generic', language)}</Text>
      ) : null}
      {isLoading && ayahs.length === 0 ? (
        <Text className="font-body text-sm text-ink-400 px-4">{tr('quran_loading', language)}</Text>
      ) : null}

      <FlatList
        ref={listRef}
        data={ayahs}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: player.currentAyah != null ? 176 : 128, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        onScrollToIndexFailed={() => {}}
        renderItem={({ item }) => {
          const { basmalah, text } = splitBasmalah(surahNumber, item.number, item.text_ar);
          return (
          <AyahRow
            data={{
              surah: surahNumber,
              ayah: item.number,
              surahName: surahMeta?.name_en ?? '',
              text_ar: text,
              basmalah,
              translation: findTranslation(item, 'en.sahih'),
              translationBn: settings.showBengali ? findTranslation(item, 'bn.bengali') : undefined,
            }}
            isPlaying={player.currentAyah === item.number && player.isPlaying}
            hideTranslation={settings.hideTranslation}
            onPlay={() => player.playAyah(item.number)}
            language={language}
            memorisationMode={settings.memorisationMode}
            isRevealed={revealedAyahs.has(item.number)}
            onReveal={() => handleReveal(item.number)}
          />
          );
        }}
      />

      <AudioPlayerBar player={player} surahName={surahMeta?.name_en ?? ''} language={language} />

      <ReaderSettingsSheet
        visible={settingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </View>
  );
}
