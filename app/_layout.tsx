import React, { Component, useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { getLocales } from 'expo-localization';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18n, { initI18n, resolveLanguage } from '@/lib/i18n';
import type { Lang } from '@/lib/model';
import { appStore, importLegacyIfNeeded, useAppStore, waitForHydration } from '@/lib/store';
import { applyDirection } from '@/lib/platform/direction';
import { pauseIfPermissionRevoked, rescheduleFromStore } from '@/lib/platform/notify';
import { startMilestoneWatcher } from '@/lib/milestoneWatcher';
import { AppThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { FONT_ASSETS } from '@/theme/fonts';
import { AppText, Button, RestartBanner, ToastHost } from '@/components';

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

function Shell() {
  const router = useRouter();
  const segments = useSegments();
  const { scheme } = useTheme();
  const profile = useAppStore((s) => s.profile);
  const language = useAppStore((s) => s.settings.language);

  const firstLang = useRef(true);
  useEffect(() => {
    if (firstLang.current) {
      firstLang.current = false;
      return;
    }
    void initI18n(resolveLanguage(language, deviceCodes())).then(() => rescheduleFromStore());
  }, [language]);

  // Re-plan notifications at launch, on return to the foreground, and when a relevant setting changes.
  const reminders = useAppStore((s) => s.settings.reminders);
  const location = useAppStore((s) => s.settings.location);
  const calcMethod = useAppStore((s) => s.settings.calcMethod);
  const madhab = useAppStore((s) => s.settings.madhab);
  const firstPlan = useRef(true); // launch is handled by check() below
  useEffect(() => {
    if (firstPlan.current) {
      firstPlan.current = false;
      return;
    }
    void rescheduleFromStore();
  }, [reminders, location, calcMethod, madhab]);
  useEffect(() => {
    const check = () => {
      void pauseIfPermissionRevoked().then((paused) => (paused ? undefined : rescheduleFromStore()));
    };
    check();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') check();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => startMilestoneWatcher(), []);

  useEffect(() => {
    const inOnboarding = segments[0] === '(onboarding)';
    if (profile === null && !inOnboarding) router.replace('/(onboarding)');
    else if (profile !== null && inOnboarding) router.replace('/(tabs)');
  }, [profile, segments, router]);

  return (
    <>
      <RestartBanner />
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

type Boot = 'loading' | 'unhydrated' | 'ready';

async function safeInitI18n(pref: Lang | null): Promise<void> {
  try {
    await initI18n(resolveLanguage(pref, deviceCodes()));
  } catch {
    // keep going; the fallback below shows English text
  }
}

async function boot(): Promise<Boot> {
  if (!(await waitForHydration())) {
    await safeInitI18n(null);
    return 'unhydrated';
  }
  await importLegacyIfNeeded();
  const pref = appStore.getState().settings.language;
  await safeInitI18n(pref);
  // Guards a direction mismatch after a restore/import or an interrupted switch (once per launch).
  await applyDirection(resolveLanguage(pref, deviceCodes())).catch(() => 'unchanged');
  return 'ready';
}

// Last-resort English strings for when i18n could not initialize.
const FALLBACK = { storage: 'We could not open your saved data.', retry: 'Try again' };

function StorageUnavailable({ onRetry, busy }: { onRetry: () => void; busy: boolean }) {
  const { colors } = useTheme();
  const ok = i18n.isInitialized;
  return (
    <View style={[styles.center, { backgroundColor: colors.bg }]}>
      <AppText variant="body" style={styles.message}>{ok ? i18n.t('errors.storage') : FALLBACK.storage}</AppText>
      <Button label={ok ? i18n.t('common.retry') : FALLBACK.retry} onPress={onRetry} disabled={busy} />
    </View>
  );
}

function Root() {
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);
  const [state, setState] = useState<Boot>('loading');
  const [retrying, setRetrying] = useState(false);
  const mounted = useRef(true);
  const inFlight = useRef(false);

  useEffect(() => {
    mounted.current = true;
    boot()
      .then((b) => mounted.current && setState(b))
      .catch(() => mounted.current && setState('unhydrated'));
    return () => {
      mounted.current = false;
    };
  }, []);

  const retry = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setRetrying(true);
    try {
      await appStore.persist.rehydrate();
      const next = await boot();
      if (mounted.current) setState(next);
    } catch {
      if (mounted.current) setState('unhydrated');
    } finally {
      inFlight.current = false;
      if (mounted.current) setRetrying(false);
    }
  }, []);

  const fontsDone = fontsLoaded || fontError !== null;
  useEffect(() => {
    if (state !== 'loading' && fontsDone) SplashScreen.hideAsync().catch(() => {});
  }, [state, fontsDone]);

  if (state === 'loading' || !fontsDone) return null;
  return (
    <I18nextProvider i18n={i18n}>
      <AppThemeProvider>
        <ErrorBoundary>
          {state === 'ready' ? <Shell /> : <StorageUnavailable onRetry={retry} busy={retrying} />}
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
