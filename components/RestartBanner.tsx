import React, { useSyncExternalStore } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { isRestartPending, subscribeRestartPending } from '@/lib/platform/direction';
import { useTheme } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

/** Persistent notice shown after switching between left-to-right and right-to-left languages. */
export function RestartBanner() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const pending = useSyncExternalStore(subscribeRestartPending, isRestartPending, isRestartPending);
  if (!pending) return null;
  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + 4 }]}>
      <View
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.line }]}
      >
        <AppText variant="small">{t('language.restart')}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', start: 16, end: 16, zIndex: 10 },
  bar: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
});
