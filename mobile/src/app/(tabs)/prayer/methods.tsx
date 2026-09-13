import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { getMethods, type CalculationMethod } from '../../../lib/services/prayer';
import { tr } from '../../../data/translations';
import type { LanguageCode } from '../../../lib/constants';

function groupMethods(methods: CalculationMethod[]) {
  const madhabCodes = new Set(['hanafi', 'shafi', 'maliki', 'hanbali']);
  const organizational: CalculationMethod[] = [];
  const madhab: CalculationMethod[] = [];
  const custom: CalculationMethod[] = [];
  for (const m of methods) {
    if (madhabCodes.has(m.code)) madhab.push(m);
    else if (m.code.startsWith('custom')) custom.push(m);
    else organizational.push(m);
  }
  return { organizational, madhab, custom };
}

function MethodCard({
  method,
  isSelected,
  onSelect,
  language,
}: {
  method: CalculationMethod;
  isSelected: boolean;
  onSelect: () => void;
  language: LanguageCode;
}) {
  return (
    <Card className={`p-4 mb-3 ${isSelected ? 'border-primary-500' : ''}`}>
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 pr-2">
          <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{method.name}</Text>
          {method.description ? (
            <Text className="font-body text-xs text-ink-400 mt-0.5">{method.description}</Text>
          ) : null}
        </View>
        {method.is_default ? (
          <View className="bg-gold-500/10 px-2 py-1 rounded-full">
            <Text className="font-body-medium text-[10px] text-gold-600">{tr('methods_default_badge', language)}</Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row flex-wrap gap-x-4 gap-y-1 mb-3">
        {method.fajr_angle != null && (
          <Text className="font-body text-xs text-ink-500">{tr('methods_fajr_angle', language)}: {method.fajr_angle}°</Text>
        )}
        {method.isha_angle != null && (
          <Text className="font-body text-xs text-ink-500">{tr('methods_isha_angle', language)}: {method.isha_angle}°</Text>
        )}
        {method.isha_time_adjustment != null && (
          <Text className="font-body text-xs text-ink-500">
            {tr('prayer_isha', language)}: +{method.isha_time_adjustment} {tr('methods_isha_after_maghrib', language)}
          </Text>
        )}
        {method.asr_method ? (
          <Text className="font-body text-xs text-ink-500">{tr('methods_asr', language)}: {method.asr_method}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={onSelect}
        className={`rounded-xl py-2.5 items-center ${isSelected ? 'bg-primary-600' : 'bg-ink-50 dark:bg-ink-800'}`}
      >
        <Text className={`font-body-medium text-sm ${isSelected ? 'text-white' : 'text-ink-700 dark:text-ink-200'}`}>
          {isSelected ? tr('methods_current_badge', language) : tr('methods_use_button', language)}
        </Text>
      </TouchableOpacity>
    </Card>
  );
}

export default function MethodsScreen() {
  const { method, updateMethod, language } = useApp();
  const { data, isLoading } = useQuery({ queryKey: ['methods'], queryFn: getMethods });
  const groups = data ? groupMethods(data.methods) : { organizational: [], madhab: [], custom: [] };

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-1">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('methods_title', language)}</Text>
      </View>
      <Text className="font-body text-sm text-ink-500 dark:text-ink-400 mb-5">{tr('methods_subtitle', language)}</Text>

      {isLoading ? <Text className="font-body text-sm text-ink-400">{tr('loading', language)}</Text> : null}

      {groups.organizational.length > 0 ? (
        <>
          <Text className="font-body-semibold text-sm text-ink-700 dark:text-ink-300 mb-2">{tr('methods_org', language)}</Text>
          {groups.organizational.map((m) => (
            <MethodCard key={m.code} method={m} isSelected={method === m.code} onSelect={() => updateMethod(m.code)} language={language} />
          ))}
        </>
      ) : null}

      {groups.madhab.length > 0 ? (
        <>
          <Text className="font-body-semibold text-sm text-ink-700 dark:text-ink-300 mb-2 mt-2">
            {tr('methods_madhab', language)}
          </Text>
          {groups.madhab.map((m) => (
            <MethodCard key={m.code} method={m} isSelected={method === m.code} onSelect={() => updateMethod(m.code)} language={language} />
          ))}
        </>
      ) : null}

      {groups.custom.length > 0 ? (
        <>
          <Text className="font-body-semibold text-sm text-ink-700 dark:text-ink-300 mb-2 mt-2">{tr('methods_custom', language)}</Text>
          {groups.custom.map((m) => (
            <MethodCard key={m.code} method={m} isSelected={method === m.code} onSelect={() => updateMethod(m.code)} language={language} />
          ))}
        </>
      ) : null}
    </Screen>
  );
}
