import React, { useSyncExternalStore } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { isRestartPending, subscribeRestartPending } from '../lib/platform/direction';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

/** Persistent notice shown after switching between left-to-right and right-to-left languages. */
export function RestartBanner() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const pending = useSyncExternalStore(subscribeRestartPending, isRestartPending, isRestartPending);
  if (!pending) return null;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.line, bottom: insets.bottom + 8 }]}
    >
      <AppText variant="small">{t('language.restart')}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', start: 16, end: 16, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12 },
});
