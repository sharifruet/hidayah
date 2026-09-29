import '../global.css';

import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';

import { AppProvider, useApp } from '../context/AppContext';
import { queryPersister, shouldPersistQuery, QUERY_PERSIST_MAX_AGE } from '../lib/queryPersist';
import { addNotificationResponseListener } from '../lib/notifications';
import { syncDuasIfDue } from '../lib/duasSync';
import { refreshMyMasjid } from '../lib/myMasjid';
import { syncNow } from '../lib/sync';
// Also defines the background reminder task, which must happen at module load.
import { registerReminderBackgroundTask, rescheduleReminders } from '../lib/reminders';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      // Offline-cached queries (Qur'an text, tafsir, books) should survive well
      // past a typical session so they're readable without a connection later.
      gcTime: QUERY_PERSIST_MAX_AGE,
    },
  },
});

function RootNavigation() {
  const app = useApp();
  const { darkMode, location, method, language, notificationsEnabled, prayerCheckInEnabled, ramadanRemindersEnabled, setMyMasjid } = app;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    SplashScreen.hideAsync();
  }, []);

  // Copy the du'a collection from the server into local storage on first
  // launch, then refresh it every DUAS_SYNC_INTERVAL_DAYS. Fire-and-forget:
  // the Du'a tab reads the local copy (or the bundled snapshot) meanwhile.
  useEffect(() => {
    syncDuasIfDue();
  }, []);

  // Pick up jamah-time edits made by others to the user's masjid (fire-and-forget; the
  // saved copy keeps reminders working offline meanwhile).
  useEffect(() => {
    refreshMyMasjid().then((fresh) => {
      if (fresh) setMyMasjid(fresh);
    });
  }, [setMyMasjid]);

  // Keep a week of reminders queued: on launch, whenever the app returns to the
  // foreground, and when a setting that affects them changes. The background task
  // covers stretches where the app isn't opened at all.
  useEffect(() => {
    rescheduleReminders();
  }, [
    location.lat, location.lng, location.name, method, language, notificationsEnabled, prayerCheckInEnabled,
    ramadanRemindersEnabled, app.adhanSound, app.fajrSoftAdhan, app.hijriOffset, app.islamicDayRemindersEnabled,
    app.sunnahFastRemindersEnabled, app.jamahRemindersEnabled, app.jamahLeadMinutes, app.jumuahReminderEnabled,
    app.myMasjid, app.timeFormat,
  ]);

  useEffect(() => {
    registerReminderBackgroundTask();
    // Optional backup: pull on launch/foreground, push when leaving the app. No-op unless
    // the user turned it on; failures (offline) are retried next time.
    syncNow().catch(() => {});
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') rescheduleReminders();
      if (state === 'active' || state === 'background') syncNow().catch(() => {});
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const sub = addNotificationResponseListener((response) => {
      const screen = String(response.notification.request.content.data?.screen ?? '');
      if (screen === 'prayer-tracker') router.push('/more/prayer-tracker' as never);
      else if (screen === 'islamic-days') router.push('/more/islamic-days' as never);
      else if (screen.startsWith('masjid:')) router.push(`/more/masjids/${screen.slice('masjid:'.length)}` as never);
    });
    return () => sub.remove();
  }, []);

  if (!ready) return null;

  return (
    <ThemeProvider value={darkMode ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
    Amiri: Amiri_400Regular,
    AmiriBold: Amiri_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: queryPersister,
            maxAge: QUERY_PERSIST_MAX_AGE,
            dehydrateOptions: { shouldDehydrateQuery: shouldPersistQuery },
          }}
        >
          <AppProvider>
            <RootNavigation />
          </AppProvider>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
