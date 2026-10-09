import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export function Chip({ label, selected, onPress, accessibilityLabel }: { label: string; selected: boolean; onPress: () => void; accessibilityLabel?: string }) {
  const { colors } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        { backgroundColor: selected ? colors.accent : 'transparent', borderColor: selected ? colors.accent : colors.line },
      ]}
    >
      <AppText variant="small" weight="medium" color={selected ? colors.onAccent : colors.text}>{label}</AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44, minWidth: 44, borderRadius: 999, borderWidth: 1,
    paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center',
  },
});
