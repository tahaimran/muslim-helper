import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  disabled?: boolean;
  /** Shows a spinner and blocks presses. */
  loading?: boolean;
  icon?: React.ReactNode;
  accessibilityHint?: string;
};

export function Button({ label, onPress, variant = 'primary', disabled, loading, icon, accessibilityHint }: ButtonProps) {
  const { colors } = useTheme();
  const bg = variant === 'primary' ? colors.accent : 'transparent';
  const fg = variant === 'primary' ? colors.onAccent : variant === 'destructive' ? colors.danger : colors.accent;
  const off = !!disabled || !!loading;
  const border = variant === 'secondary' || variant === 'destructive' ? colors.line : 'transparent';
  return (
    <PressableScale
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: off, busy: !!loading }}
      style={[styles.base, { backgroundColor: bg, borderColor: border, opacity: disabled ? 0.45 : 1 }]}
    >
      {loading ? <ActivityIndicator color={fg} style={styles.icon} /> : icon ? <View style={styles.icon}>{icon}</View> : null}
      <AppText variant="body" weight="medium" color={fg}>{label}</AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52, minWidth: 44, borderRadius: 14, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20,
  },
  icon: { marginEnd: 8 },
});
