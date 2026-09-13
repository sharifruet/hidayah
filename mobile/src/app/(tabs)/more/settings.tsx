import { useState } from 'react';
import { Alert, Switch, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { I18nManager } from 'react-native';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { LocationPickerModal } from '../../../components/prayer/LocationPickerModal';
import { useApp } from '../../../context/AppContext';
import { LANGUAGE_LABELS, RTL_LANGUAGES, tr } from '../../../data/translations';
import { requestNotificationPermissions, cancelAllPrayerNotifications } from '../../../lib/notifications';
import type { LanguageCode } from '../../../lib/constants';

export default function SettingsScreen() {
  const {
    location, method, language, darkMode, notificationsEnabled,
    setLanguage, toggleDarkMode, setNotificationsEnabled, supportedLanguages,
  } = useApp();
  const [pickerVisible, setPickerVisible] = useState(false);

  async function onToggleNotifications(value: boolean) {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(tr('settings_permission_needed', language), tr('settings_permission_note', language));
        return;
      }
      setNotificationsEnabled(true);
    } else {
      await cancelAllPrayerNotifications();
      setNotificationsEnabled(false);
    }
  }

  function onSelectLanguage(lang: LanguageCode) {
    const willBeRTL = RTL_LANGUAGES.has(lang);
    const isCurrentlyRTL = I18nManager.isRTL;
    setLanguage(lang);
    if (willBeRTL !== isCurrentlyRTL) {
      Alert.alert(tr('settings_restart_title', lang), tr('settings_restart_note', lang));
    }
  }

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('settings_title', language)}</Text>
      </View>

      <Card className="p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{tr('settings_dark_mode', language)}</Text>
            <Text className="font-body text-xs text-ink-400 mt-0.5">{tr('settings_dark_mode_note', language)}</Text>
          </View>
          <Switch value={darkMode} onValueChange={toggleDarkMode} trackColor={{ true: '#15805a' }} />
        </View>

        <View className="h-px bg-ink-100 dark:bg-ink-800 my-4" />

        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{tr('settings_notifications', language)}</Text>
            <Text className="font-body text-xs text-ink-400 mt-0.5">{tr('settings_notifications_note', language)}</Text>
          </View>
          <Switch value={notificationsEnabled} onValueChange={onToggleNotifications} trackColor={{ true: '#15805a' }} />
        </View>
      </Card>

      <Text className="font-body-semibold text-sm text-ink-700 dark:text-ink-300 mb-2">{tr('settings_language', language)}</Text>
      <Card className="p-3 mb-4">
        <View className="flex-row flex-wrap -mx-1">
          {supportedLanguages.map((lang) => (
            <TouchableOpacity
              key={lang}
              onPress={() => onSelectLanguage(lang)}
              className={`m-1 px-3 py-2 rounded-lg border ${
                language === lang
                  ? 'bg-primary-600 border-primary-600'
                  : 'border-ink-200 dark:border-ink-700'
              }`}
            >
              <Text
                className={`font-body-medium text-sm ${
                  language === lang ? 'text-white' : 'text-ink-700 dark:text-ink-200'
                }`}
              >
                {LANGUAGE_LABELS[lang]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Text className="font-body-semibold text-sm text-ink-700 dark:text-ink-300 mb-2">{tr('settings_calc_method', language)}</Text>
      <TouchableOpacity onPress={() => router.push('/prayer/methods')}>
        <Card className="p-4 mb-4 flex-row items-center justify-between">
          <Text className="font-body-medium text-sm text-ink-900 dark:text-white capitalize">{method}</Text>
          <Ionicons name="chevron-forward" size={16} color="#7d879a" />
        </Card>
      </TouchableOpacity>

      <Text className="font-body-semibold text-sm text-ink-700 dark:text-ink-300 mb-2">{tr('settings_location', language)}</Text>
      <TouchableOpacity onPress={() => setPickerVisible(true)}>
        <Card className="p-4 flex-row items-center justify-between">
          <View>
            <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{location.name}</Text>
            {location.division ? <Text className="font-body text-xs text-ink-400 mt-0.5">{location.division}</Text> : null}
            <Text className="font-body text-xs text-ink-400 mt-0.5">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#7d879a" />
        </Card>
      </TouchableOpacity>

      <LocationPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} />
    </Screen>
  );
}
