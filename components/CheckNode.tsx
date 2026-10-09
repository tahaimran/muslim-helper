import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PressableScale } from './PressableScale';

export type CheckNodeProps = { checked: boolean; onPress: () => void; label: string; size?: number };

export function CheckNode({ checked, onPress, label, size = 28 }: CheckNodeProps) {
  const { colors } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      style={styles.hit}
    >
      <View
        style={[
          { width: size, height: size, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
          checked ? { backgroundColor: colors.accent } : { borderWidth: 2, borderColor: colors.line, backgroundColor: colors.bg },
        ]}
      >
        {checked ? <Check size={Math.round(size * 0.6)} color={colors.onAccent} strokeWidth={3} /> : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({ hit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' } });
