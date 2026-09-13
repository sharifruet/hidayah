import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';

import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';
import { qiblaBearing } from '../../../lib/prayerMath';
import { KAABA_COORDS } from '../../../lib/constants';
import { tr } from '../../../data/translations';

export default function QiblaScreen() {
  const { location, language } = useApp();
  const [heading, setHeading] = useState<number | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const bearing = qiblaBearing(location.lat, location.lng, KAABA_COORDS.lat, KAABA_COORDS.lng);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      subscription = await Location.watchHeadingAsync((h) => {
        setHeading(h.trueHeading >= 0 ? h.trueHeading : h.magHeading);
      });
    })();
    return () => subscription?.remove();
  }, []);

  const relativeAngle = heading != null ? bearing - heading : bearing;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: relativeAngle,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [relativeAngle, rotation]);

  const rotateStr = rotation.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const aligned = heading != null && Math.abs(((relativeAngle + 540) % 360) - 180) < 5;

  return (
    <Screen scroll={false}>
      <View className="flex-row items-center mt-4 mb-2 px-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('qibla_title', language)}</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        {permissionDenied ? (
          <Text className="font-body text-sm text-ink-500 text-center">
            {tr('qibla_permission_note', language)}
          </Text>
        ) : (
          <>
            <View className="w-64 h-64 rounded-full border-4 border-ink-100 dark:border-ink-800 items-center justify-center mb-8">
              <Animated.View
                style={{ transform: [{ rotate: rotateStr }] }}
                className="w-full h-full items-center justify-center"
              >
                <View className="absolute top-2 items-center">
                  <Ionicons name="triangle" size={28} color={aligned ? '#22a06d' : '#c99a45'} />
                </View>
                <View className="w-12 h-12 rounded-full bg-primary-600 items-center justify-center">
                  <Ionicons name="business" size={20} color="#fff" />
                </View>
              </Animated.View>
            </View>

            <Text className={`font-body-bold text-lg ${aligned ? 'text-primary-600' : 'text-ink-900 dark:text-white'}`}>
              {aligned ? tr('qibla_facing', language) : tr('qibla_rotate', language)}
            </Text>
            <Text className="font-body text-sm text-ink-400 mt-1">
              {tr('qibla_bearing', language)}: {bearing.toFixed(0)}° {tr('qibla_from_north', language)}
            </Text>
            {heading == null ? (
              <Text className="font-body text-xs text-ink-400 mt-2">{tr('qibla_calibrating', language)}</Text>
            ) : null}
          </>
        )}
      </View>
    </Screen>
  );
}
