import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { getLocales } from 'expo-localization';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18n, { initI18n, resolveLanguage } from '@/lib/i18n';
import { appStore, importLegacyIfNeeded, useAppStore, waitForHydration } from '@/lib/store';
import { startMilestoneWatcher } from '@/lib/milestoneWatcher';
import { AppThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { FONT_ASSETS } from '@/theme/fonts';
import { AppText, Button, ToastHost, showToast } from '@/components';

SplashScreen.preventAutoHideAsync().catch(() => {});

const deviceCodes = () => getLocales().map((l) => l.languageCode);

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.bg }]}>
      <AppText variant="body" style={styles.message}>{i18n.t('errors.generic')}</AppText>
      <Button label={i18n.t('common.retry')} onPress={onRetry} />
    </View>
  );
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />;
  }
}

function Shell({ hydrated }: { hydrated: boolean }) {
  const router = useRouter();
  const segments = useSegments();
  const { scheme } = useTheme();
  const profile = useAppStore((s) => s.profile);
  const language = useAppStore((s) => s.settings.language);

  useEffect(() => {
    if (!hydrated) showToast(i18n.t('errors.storage'), 'error');
  }, [hydrated]);

  useEffect(() => {
    void initI18n(resolveLanguage(language, deviceCodes()));
  }, [language]);

  useEffect(() => startMilestoneWatcher(), []);

  useEffect(() => {
    const inOnboarding = segments[0] === '(onboarding)';
    if (profile === null && !inOnboarding) router.replace('/(onboarding)');
    else if (profile !== null && inOnboarding) router.replace('/(tabs)');
  }, [profile, segments, router]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <ToastHost />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

function Root() {
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const ok = await waitForHydration();
      await importLegacyIfNeeded();
      await initI18n(resolveLanguage(appStore.getState().settings.language, deviceCodes()));
      if (!active) return;
      setHydrated(ok);
      setReady(true);
    })().catch(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const fontsDone = fontsLoaded || fontError !== null;
  useEffect(() => {
    if (ready && fontsDone) SplashScreen.hideAsync().catch(() => {});
  }, [ready, fontsDone]);

  if (!ready || !fontsDone) return null;
  return (
    <I18nextProvider i18n={i18n}>
      <AppThemeProvider>
        <ErrorBoundary>
          <Shell hydrated={hydrated} />
        </ErrorBoundary>
      </AppThemeProvider>
    </I18nextProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  message: { textAlign: 'center' },
});
