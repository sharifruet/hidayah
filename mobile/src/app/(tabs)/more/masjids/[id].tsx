import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../../components/ui/Screen';
import { Card } from '../../../../components/ui/Card';
import { JamahTimesFields } from '../../../../components/masjid/JamahTimesFields';
import { useApp } from '../../../../context/AppContext';
import { fmt, tr } from '../../../../data/translations';
import { formatTime, localDigits } from '../../../../lib/format';
import { masjidsService, JAMAH_PRAYERS, type Masjid } from '../../../../lib/services/masjids';
import { localPrayerTimes } from '../../../../lib/prayerCalc';
import {
  absoluteTime, directionsUrl, formatDistance, jamahFormIsValid, jamahFormToUpdate,
  jamahToForm, minutesBetween, prayerLabel, relativeTime,
} from '../../../../lib/masjid';
import { Palette } from '../../../../constants/theme';
import { myMasjidName, toMyMasjid } from '../../../../lib/myMasjid';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { userErrorMessage } from '../../../../lib/errors';

export default function MasjidDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { location, method, language, timeFormat, myMasjid, setMyMasjid } = useApp();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(jamahToForm());
  const [formError, setFormError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const coords = { lat: location.lat, lng: location.lng };
  const queryKey = ['masjid', id, coords.lat, coords.lng];

  const { data: masjid, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey,
    queryFn: () => masjidsService.get(id, coords),
  });

  const isMine = !!masjid && myMasjid?.id === masjid.id;

  // Keep the saved "my masjid" copy (used by jamah reminders) in step with what's shown.
  useEffect(() => {
    if (masjid && myMasjid?.id === masjid.id && JSON.stringify(masjid.jamah) !== JSON.stringify(myMasjid.jamah)) {
      setMyMasjid(toMyMasjid(masjid));
    }
  }, [masjid, myMasjid, setMyMasjid]);

  const today = format(new Date(), 'yyyy-MM-dd');
  const prayerTimes = masjid ? localPrayerTimes(masjid.latitude, masjid.longitude, today, method) : undefined;

  const mutation = useMutation({
    mutationFn: () => masjidsService.updateJamah(id, jamahFormToUpdate(form)),
    onSuccess: (updated: Masjid) => {
      queryClient.setQueryData(queryKey, updated);
      queryClient.invalidateQueries({ queryKey: ['masjids'] });
      setEditing(false);
      setSavedMsg(tr('masjid_saved', language));
      setTimeout(() => setSavedMsg(''), 4000);
    },
  });

  function startEditing() {
    setForm(jamahToForm(masjid?.jamah));
    setEditing(true);
    setSavedMsg('');
    setFormError('');
    mutation.reset();
  }

  function save() {
    if (!jamahFormIsValid(form)) {
      setFormError(tr('masjid_jamah_invalid', language));
      return;
    }
    setFormError('');
    mutation.mutate();
  }

  const notFound = isError && (error as { status?: number })?.status === 404;

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-lg text-ink-900 dark:text-white flex-1" numberOfLines={1}>
          {masjid ? myMasjidName(masjid, language) : tr('more_masjids', language)}
        </Text>
      </View>

      {isLoading ? <Text className="font-body text-sm text-ink-400">{tr('loading', language)}</Text> : null}
      {isError ? (
        notFound ? (
          <Text className="font-body text-sm text-ink-500">{tr('masjid_not_found', language)}</Text>
        ) : (
          <ErrorState error={error} onRetry={refetch} retrying={isRefetching} />
        )
      ) : null}

      {masjid ? (
        <>
          {/* Header card */}
          <Card className="p-4 mb-4">
            <View className="flex-row items-start">
              <View className="w-11 h-11 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
                <Ionicons name="business" size={20} color={Palette.primary[500]} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="font-body-bold text-base text-ink-900 dark:text-white">{masjid.name}</Text>
                {masjid.name_bn && masjid.name_bn !== masjid.name ? (
                  <Text className="font-body text-sm text-ink-500 dark:text-ink-400">{masjid.name_bn}</Text>
                ) : null}
                {masjid.address || masjid.city || masjid.district ? (
                  <Text className="font-body text-xs text-ink-400 mt-1">
                    {[masjid.address, masjid.city, masjid.district].filter(Boolean).join(', ')}
                  </Text>
                ) : null}
                <Text className="font-body text-[11px] text-ink-300 dark:text-ink-600 mt-1">
                  {localDigits(`${masjid.latitude.toFixed(5)}, ${masjid.longitude.toFixed(5)}`, language)}
                  {masjid.distance_km != null ? ` · ${formatDistance(masjid.distance_km, language)} ${tr('masjids_away', language)}` : ''}
                </Text>
              </View>
            </View>

            {masjid.description ? (
              <Text className="font-body text-sm text-ink-600 dark:text-ink-300 mt-3 leading-relaxed">{masjid.description}</Text>
            ) : null}

            <View className="flex-row mt-4">
              <TouchableOpacity
                onPress={() => Linking.openURL(directionsUrl(masjid.latitude, masjid.longitude))}
                className="flex-1 flex-row items-center justify-center bg-primary-600 rounded-xl py-2.5"
              >
                <Ionicons name="navigate" size={15} color="#fff" />
                <Text className="font-body-semibold text-sm text-white ml-2">{tr('masjid_directions', language)}</Text>
              </TouchableOpacity>
              {masjid.phone ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${masjid.phone}`)}
                  className="flex-row items-center justify-center bg-ink-50 dark:bg-ink-800 rounded-xl px-4 py-2.5 ml-2"
                >
                  <Ionicons name="call-outline" size={15} color={Palette.ink[500]} />
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => setMyMasjid(isMine ? null : toMyMasjid(masjid))}
              className={`flex-row items-center justify-center rounded-xl py-2.5 mt-2 border ${
                isMine ? 'bg-gold-500/10 border-gold-500/40' : 'border-ink-200 dark:border-ink-700'
              }`}
            >
              <Ionicons name={isMine ? 'star' : 'star-outline'} size={15} color={isMine ? '#c99a45' : Palette.ink[500]} />
              <Text className={`font-body-semibold text-sm ml-2 ${isMine ? 'text-gold-600 dark:text-gold-400' : 'text-ink-700 dark:text-ink-200'}`}>
                {isMine ? `${tr('my_masjid_is', language)} · ${tr('my_masjid_remove', language)}` : tr('my_masjid_set', language)}
              </Text>
            </TouchableOpacity>
            {isMine ? (
              <Text className="font-body text-[11px] text-ink-400 mt-1.5 text-center">{tr('my_masjid_reminders_hint', language)}</Text>
            ) : null}

            <Text className="font-body text-[10px] text-ink-300 dark:text-ink-600 mt-3">
              {tr('masjid_added_on', language)} {relativeTime(masjid.created_at, language)}
            </Text>
          </Card>

          {/* Jamah times */}
          <Card className="p-4 mb-4">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1 mr-2">
                <Text className="font-body-semibold text-base text-ink-900 dark:text-white">{tr('masjid_jamah_times', language)}</Text>
                {masjid.jamah_updated_at ? (
                  <Text className="font-body text-xs text-ink-400 mt-0.5">
                    {tr('masjid_last_updated', language)}:{' '}
                    <Text className="font-body-medium text-ink-600 dark:text-ink-300">{relativeTime(masjid.jamah_updated_at, language)}</Text>
                    {'\n'}
                    <Text className="text-ink-300 dark:text-ink-600">{absoluteTime(masjid.jamah_updated_at, language, timeFormat)}</Text>
                  </Text>
                ) : null}
              </View>
              {!editing ? (
                <TouchableOpacity onPress={startEditing} className="flex-row items-center bg-ink-50 dark:bg-ink-800 rounded-full px-3 py-1.5">
                  <Ionicons name="create-outline" size={14} color={Palette.ink[500]} />
                  <Text className="font-body-medium text-xs text-ink-600 dark:text-ink-300 ml-1">
                    {Object.keys(masjid.jamah).length ? tr('masjid_update_jamah', language) : tr('masjid_add_jamah', language)}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {savedMsg ? (
              <View className="bg-primary-50 dark:bg-primary-900/30 rounded-lg px-3 py-2 mb-3">
                <Text className="font-body-medium text-xs text-primary-700 dark:text-primary-300">{savedMsg}</Text>
              </View>
            ) : null}

            {editing ? (
              <>
                <JamahTimesFields value={form} onChange={setForm} disabled={mutation.isPending} />
                <Text className="font-body text-[11px] text-ink-400 mb-3">{tr('masjid_jamah_hint', language)}</Text>
                {formError ? <Text className="font-body text-xs text-red-500 mb-2">{formError}</Text> : null}
                {mutation.isError ? (
                  <Text className="font-body text-xs text-red-500 mb-2">
                    {userErrorMessage(mutation.error, language)}
                  </Text>
                ) : null}
                <View className="flex-row justify-end">
                  <TouchableOpacity
                    onPress={() => { setEditing(false); setForm(jamahToForm(masjid.jamah)); }}
                    disabled={mutation.isPending}
                    className="px-4 py-2.5 mr-2"
                  >
                    <Text className="font-body-medium text-sm text-ink-500">{tr('cancel', language)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={save}
                    disabled={mutation.isPending}
                    className="flex-row items-center bg-primary-600 rounded-xl px-5 py-2.5"
                  >
                    {mutation.isPending ? <ActivityIndicator size="small" color="#fff" /> : null}
                    <Text className="font-body-semibold text-sm text-white ml-1">
                      {mutation.isPending ? tr('masjid_saving', language) : tr('masjid_save', language)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : Object.keys(masjid.jamah).length > 0 ? (
              <>
                <View className="flex-row pb-2 border-b border-ink-100 dark:border-ink-800">
                  <Text className="flex-1 font-body-medium text-[10px] uppercase text-ink-400">{tr('nav_prayer', language)}</Text>
                  <Text className="w-16 text-right font-body-medium text-[10px] uppercase text-ink-400">{tr('masjid_adhan', language)}</Text>
                  <Text className="w-24 text-right font-body-medium text-[10px] uppercase text-ink-400">{tr('masjid_jamah', language)}</Text>
                </View>
                {JAMAH_PRAYERS.map((p) => {
                  const jamah = masjid.jamah[p];
                  // Jumu'ah replaces Dhuhr on Fridays; compare against Dhuhr's adhan
                  const adhan = prayerTimes?.times?.[p === 'jumuah' ? 'dhuhr' : p];
                  const delta = minutesBetween(adhan, jamah);
                  return (
                    <View key={p} className={`flex-row items-center py-2.5 border-b border-ink-50 dark:border-ink-800/60 ${jamah ? '' : 'opacity-40'}`}>
                      <Text className="flex-1 font-body-medium text-sm text-ink-900 dark:text-white">{prayerLabel(p, language)}</Text>
                      <Text className="w-16 text-right font-body text-sm text-ink-400">{adhan ? formatTime(adhan, language, timeFormat, { withPeriod: false }) : '—'}</Text>
                      <View className="w-24 flex-row items-baseline justify-end">
                        <Text className="font-body-bold text-sm text-ink-900 dark:text-white">{jamah ? formatTime(jamah, language, timeFormat, { withPeriod: false }) : '—'}</Text>
                        {delta != null && delta >= 0 ? (
                          <Text className="font-body text-[10px] text-ink-400 ml-1">+{fmt('minutes_abbr', language, { n: delta })}</Text>
                        ) : null}
                      </View>
                    </View>
                  );
                })}
                <Text className="font-body text-[10px] text-ink-300 dark:text-ink-600 mt-3">{tr('masjid_adhan_note', language)}</Text>
              </>
            ) : (
              <Text className="font-body text-sm text-ink-400 italic">{tr('masjid_no_jamah', language)}</Text>
            )}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}
