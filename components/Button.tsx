import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { PressableScale } from './Pressable';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  icon?: React.ReactNode;
  accessibilityHint?: string;
};

export function Button({ label, onPress, variant = 'primary', disabled, icon, accessibilityHint }: ButtonProps) {
  const { colors } = useTheme();
  const bg = variant === 'primary' ? colors.accent : 'transparent';
  const fg = variant === 'primary' ? colors.onAccent : colors.accent;
  const border = variant === 'secondary' ? colors.line : 'transparent';
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={[styles.base, { backgroundColor: bg, borderColor: border, opacity: disabled ? 0.45 : 1 }]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <AppText variant="body" weight="medium" color={fg}>{label}</AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52, minWidth: 44, borderRadius: 14, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20,
  },
  icon: { marginEnd: 8 },
});
