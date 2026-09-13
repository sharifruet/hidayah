import { Modal, Switch, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';

export interface ReaderSettings {
  showBengali: boolean;
  hideTranslation: boolean;
  playbackRate: number;
}

const RATES = [0.75, 1, 1.25, 1.5, 2];

export function ReaderSettingsSheet({
  visible,
  settings,
  onChange,
  onClose,
}: {
  visible: boolean;
  settings: ReaderSettings;
  onChange: (next: ReaderSettings) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/40" activeOpacity={1} onPress={onClose}>
        <View className="flex-1 justify-end">
          <TouchableOpacity activeOpacity={1}>
            <View
              className="bg-white dark:bg-ink-900 rounded-t-3xl px-5 pt-5"
              style={{ paddingBottom: insets.bottom + 20 }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-body-bold text-lg text-ink-900 dark:text-white">{tr('quran_reader_settings', language)}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={22} color="#5b6579" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{tr('quran_show_bengali', language)}</Text>
                <Switch
                  value={settings.showBengali}
                  onValueChange={(v) => onChange({ ...settings, showBengali: v })}
                  trackColor={{ true: '#15805a' }}
                />
              </View>

              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{tr('quran_memorisation_mode', language)}</Text>
                  <Text className="font-body text-xs text-ink-400 mt-0.5">{tr('quran_hide_translation_note', language)}</Text>
                </View>
                <Switch
                  value={settings.hideTranslation}
                  onValueChange={(v) => onChange({ ...settings, hideTranslation: v })}
                  trackColor={{ true: '#15805a' }}
                />
              </View>

              <Text className="font-body-medium text-sm text-ink-900 dark:text-white mb-2">{tr('quran_playback_speed', language)}</Text>
              <View className="flex-row gap-2">
                {RATES.map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => onChange({ ...settings, playbackRate: r })}
                    className={`px-3 py-2 rounded-lg border ${
                      settings.playbackRate === r ? 'bg-primary-600 border-primary-600' : 'border-ink-200 dark:border-ink-700'
                    }`}
                  >
                    <Text
                      className={`font-body-medium text-xs ${
                        settings.playbackRate === r ? 'text-white' : 'text-ink-600 dark:text-ink-300'
                      }`}
                    >
                      {r}×
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
