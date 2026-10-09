import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MOODS } from '../../lib/model';
import type { MoodType } from '../../lib/types';
import { Chip } from '../Chip';

export type MoodPickerProps = {
  value: MoodType | null;
  onChange: (m: MoodType | null) => void;
  labels: Record<MoodType, string>;
};

/** Five mood chips; tapping the selected one clears it. */
export function MoodPicker({ value, onChange, labels }: MoodPickerProps) {
  return (
    <View style={styles.row}>
      {MOODS.map((m) => (
        <Chip key={m} label={labels[m]} selected={value === m} onPress={() => onChange(value === m ? null : m)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
