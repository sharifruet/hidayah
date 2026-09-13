import { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tr } from '../../data/translations';
import type { LanguageCode } from '../../lib/constants';

const RATES = [0.75, 1, 1.25, 1.5, 2];
const SLEEP_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

export interface SurahPlaybackControls {
  currentAyah: number | null;
  isPlaying: boolean;
  togglePlay: () => void;
  prev: () => void;
  next: () => void;
  stop: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  loopCount: number;
  repeat: number;
  rate: number;
  setRate: (rate: number) => void;
  progress: number;
  sleepMinutes: number;
  sleepRemaining: number;
  startSleepTimer: (minutes: number) => void;
}

/** Persistent mini player shown at the bottom of the reader once an ayah has been selected. */
export function AudioPlayerBar({
  player,
  surahName,
  language,
}: {
  player: SurahPlaybackControls;
  surahName: string;
  language: LanguageCode;
}) {
  const insets = useSafeAreaInsets();
  const [sleepPickerOpen, setSleepPickerOpen] = useState(false);
  const [speedPickerOpen, setSpeedPickerOpen] = useState(false);

  if (player.currentAyah == null) return null;

  const sleepLabel =
    player.sleepRemaining > 0
      ? `${Math.floor(player.sleepRemaining / 60)}:${String(player.sleepRemaining % 60).padStart(2, '0')}`
      : null;

  return (
    <>
      <View
        className="absolute left-0 right-0 bottom-0 bg-white dark:bg-ink-900 border-t border-ink-100 dark:border-ink-800 px-4 pt-2.5"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <View className="h-1 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden mb-2.5">
          <View className="h-full bg-primary-600" style={{ width: `${Math.max(0, Math.min(1, player.progress)) * 100}%` }} />
        </View>

        <View className="flex-row items-center justify-between mb-2.5">
          <View className="flex-1 flex-row items-center flex-wrap">
            <Text className="font-body-medium text-xs text-ink-700 dark:text-ink-300" numberOfLines={1}>
              {surahName} · {tr('quran_ayah', language)} {player.currentAyah}
            </Text>
            {player.repeat > 1 ? (
              <View className="ml-2 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded-full">
                <Text className="font-body-medium text-[10px] text-primary-700 dark:text-primary-400">
                  {player.loopCount}/{player.repeat}
                </Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity onPress={() => setSpeedPickerOpen(true)} className="px-2 py-1">
            <Text className="font-body-medium text-xs text-ink-500 dark:text-ink-400">{player.rate}×</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSleepPickerOpen(true)} className="px-2 py-1 flex-row items-center">
            <Ionicons name="moon-outline" size={14} color={sleepLabel ? '#15805a' : '#7d879a'} />
            {sleepLabel ? (
              <Text className="font-body-medium text-xs text-primary-600 dark:text-primary-400 ml-1">{sleepLabel}</Text>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity onPress={player.stop} className="p-1">
            <Ionicons name="close" size={18} color="#7d879a" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center gap-8 mb-1">
          <TouchableOpacity onPress={player.prev} disabled={!player.hasPrev} className={!player.hasPrev ? 'opacity-30' : ''}>
            <Ionicons name="play-skip-back" size={20} color="#5b6579" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={player.togglePlay}
            className="w-11 h-11 rounded-full bg-primary-600 items-center justify-center"
          >
            <Ionicons name={player.isPlaying ? 'pause' : 'play'} size={20} color="#fff" style={{ marginLeft: player.isPlaying ? 0 : 2 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={player.next} disabled={!player.hasNext} className={!player.hasNext ? 'opacity-30' : ''}>
            <Ionicons name="play-skip-forward" size={20} color="#5b6579" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={speedPickerOpen} transparent animationType="fade" onRequestClose={() => setSpeedPickerOpen(false)}>
        <TouchableOpacity className="flex-1 bg-black/40 justify-end" activeOpacity={1} onPress={() => setSpeedPickerOpen(false)}>
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white dark:bg-ink-900 rounded-t-3xl px-5 pt-5" style={{ paddingBottom: insets.bottom + 20 }}>
              <Text className="font-body-bold text-base text-ink-900 dark:text-white mb-3">{tr('quran_playback_speed', language)}</Text>
              <View className="flex-row gap-2">
                {RATES.map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => {
                      player.setRate(r);
                      setSpeedPickerOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg border ${
                      player.rate === r ? 'bg-primary-600 border-primary-600' : 'border-ink-200 dark:border-ink-700'
                    }`}
                  >
                    <Text className={`font-body-medium text-xs ${player.rate === r ? 'text-white' : 'text-ink-600 dark:text-ink-300'}`}>
                      {r}×
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal visible={sleepPickerOpen} transparent animationType="fade" onRequestClose={() => setSleepPickerOpen(false)}>
        <TouchableOpacity className="flex-1 bg-black/40 justify-end" activeOpacity={1} onPress={() => setSleepPickerOpen(false)}>
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white dark:bg-ink-900 rounded-t-3xl px-5 pt-5" style={{ paddingBottom: insets.bottom + 20 }}>
              <Text className="font-body-bold text-base text-ink-900 dark:text-white mb-3">{tr('quran_sleep_timer', language)}</Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  onPress={() => {
                    player.startSleepTimer(0);
                    setSleepPickerOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg border ${
                    player.sleepMinutes === 0 ? 'bg-primary-600 border-primary-600' : 'border-ink-200 dark:border-ink-700'
                  }`}
                >
                  <Text className={`font-body-medium text-xs ${player.sleepMinutes === 0 ? 'text-white' : 'text-ink-600 dark:text-ink-300'}`}>
                    {tr('quran_sleep_off', language)}
                  </Text>
                </TouchableOpacity>
                {SLEEP_OPTIONS.map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => {
                      player.startSleepTimer(m);
                      setSleepPickerOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg border ${
                      player.sleepMinutes === m ? 'bg-primary-600 border-primary-600' : 'border-ink-200 dark:border-ink-700'
                    }`}
                  >
                    <Text className={`font-body-medium text-xs ${player.sleepMinutes === m ? 'text-white' : 'text-ink-600 dark:text-ink-300'}`}>
                      {m}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
