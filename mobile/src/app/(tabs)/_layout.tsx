import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';
import { Palette } from '../../constants/theme';

export default function TabsLayout() {
  const { language } = useApp();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const activeColor = Palette.primary[500];
  const inactiveColor = isDark ? '#7d879a' : '#9aa3b2';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontFamily: 'InterMedium', fontSize: 11 },
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          // A fixed height overrides the navigator's inset-aware height while it still adds
          // insets.bottom as padding — so the system nav bar's inset must be added here too.
          height: Platform.select({ ios: 50, default: 64 }) + insets.bottom,
          paddingTop: 8,
          backgroundColor: Platform.OS === 'android' ? (isDark ? '#14171f' : '#ffffff') : 'transparent',
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={{ flex: 1 }}
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: isDark ? '#14171f' : '#ffffff' }} />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: tr('nav_home', language),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: tr('nav_quran', language),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: tr('nav_prayer', language),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'alarm' : 'alarm-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          title: tr('nav_duas', language),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'hand-left' : 'hand-left-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: tr('nav_more', language),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
