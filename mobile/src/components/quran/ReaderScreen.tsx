import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, type ViewToken } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AyahRow } from './AyahRow';
import { ReaderSettingsSheet, type ReaderSettings } from './ReaderSettingsSheet';
import { fetchReciters, fetchSurahAyahs, findTranslation, resolveAudioUrl, type Ayah } from '../../lib/services/quran';
import { loadReaderSettings, markSurahRead, saveLastRead, saveReaderSettings } from '../../lib/progress';
import { useAyahAudioPlayer } from '../../hooks/useAyahAudioPlayer';
import { cacheSurahAudio, getLocalAyahAudioUri } from '../../lib/offlineAudio';
import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';

const DEFAULT_SETTINGS: ReaderSettings = { showBengali: false, hideTranslation: false, playbackRate: 1 };

export function ReaderScreen({ surahNumber, initialAyah }: { surahNumber: number; initialAyah?: number }) {
  const { language } = useApp();
  const [settings, setSettings] = useState<ReaderSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...loadReaderSettings<ReaderSettings>(),
  }));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [audioCached, setAudioCached] = useState(false);
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

  const { play, isPlaying, setRate } = useAyahAudioPlayer();

  const surahMeta = data?.data.surah;
  const ayahs = data?.data.ayahs ?? [];

  useEffect(() => {
    saveReaderSettings(settings);
  }, [settings]);

  useEffect(() => {
    setRate(settings.playbackRate);
  }, [settings.playbackRate, setRate]);

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

  function onPlayAyah(ayah: Ayah) {
    if (!reciter) return;
    const local = getLocalAyahAudioUri(reciter.id, surahNumber, ayah.number);
    const url = local ?? resolveAudioUrl(reciter.audio_url_template, surahNumber, ayah.number);
    play(`${surahNumber}:${ayah.number}`, url);
  }

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        onScrollToIndexFailed={() => {}}
        renderItem={({ item }) => (
          <AyahRow
            data={{
              surah: surahNumber,
              ayah: item.number,
              surahName: surahMeta?.name_en ?? '',
              text_ar: item.text_ar,
              translation: findTranslation(item, 'en.sahih'),
              translationBn: settings.showBengali ? findTranslation(item, 'bn.bengali') : undefined,
            }}
            isPlaying={isPlaying(`${surahNumber}:${item.number}`)}
            hideTranslation={settings.hideTranslation}
            onPlay={() => onPlayAyah(item)}
            language={language}
          />
        )}
      />

      <ReaderSettingsSheet
        visible={settingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </View>
  );
}
