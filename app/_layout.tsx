import React, { Component, useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { getLocales } from 'expo-localization';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18n, { initI18n, resolveLanguage } from '@/lib/i18n';
import type { Lang } from '@/lib/model';
import { appStore, clearPersistedState, importLegacyIfNeeded, useAppStore, waitForHydration } from '@/lib/store';
import { applyDirection } from '@/lib/platform/direction';
import { pauseIfPermissionRevoked, rescheduleFromStore } from '@/lib/platform/notify';
import { startMilestoneWatcher } from '@/lib/milestoneWatcher';
import { AppThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { FONT_ASSETS } from '@/theme/fonts';
import { AppText, Button, RestartBanner, ToastHost } from '@/components';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Deep links into a modal (e.g. a web reload on /settings) still get the tabs underneath, so back works.
export const unstable_settings = { anchor: '(tabs)' };

const deviceCodes = () => getLocales().map((l) => l.languageCode);

/** On iOS, overlays must live in their own window to show above native modals. */
function TopOverlay({ children }: { children: React.ReactNode }) {
  return Platform.OS === 'ios' ? <FullWindowOverlay>{children}</FullWindowOverlay> : <>{children}</>;
}

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
    // Runs for every language change, wherever it came from (Settings, onboarding, a restored
    // backup), so the layout direction always follows. applyDirection is idempotent.
    const lang = resolveLanguage(language, deviceCodes());
    void initI18n(lang)
      .then(() => applyDirection(lang))
      .catch(() => 'unchanged')
      .then(() => rescheduleFromStore());
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <TopOverlay>
        <RestartBanner />
        <ToastHost />
      </TopOverlay>
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
const FALLBACK: Record<string, string> = {
  'errors.storage': 'We could not open your saved data.',
  'common.retry': 'Try again',
  'errors.startFresh': 'Start fresh',
  'errors.startFreshHint': 'Your saved data could not be opened. Starting fresh clears it and begins again.',
  'errors.startFreshConfirm': 'Tap again to clear your saved data',
  'errors.startFreshConfirmHint': 'This cannot be undone. It cancels by itself in a few seconds.',
};
const text = (key: string) => (i18n.isInitialized ? i18n.t(key) : FALLBACK[key] ?? key);

/** After this many failed retries, offer to clear the unreadable data and start again. */
const RETRIES_BEFORE_FRESH = 3;
const FRESH_CONFIRM_MS = 4000;

function StorageUnavailable({
  onRetry, onStartFresh, busy, failures,
}: { onRetry: () => void; onStartFresh: () => void; busy: boolean; failures: number }) {
  const { colors } = useTheme();
  const [confirming, setConfirming] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const onFresh = () => {
    if (!confirming) {
      setConfirming(true);
      timer.current = setTimeout(() => setConfirming(false), FRESH_CONFIRM_MS);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setConfirming(false);
    onStartFresh();
  };
  return (
    <View style={[styles.center, { backgroundColor: colors.bg }]}>
      <AppText variant="body" style={styles.message}>{text('errors.storage')}</AppText>
      <Button label={text('common.retry')} onPress={onRetry} disabled={busy} />
      {failures >= RETRIES_BEFORE_FRESH ? (
        <View style={styles.fresh} accessibilityLiveRegion="polite">
          <AppText variant="small" muted style={styles.message}>
            {text(confirming ? 'errors.startFreshConfirmHint' : 'errors.startFreshHint')}
          </AppText>
          <Button
            variant="destructive"
            label={text(confirming ? 'errors.startFreshConfirm' : 'errors.startFresh')}
            onPress={onFresh}
            disabled={busy}
          />
        </View>
      ) : null}
    </View>
  );
}

function Root() {
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);
  const [state, setState] = useState<Boot>('loading');
  const [retrying, setRetrying] = useState(false);
  const [failures, setFailures] = useState(0);
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

  const rebootWith = useCallback(async (prepare: () => Promise<void>) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setRetrying(true);
    let next: Boot = 'unhydrated';
    try {
      await prepare();
      await appStore.persist.rehydrate();
      next = await boot();
    } catch {
      next = 'unhydrated';
    } finally {
      inFlight.current = false;
      if (mounted.current) {
        setState(next);
        if (next !== 'ready') setFailures((n) => n + 1);
        setRetrying(false);
      }
    }
  }, []);
  const retry = useCallback(() => rebootWith(async () => {}), [rebootWith]);
  // Clears the unreadable saved state, then boots with a fresh one.
  const startFresh = useCallback(() => rebootWith(() => clearPersistedState()), [rebootWith]);

  const fontsDone = fontsLoaded || fontError !== null;
  useEffect(() => {
    if (state !== 'loading' && fontsDone) SplashScreen.hideAsync().catch(() => {});
  }, [state, fontsDone]);

  if (state === 'loading' || !fontsDone) return null;
  return (
    <I18nextProvider i18n={i18n}>
      <AppThemeProvider>
        <ErrorBoundary>
          {state === 'ready' ? <Shell /> : <StorageUnavailable onRetry={retry} onStartFresh={startFresh} busy={retrying} failures={failures} />}
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
  fresh: { marginTop: 24, alignItems: 'center', gap: 8 },
});
