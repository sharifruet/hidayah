import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';
import { tr } from '../../../data/translations';
import { TASBIH_PRESETS, getCount, getSelectedPreset, increment, resetCount, setSelectedPreset } from '../../../lib/tasbih';

export default function TasbihScreen() {
  const { language } = useApp();
  const [presetId, setPresetId] = useState(() => getSelectedPreset());
  const [count, setCount] = useState(() => getCount(presetId));

  const preset = TASBIH_PRESETS.find((p) => p.id === presetId) ?? TASBIH_PRESETS[0];
  const hasTarget = preset.target > 0;
  const reachedTarget = hasTarget && count > 0 && count % preset.target === 0;

  function selectPreset(id: string) {
    setPresetId(id);
    setSelectedPreset(id);
    setCount(getCount(id));
  }

  function onTap() {
    const next = increment(presetId);
    setCount(next);
    Haptics.impactAsync(
      hasTarget && next % preset.target === 0 ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light
    ).catch(() => {});
  }

  function onReset() {
    resetCount(presetId);
    setCount(0);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  }

  return (
    <Screen scroll={false}>
      <View className="flex-row items-center px-4 mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white flex-1">{tr('tasbih_title', language)}</Text>
        <TouchableOpacity onPress={onReset} className="p-1.5">
          <Ionicons name="refresh" size={20} color="#5b6579" />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap gap-2 px-4 mb-6">
        {TASBIH_PRESETS.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => selectPreset(p.id)}
            className={`px-3 py-2 rounded-lg border ${
              presetId === p.id ? 'bg-primary-600 border-primary-600' : 'border-ink-200 dark:border-ink-700'
            }`}
          >
            <Text className={`font-body-medium text-xs ${presetId === p.id ? 'text-white' : 'text-ink-600 dark:text-ink-300'}`}>
              {tr(p.targetKey, language)}
              {p.target > 0 ? ` (${p.target})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-1 items-center justify-center px-8">
        {preset.arabic ? (
          <Text className="font-arabic text-3xl text-ink-800 dark:text-ink-200 mb-2 text-center">{preset.arabic}</Text>
        ) : null}
        <Text className="font-body-medium text-sm text-ink-400 mb-8">{tr(preset.targetKey, language)}</Text>

        <TouchableOpacity
          onPress={onTap}
          activeOpacity={0.85}
          className={`w-56 h-56 rounded-full items-center justify-center border-4 ${
            reachedTarget ? 'bg-primary-600 border-primary-700' : 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
          }`}
        >
          <Text
            className={`font-body-bold text-6xl ${reachedTarget ? 'text-white' : 'text-primary-700 dark:text-primary-300'}`}
          >
            {hasTarget ? count % preset.target || (count > 0 ? preset.target : 0) : count}
          </Text>
          {hasTarget ? (
            <Text className={`font-body-medium text-sm mt-1 ${reachedTarget ? 'text-white/80' : 'text-primary-500'}`}>
              / {preset.target}
            </Text>
          ) : null}
        </TouchableOpacity>

        {hasTarget ? (
          <Text className="font-body text-xs text-ink-400 mt-6">
            {tr('tasbih_total', language)} {count}
          </Text>
        ) : null}
        <Text className="font-body text-xs text-ink-400 mt-2">{tr('tasbih_tap_hint', language)}</Text>
      </View>
    </Screen>
  );
}
