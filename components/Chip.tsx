import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  /** Part of a multi-select set: a toggle button. Otherwise one choice in a group (a radio). */
  multi?: boolean;
};

export function Chip({ label, selected, onPress, accessibilityLabel, multi = false }: ChipProps) {
  const { colors } = useTheme();
  const a11y = multi
    ? ({ accessibilityRole: 'button', accessibilityState: { selected } } as const)
    // aria-checked makes the state reach the web DOM as well.
    : ({ accessibilityRole: 'radio', accessibilityState: { checked: selected }, 'aria-checked': selected } as const);
  return (
    <PressableScale
      onPress={onPress}
      {...a11y}
      accessibilityLabel={accessibilityLabel ?? label}
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
