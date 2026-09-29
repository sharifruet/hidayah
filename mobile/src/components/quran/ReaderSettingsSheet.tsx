import type { ReactNode } from 'react';
import { Modal, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';
import { localDigits } from '../../lib/format';
import type { LanguageCode } from '../../lib/constants';
import type { Reciter } from '../../lib/services/quran';

export type TranslationMode = 'bn' | 'en' | 'both';
export type TafsirEdition = 'bn.bengali' | 'en.kathir';

export interface ReaderSettings {
  translation: TranslationMode;
  hideTranslation: boolean;
  memorisationMode: boolean;
  repeatCount: number;
  playbackRate: number;
  /** Arabic font size in px (line height is derived). */
  arabicSize: number;
  translationSize: number;
  /** null = the first reciter the server lists. */
  reciterId: string | null;
  wordByWord: boolean;
  tafsir: TafsirEdition;
}

export const ARABIC_SIZES = [22, 26, 30, 34, 40];
export const TRANSLATION_SIZES = [13, 14, 16, 18, 21];

/** Defaults follow the UI language: Bangla readers get Bangla translation and tafsir. */
export function defaultReaderSettings(language: LanguageCode): ReaderSettings {
  const bn = language === 'bn';
  return {
    translation: bn ? 'bn' : 'en',
    hideTranslation: false,
    memorisationMode: false,
    repeatCount: 3,
    playbackRate: 1,
    arabicSize: 26,
    translationSize: 14,
    reciterId: null,
    wordByWord: false,
    tafsir: bn ? 'bn.bengali' : 'en.kathir',
  };
}

/** Merge saved settings over defaults, upgrading the old `showBengali` flag. */
export function migrateReaderSettings(saved: Partial<ReaderSettings> & { showBengali?: boolean } | null, language: LanguageCode): ReaderSettings {
  const base = defaultReaderSettings(language);
  if (!saved) return base;
  const { showBengali, ...rest } = saved;
  return { ...base, ...(showBengali && !rest.translation ? { translation: 'both' as const } : {}), ...rest };
}

const RATES = [0.75, 1, 1.25, 1.5, 2];
const REPEAT_COUNTS = [1, 2, 3, 5];

function Chip({ active, onPress, children }: { active: boolean; onPress: () => void; children: ReactNode }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-3 py-2 rounded-lg border mr-2 mb-2 ${active ? 'bg-primary-600 border-primary-600' : 'border-ink-200 dark:border-ink-700'}`}
    >
      <Text className={`font-body-medium text-xs ${active ? 'text-white' : 'text-ink-600 dark:text-ink-300'}`}>{children}</Text>
    </TouchableOpacity>
  );
}

function Label({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <View className="mb-2">
      <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{children}</Text>
      {note ? <Text className="font-body text-xs text-ink-400 mt-0.5">{note}</Text> : null}
    </View>
  );
}

/** A−/A+ stepper over a fixed list of sizes. */
function SizeStepper({ sizes, value, onChange, language }: { sizes: number[]; value: number; onChange: (v: number) => void; language: LanguageCode }) {
  const idx = Math.max(0, sizes.indexOf(value) === -1 ? sizes.findIndex((s) => s >= value) : sizes.indexOf(value));
  const button = (delta: number, label: string, a11yLabel: string, disabled: boolean) => (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => onChange(sizes[idx + delta])}
      className={`w-11 h-9 rounded-lg border border-ink-200 dark:border-ink-700 items-center justify-center ${disabled ? 'opacity-30' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
    >
      <Text className="font-body-bold text-sm text-ink-700 dark:text-ink-200">{label}</Text>
    </TouchableOpacity>
  );
  return (
    <View className="flex-row items-center mb-2">
      {button(-1, 'A−', tr('quran_text_smaller', language), idx <= 0)}
      <View className="flex-1 flex-row justify-center gap-1.5">
        {sizes.map((s, i) => (
          <View key={s} className={`h-1.5 rounded-full ${i <= idx ? 'bg-primary-600 w-5' : 'bg-ink-200 dark:bg-ink-700 w-5'}`} />
        ))}
      </View>
      <Text className="font-body text-xs text-ink-400 w-10 text-center">{localDigits(value, language)}</Text>
      {button(1, 'A+', tr('quran_text_larger', language), idx >= sizes.length - 1)}
    </View>
  );
}

export function ReaderSettingsSheet({
  visible,
  settings,
  reciters,
  onChange,
  onClose,
}: {
  visible: boolean;
  settings: ReaderSettings;
  reciters: Reciter[];
  onChange: (next: ReaderSettings) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const set = (patch: Partial<ReaderSettings>) => onChange({ ...settings, ...patch });
  const activeReciter = settings.reciterId ?? reciters[0]?.id;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/40" activeOpacity={1} onPress={onClose}>
        <View className="flex-1 justify-end">
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white dark:bg-ink-900 rounded-t-3xl pt-5" style={{ maxHeight: '85%' }}>
              <View className="flex-row items-center justify-between mb-3 px-5">
                <Text className="font-body-bold text-lg text-ink-900 dark:text-white">{tr('quran_reader_settings', language)}</Text>
                <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel={tr('close', language)}>
                  <Ionicons name="close" size={22} color="#5b6579" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
                {/* Text size, with a live preview — important for older readers. */}
                <View className="bg-ink-50 dark:bg-ink-800/60 rounded-xl px-4 py-3 mb-3">
                  <Text className="font-arabic text-right text-ink-900 dark:text-white" style={{ fontSize: settings.arabicSize, lineHeight: settings.arabicSize * 1.9 }}>
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </Text>
                  <Text className="font-body text-ink-600 dark:text-ink-300" style={{ fontSize: settings.translationSize, lineHeight: settings.translationSize * 1.55 }}>
                    {tr('quran_size_preview', language)}
                  </Text>
                </View>
                <Label>{tr('quran_arabic_size', language)}</Label>
                <SizeStepper sizes={ARABIC_SIZES} value={settings.arabicSize} onChange={(v) => set({ arabicSize: v })} language={language} />
                <Label>{tr('quran_translation_size', language)}</Label>
                <SizeStepper sizes={TRANSLATION_SIZES} value={settings.translationSize} onChange={(v) => set({ translationSize: v })} language={language} />

                <View className="h-px bg-ink-100 dark:bg-ink-800 my-3" />

                <Label>{tr('quran_translation_lang', language)}</Label>
                <View className="flex-row flex-wrap">
                  {(['bn', 'en', 'both'] as TranslationMode[]).map((m) => (
                    <Chip key={m} active={settings.translation === m} onPress={() => set({ translation: m })}>
                      {tr(`quran_translation_${m}`, language)}
                    </Chip>
                  ))}
                </View>

                <View className="flex-row items-center justify-between my-3">
                  <View className="flex-1 pr-3">
                    <Label note={tr('quran_word_by_word_note', language)}>{tr('quran_word_by_word', language)}</Label>
                  </View>
                  <Switch value={settings.wordByWord} onValueChange={(v) => set({ wordByWord: v })} trackColor={{ true: '#15805a' }} />
                </View>

                <Label>{tr('quran_tafsir', language)}</Label>
                <View className="flex-row flex-wrap">
                  {(['bn.bengali', 'en.kathir'] as TafsirEdition[]).map((e) => (
                    <Chip key={e} active={settings.tafsir === e} onPress={() => set({ tafsir: e })}>
                      {tr(e === 'bn.bengali' ? 'quran_tafsir_bn' : 'quran_tafsir_en', language)}
                    </Chip>
                  ))}
                </View>

                <View className="h-px bg-ink-100 dark:bg-ink-800 my-3" />

                {reciters.length ? (
                  <>
                    <Label>{tr('quran_reciter', language)}</Label>
                    {reciters.map((r) => (
                      <TouchableOpacity
                        key={r.id}
                        onPress={() => set({ reciterId: r.id })}
                        className="flex-row items-center py-2.5 border-b border-ink-50 dark:border-ink-800"
                      >
                        <Ionicons
                          name={activeReciter === r.id ? 'radio-button-on' : 'radio-button-off'}
                          size={18}
                          color={activeReciter === r.id ? '#15805a' : '#adb5c2'}
                        />
                        <Text className="font-body-medium text-sm text-ink-900 dark:text-white ml-2.5">{r.name}</Text>
                      </TouchableOpacity>
                    ))}
                    <View className="h-3" />
                  </>
                ) : null}

                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1 pr-3">
                    <Label note={tr('quran_hide_translation_note', language)}>{tr('quran_hide_translation', language)}</Label>
                  </View>
                  <Switch value={settings.hideTranslation} onValueChange={(v) => set({ hideTranslation: v })} trackColor={{ true: '#15805a' }} />
                </View>

                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1 pr-3">
                    <Label note={tr('quran_memorisation_note', language)}>{tr('quran_memorisation_mode', language)}</Label>
                  </View>
                  <Switch value={settings.memorisationMode} onValueChange={(v) => set({ memorisationMode: v })} trackColor={{ true: '#15805a' }} />
                </View>

                {settings.memorisationMode ? (
                  <>
                    <Label>{tr('quran_repeat_count', language)}</Label>
                    <View className="flex-row flex-wrap mb-2">
                      {REPEAT_COUNTS.map((n) => (
                        <Chip key={n} active={settings.repeatCount === n} onPress={() => set({ repeatCount: n })}>
                          {localDigits(n, language)}×
                        </Chip>
                      ))}
                    </View>
                  </>
                ) : null}

                <Label>{tr('quran_playback_speed', language)}</Label>
                <View className="flex-row flex-wrap">
                  {RATES.map((r) => (
                    <Chip key={r} active={settings.playbackRate === r} onPress={() => set({ playbackRate: r })}>
                      {localDigits(r, language)}×
                    </Chip>
                  ))}
                </View>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
