import { useState, type ReactNode } from 'react';
import { Alert, I18nManager, Switch, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { LocationPickerModal } from '../../../components/prayer/LocationPickerModal';
import { useApp, type AdhanSound } from '../../../context/AppContext';
import { LANGUAGE_LABELS, RTL_LANGUAGES, fmt, tr } from '../../../data/translations';
import { requestNotificationPermissions } from '../../../lib/notifications';
import { formatHijriDate, gregorianToHijri, HIJRI_OFFSET_RANGE } from '../../../lib/hijri';
import { myMasjidName } from '../../../lib/myMasjid';
import type { LanguageCode } from '../../../lib/constants';
import { formatTime, localDigits, type TimeFormat } from '../../../lib/format';

const JAMAH_LEAD_OPTIONS = [5, 10, 15, 20, 30];
const ADHAN_OPTIONS: { key: AdhanSound; labelKey: string }[] = [
  { key: 'makkah', labelKey: 'adhan_makkah' },
  { key: 'system', labelKey: 'adhan_system' },
];

function Divider() {
  return <View className="h-px bg-ink-100 dark:bg-ink-800 my-4" />;
}

function ToggleRow({
  title, note, value, onChange, disabled,
}: { title: string; note?: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <View className={`flex-row items-center justify-between ${disabled ? 'opacity-50' : ''}`}>
      <View className="flex-1 pr-3">
        <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{title}</Text>
        {note ? <Text className="font-body text-xs text-ink-400 mt-0.5">{note}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onChange} disabled={disabled} trackColor={{ true: '#15805a' }} />
    </View>
  );
}

function Chip({ active, onPress, children }: { active: boolean; onPress: () => void; children: ReactNode }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`m-1 px-3 py-2 rounded-lg border ${active ? 'bg-primary-600 border-primary-600' : 'border-ink-200 dark:border-ink-700'}`}
    >
      <Text className={`font-body-medium text-sm ${active ? 'text-white' : 'text-ink-700 dark:text-ink-200'}`}>{children}</Text>
    </TouchableOpacity>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <Text className="font-body-semibold text-sm text-ink-700 dark:text-ink-300 mb-2">{children}</Text>;
}

