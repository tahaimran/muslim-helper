import { useEffect, useState, Component, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, AppState } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { appStorage } from '@/lib/storage';
import { configureNotifications, syncNotifications } from '@/lib/notifications';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { useTheme, lightTheme } from '@/lib/theme';

configureNotifications();

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={ebStyles.container}>
          <Text style={ebStyles.title}>Something went wrong</Text>
          <Text style={ebStyles.message}>
            {this.state.error?.message || 'We apologize for the inconvenience. Please try restarting the app.'}
          </Text>
          <TouchableOpacity 
            style={ebStyles.button} 
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={ebStyles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const ebStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: lightTheme.cream, padding: 24 },
  title: { fontSize: 20, fontWeight: '700', color: lightTheme.darkText, marginBottom: 8 },
  message: { fontSize: 14, color: lightTheme.mediumText, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  button: { backgroundColor: lightTheme.mediumGreen, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

function RootLayoutInner() {
  useFrameworkReady();
  const router = useRouter();
  const segments = useSegments();
  const { colors, mode } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const isInitializing = useRef(false);

  useEffect(() => {
    const initialize = async () => {
      if (isInitializing.current) return;
      isInitializing.current = true;
      
      console.log('[RootLayout] Initializing...');
      try {
        const state = await appStorage.getState();
        const isOnboarded = state?.isOnboarded || false;
        
        console.log('[RootLayout] Status:', { isOnboarded, segments });

        const inAuthGroup = segments[0] === '(onboarding)';
        const inTabsGroup = segments[0] === '(tabs)';

        if (!isOnboarded && !inAuthGroup) {
          console.log('[RootLayout] Redirecting to onboarding');
          router.replace('/(onboarding)');
        } else if (isOnboarded && !inTabsGroup) {
          console.log('[RootLayout] Redirecting to tabs');
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('[RootLayout] Initialization error:', error);
      } finally {
        setIsReady(true);
        isInitializing.current = false;
      }
    };

    if (!isReady) {
      initialize();
    }
  }, [isReady, segments, router]);

  useEffect(() => {
    if (!isReady) return;
    syncNotifications();
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') syncNotifications();
    });
    return () => sub.remove();
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.cream }]}>
        <ActivityIndicator size="large" color={colors.mediumGreen} />
        <Text style={[styles.loadingText, { color: colors.mutedText }]}>Preparing your space...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RootLayoutInner />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, fontWeight: '500' },
});
