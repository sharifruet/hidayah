import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../../components/ui/Screen';
import { Card } from '../../../../components/ui/Card';
import { JamahTimesFields } from '../../../../components/masjid/JamahTimesFields';
import { useApp } from '../../../../context/AppContext';
import { tr } from '../../../../data/translations';
import { getCurrentCoords, reverseGeocode } from '../../../../lib/geocoding';
import { masjidsService, type Masjid } from '../../../../lib/services/masjids';
import { jamahFormIsValid, jamahFormToTimes, jamahToForm } from '../../../../lib/masjid';
import { Palette } from '../../../../constants/theme';

const inputCls = 'font-body text-base text-ink-900 dark:text-white bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3 py-2.5';
const labelCls = 'font-body-medium text-xs text-ink-500 dark:text-ink-400 mb-1 mt-3';

function Field({ label, value, onChangeText, ...rest }: { label: string; value: string; onChangeText: (t: string) => void } & React.ComponentProps<typeof TextInput>) {
  return (
    <>
      <Text className={labelCls}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholderTextColor="#7d879a" className={inputCls} {...rest} />
    </>
  );
}

export default function AddMasjidScreen() {
  const { language } = useApp();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [jamah, setJamah] = useState(jamahToForm());
  const [locating, setLocating] = useState(false);
  const [validationError, setValidationError] = useState('');

  const lat = parseFloat(latInput);
  const lng = parseFloat(lngInput);
  const coordsValid = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

  async function locateMe() {
    setLocating(true);
    try {
      const coords = await getCurrentCoords();
      if (coords) {
        setLatInput(coords.lat.toFixed(6));
        setLngInput(coords.lng.toFixed(6));
        setValidationError('');
        // Pre-fill city/district from the OS geocoder if the user hasn't typed them
        const place = await reverseGeocode(coords.lat, coords.lng);
        if (!city && place.name && place.name !== 'Current location') setCity(place.name);
        if (!district && place.district) setDistrict(place.district);
      }
    } finally {
      setLocating(false);
    }
  }

  const mutation = useMutation({
    mutationFn: () =>
      masjidsService.create({
        name: name.trim(),
        name_bn: nameBn.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        district: district.trim() || undefined,
        phone: phone.trim() || undefined,
        description: description.trim() || undefined,
        latitude: lat,
        longitude: lng,
        jamah: jamahFormToTimes(jamah),
      }),
    onSuccess: (created: Masjid) => {
      queryClient.invalidateQueries({ queryKey: ['masjids'] });
      router.replace(`/more/masjids/${created.id}` as never);
    },
  });

  function submit() {
    if (name.trim().length < 2) return setValidationError(tr('masjid_name_required', language));
    if (!coordsValid) return setValidationError(tr('masjid_coords_required', language));
    if (!jamahFormIsValid(jamah)) return setValidationError(tr('masjid_jamah_invalid', language));
    setValidationError('');
    mutation.mutate();
  }

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-1">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('masjid_new_title', language)}</Text>
      </View>
      <Text className="font-body text-sm text-ink-400 mb-4 ml-9">{tr('masjid_new_subtitle', language)}</Text>

      {/* Location */}
      <Card className="p-4 mb-4">
        <Text className="font-body-semibold text-sm text-ink-900 dark:text-white mb-2">{tr('masjid_field_coords', language)} *</Text>
        <TouchableOpacity
          onPress={locateMe}
          disabled={locating}
          className={`flex-row items-center rounded-xl px-3 py-3 ${coordsValid ? 'bg-primary-50 dark:bg-primary-900/30' : 'bg-primary-600'}`}
        >
          {locating ? (
            <ActivityIndicator size="small" color={coordsValid ? Palette.primary[600] : '#fff'} />
          ) : (
            <Ionicons name={coordsValid ? 'checkmark-circle' : 'locate'} size={18} color={coordsValid ? Palette.primary[600] : '#fff'} />
          )}
          <Text className={`font-body-medium text-sm ml-2 ${coordsValid ? 'text-primary-700 dark:text-primary-300' : 'text-white'}`}>
            {locating
              ? tr('masjids_locating', language)
              : coordsValid
                ? `${tr('masjid_location_set', language)} · ${lat.toFixed(5)}, ${lng.toFixed(5)}`
                : tr('masjids_use_my_location', language)}
          </Text>
        </TouchableOpacity>

        <Text className="font-body text-xs text-ink-400 mt-3 mb-1">{tr('masjid_coords_hint', language)}</Text>
        <View className="flex-row -mx-1">
          <View className="flex-1 px-1">
            <TextInput
              value={latInput} onChangeText={setLatInput} placeholder="Latitude" placeholderTextColor="#7d879a"
              keyboardType="numbers-and-punctuation" className={inputCls}
            />
          </View>
          <View className="flex-1 px-1">
            <TextInput
              value={lngInput} onChangeText={setLngInput} placeholder="Longitude" placeholderTextColor="#7d879a"
              keyboardType="numbers-and-punctuation" className={inputCls}
            />
          </View>
        </View>
      </Card>

      {/* Details */}
      <Card className="p-4 mb-4">
        <Field label={`${tr('masjid_field_name', language)} *`} value={name} onChangeText={setName} autoCapitalize="words" maxLength={200} />
        <Field label={tr('masjid_field_name_bn', language)} value={nameBn} onChangeText={setNameBn} maxLength={200} />
        <Field label={tr('masjid_field_address', language)} value={address} onChangeText={setAddress} maxLength={400} />
        <View className="flex-row -mx-1">
          <View className="flex-1 px-1">
            <Field label={tr('masjid_field_city', language)} value={city} onChangeText={setCity} maxLength={100} />
          </View>
          <View className="flex-1 px-1">
            <Field label={tr('masjid_field_district', language)} value={district} onChangeText={setDistrict} maxLength={100} />
          </View>
        </View>
        <Field label={tr('masjid_field_phone', language)} value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={40} />
        <Field label={tr('masjid_field_description', language)} value={description} onChangeText={setDescription} multiline numberOfLines={3} maxLength={2000} style={{ minHeight: 72, textAlignVertical: 'top' }} />
      </Card>

      {/* Jamah */}
      <Card className="p-4 mb-4">
        <Text className="font-body-semibold text-sm text-ink-900 dark:text-white mb-3">{tr('masjid_jamah_optional', language)}</Text>
        <JamahTimesFields value={jamah} onChange={setJamah} />
        <Text className="font-body text-[11px] text-ink-400">{tr('masjid_jamah_hint', language)}</Text>
      </Card>

      {validationError ? <Text className="font-body text-sm text-red-500 mb-3">{validationError}</Text> : null}
      {mutation.isError ? (
        <Text className="font-body text-sm text-red-500 mb-3">
          {(mutation.error as { message?: string })?.message ?? tr('error_generic', language)}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={submit}
        disabled={mutation.isPending}
        className="bg-primary-600 rounded-xl py-3.5 items-center flex-row justify-center mb-8"
      >
        {mutation.isPending ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="add-circle" size={18} color="#fff" />}
        <Text className="font-body-semibold text-sm text-white ml-2">
          {mutation.isPending ? tr('masjid_submitting', language) : tr('masjid_submit', language)}
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}
