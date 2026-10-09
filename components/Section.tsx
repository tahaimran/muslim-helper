import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export type SectionProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: { label: string; onPress: () => void };
};

export function Section({ title, subtitle, children, action }: SectionProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      {title || action ? (
        <View style={styles.header}>
          <View style={styles.titles}>
            {title ? <AppText variant="heading" accessibilityRole="header">{title}</AppText> : null}
            {subtitle ? <AppText variant="small" muted>{subtitle}</AppText> : null}
          </View>
          {action ? (
            <PressableScale onPress={action.onPress} accessibilityRole="button" accessibilityLabel={action.label} style={styles.action}>
              <AppText variant="small" weight="medium" color={colors.accent}>{action.label}</AppText>
            </PressableScale>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  titles: { flex: 1 },
  action: { minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'flex-end', paddingStart: 12 },
});
