import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

export type ToastKind = 'info' | 'error';
type ToastEvent = { id: number; message: string; kind: ToastKind };

let nextId = 1;
const listeners = new Set<(t: ToastEvent) => void>();

/** Show a toast. The caller passes an already-localized message. */
export function showToast(message: string, kind: ToastKind = 'info'): void {
  const evt = { id: nextId++, message, kind };
  listeners.forEach((l) => l(evt));
}

export function ToastHost() {
  const { colors, reduceMotion } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastEvent | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const l = (t: ToastEvent) => {
      setToast(t);
      // Android announces via the live region below; announcing here too would double-read.
      if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(t.message);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), 3000);
    };
    listeners.add(l);
    return () => {
      listeners.delete(l);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!toast) return null;
  return (
    <View style={[styles.host, { bottom: insets.bottom + 96 }]}>
      <Animated.View
        key={toast.id}
        entering={reduceMotion ? undefined : FadeInDown.duration(180)}
        exiting={reduceMotion ? undefined : FadeOut.duration(150)}
        accessibilityLiveRegion="polite"
        style={[styles.toast, { backgroundColor: colors.surface, borderColor: toast.kind === 'error' ? colors.danger : colors.line }]}
      >
        <AppText variant="small" color={toast.kind === 'error' ? colors.danger : colors.text}>{toast.message}</AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', start: 20, end: 20, alignItems: 'center', pointerEvents: 'none', zIndex: 1000, elevation: 1000 },
  toast: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 18, paddingVertical: 12, maxWidth: '100%' },
});