/** Plays one adhan clip; tapping again stops it. */
function AdhanPreview({ source, label }: { source: number; label: string }) {
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);
  const { language } = useApp();
  function toggle() {
    if (status.playing) {
      player.pause();
    } else {
      player.seekTo(0);
      player.play();
    }
  }
  return (
    <TouchableOpacity onPress={toggle} className="flex-row items-center bg-ink-50 dark:bg-ink-800 rounded-full px-3 py-1.5 mr-2 mt-2">
      <Ionicons name={status.playing ? 'stop' : 'play'} size={13} color="#15805a" />
      <Text className="font-body-medium text-xs text-ink-700 dark:text-ink-200 ml-1">
        {status.playing ? tr('adhan_stop', language) : `${tr('adhan_preview', language)} · ${label}`}
      </Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const app = useApp();
  const {
    location, method, language, darkMode, notificationsEnabled, prayerCheckInEnabled, ramadanRemindersEnabled,
    setLanguage, toggleDarkMode, setNotificationsEnabled, setPrayerCheckInEnabled, setRamadanRemindersEnabled,
    supportedLanguages, myMasjid,
  } = app;
  const [pickerVisible, setPickerVisible] = useState(false);

  /** Asks for notification permission before turning a reminder on; turning off needs none.
   * Rescheduling happens in the root layout whenever a reminder setting changes. */
  function withPermission(setter: (v: boolean) => void) {
    return async (value: boolean) => {
      if (value && !(await requestNotificationPermissions(language))) {
        Alert.alert(tr('settings_permission_needed', language), tr('settings_permission_note', language));
        return;
      }
      setter(value);
    };
  }

  function onSelectLanguage(lang: LanguageCode) {
    const willBeRTL = RTL_LANGUAGES.has(lang);
    const isCurrentlyRTL = I18nManager.isRTL;
    setLanguage(lang);
    if (willBeRTL !== isCurrentlyRTL) {
      Alert.alert(tr('settings_restart_title', lang), tr('settings_restart_note', lang));
    }
  }

  const hijriToday = gregorianToHijri(new Date(), app.hijriOffset);

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('settings_title', language)}</Text>
      </View>

      <Card className="p-4 mb-4">
        <ToggleRow title={tr('settings_dark_mode', language)} note={tr('settings_dark_mode_note', language)} value={darkMode} onChange={toggleDarkMode} />
      </Card>

      {/* Prayer alerts + adhan */}
      <Card className="p-4 mb-4">
        <ToggleRow
          title={tr('settings_notifications', language)}
          note={tr('settings_notifications_note', language)}
          value={notificationsEnabled}
          onChange={withPermission(setNotificationsEnabled)}
        />
        <Divider />
        <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{tr('settings_adhan_sound', language)}</Text>
        <Text className="font-body text-xs text-ink-400 mt-0.5 mb-1">{tr('settings_adhan_sound_note', language)}</Text>
        <View className="flex-row flex-wrap -mx-1">
          {ADHAN_OPTIONS.map((o) => (
            <Chip key={o.key} active={app.adhanSound === o.key} onPress={() => app.setAdhanSound(o.key)}>
              {tr(o.labelKey, language)}
            </Chip>
          ))}
        </View>
        <View className="flex-row flex-wrap">
          <AdhanPreview source={require('../../../../assets/sounds/adhan_makkah.wav')} label={tr('adhan_makkah', language)} />
          <AdhanPreview source={require('../../../../assets/sounds/adhan_fajr.wav')} label={tr('prayer_fajr', language)} />
        </View>
        <Divider />
        <ToggleRow
          title={tr('settings_fajr_soft', language)}
          note={tr('settings_fajr_soft_note', language)}
          value={app.fajrSoftAdhan}
          onChange={app.setFajrSoftAdhan}
          disabled={app.adhanSound !== 'makkah'}
        />
        <Divider />
        <ToggleRow title={tr('settings_checkin', language)} note={tr('settings_checkin_note', language)} value={prayerCheckInEnabled} onChange={withPermission(setPrayerCheckInEnabled)} />
        <Divider />
        <ToggleRow
          title={tr('settings_ramadan_reminders', language)}
          note={tr('settings_ramadan_reminders_note', language)}
          value={ramadanRemindersEnabled}
          onChange={withPermission(setRamadanRemindersEnabled)}
        />
      </Card>

      {/* Masjid & Islamic-day reminders */}
      <SectionTitle>{tr('settings_reminders', language)}</SectionTitle>
      <Card className="p-4 mb-4">
        <TouchableOpacity onPress={() => router.push((myMasjid ? `/more/masjids/${myMasjid.id}` : '/more/masjids') as never)} className="flex-row items-center mb-3">
          <Ionicons name="business-outline" size={16} color="#22a06d" />
          <Text className="font-body-medium text-sm text-ink-900 dark:text-white ml-2 flex-1">
            {tr('my_masjid', language)}: {myMasjid ? myMasjidName(myMasjid, language) : '—'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#7d879a" />
        </TouchableOpacity>
        {!myMasjid ? <Text className="font-body text-xs text-ink-400 mb-3">{tr('settings_pick_masjid', language)}</Text> : null}
        <ToggleRow
          title={tr('settings_jamah_reminders', language)}
          note={tr('settings_jamah_reminders_note', language)}
          value={app.jamahRemindersEnabled}
          onChange={withPermission(app.setJamahRemindersEnabled)}
          disabled={!myMasjid}
        />
        {app.jamahRemindersEnabled && myMasjid ? (
          <>
            <Text className="font-body text-xs text-ink-500 dark:text-ink-400 mt-3">{tr('settings_jamah_lead', language)}</Text>
            <View className="flex-row flex-wrap -mx-1 mt-1">
              {JAMAH_LEAD_OPTIONS.map((m) => (
                <Chip key={m} active={app.jamahLeadMinutes === m} onPress={() => app.setJamahLeadMinutes(m)}>
                  {`${localDigits(m, language)} ${tr('minutes_short', language)}`}
                </Chip>
              ))}
            </View>
          </>
        ) : null}
        <Divider />
        <ToggleRow
          title={tr('settings_jumuah_reminder', language)}
          note={tr('settings_jumuah_reminder_note', language)}
          value={app.jumuahReminderEnabled}
          onChange={withPermission(app.setJumuahReminderEnabled)}
        />
        <Divider />
        <ToggleRow
          title={tr('settings_islamic_day_reminders', language)}
          note={tr('settings_islamic_day_reminders_note', language)}
          value={app.islamicDayRemindersEnabled}
          onChange={withPermission(app.setIslamicDayRemindersEnabled)}
        />
        <Divider />
        <ToggleRow
          title={tr('settings_sunnah_fast_reminders', language)}
          note={tr('settings_sunnah_fast_reminders_note', language)}
          value={app.sunnahFastRemindersEnabled}
          onChange={withPermission(app.setSunnahFastRemindersEnabled)}
        />
      </Card>

      {/* Hijri moon-sighting adjustment */}
      <SectionTitle>{tr('settings_hijri_offset', language)}</SectionTitle>
      <Card className="p-4 mb-4">
        <Text className="font-body text-xs text-ink-400 mb-2">{tr('settings_hijri_offset_note', language)}</Text>
        <View className="flex-row flex-wrap -mx-1">
          {HIJRI_OFFSET_RANGE.map((d) => (
            <Chip key={d} active={app.hijriOffset === d} onPress={() => app.setHijriOffset(d)}>
              {localDigits(d > 0 ? `+${d}` : String(d), language)}
            </Chip>
          ))}
        </View>
        <Text className="font-body-medium text-sm text-ink-700 dark:text-ink-200 mt-2">
          {fmt('settings_hijri_today', language, {
            date: formatHijriDate(hijriToday, language),
          })}
        </Text>
      </Card>

      <SectionTitle>{tr('settings_language', language)}</SectionTitle>
      <Card className="p-3 mb-4">
        <View className="flex-row flex-wrap -mx-1">
          {supportedLanguages.map((lang) => (
            <Chip key={lang} active={language === lang} onPress={() => onSelectLanguage(lang)}>
              {LANGUAGE_LABELS[lang]}
            </Chip>
          ))}
        </View>
      </Card>

      <SectionTitle>{tr('settings_time_format', language)}</SectionTitle>
      <Card className="p-3 mb-4">
        <View className="flex-row flex-wrap -mx-1">
          {(['12h', '24h'] as TimeFormat[]).map((f) => (
            <Chip key={f} active={app.timeFormat === f} onPress={() => app.setTimeFormat(f)}>
              {tr(f === '12h' ? 'settings_time_12h' : 'settings_time_24h', language)}
            </Chip>
          ))}
        </View>
        <Text className="font-body text-xs text-ink-400 mt-1 ml-1">
          {tr('prayer_fajr', language)} {formatTime('04:52', language, app.timeFormat)} · {tr('prayer_maghrib', language)}{' '}
          {formatTime('18:10', language, app.timeFormat)}
        </Text>
      </Card>

      <SectionTitle>{tr('settings_calc_method', language)}</SectionTitle>
      <TouchableOpacity onPress={() => router.push('/prayer/methods')}>
        <Card className="p-4 mb-4 flex-row items-center justify-between">
          <Text className="font-body-medium text-sm text-ink-900 dark:text-white capitalize">{method}</Text>
          <Ionicons name="chevron-forward" size={16} color="#7d879a" />
        </Card>
      </TouchableOpacity>

      <SectionTitle>{tr('settings_location', language)}</SectionTitle>
      <TouchableOpacity onPress={() => setPickerVisible(true)}>
        <Card className="p-4 flex-row items-center justify-between">
          <View>
            <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{location.name}</Text>
            {location.division ? <Text className="font-body text-xs text-ink-400 mt-0.5">{location.division}</Text> : null}
            <Text className="font-body text-xs text-ink-400 mt-0.5">
              {localDigits(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`, language)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#7d879a" />
        </Card>
      </TouchableOpacity>

      <LocationPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} />
    </Screen>
  );
}
