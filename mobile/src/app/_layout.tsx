import '../global.css';

import { useEffect, useState } from 'react';
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
  const { darkMode } = useApp();
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

  useEffect(() => {
    const sub = addNotificationResponseListener((response) => {
      const screen = response.notification.request.content.data?.screen;
      if (screen === 'prayer-tracker') router.push('/more/prayer-tracker' as never);
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
