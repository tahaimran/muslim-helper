import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../AppText';

export type PrayerTimeRow = { key: string; label: string; time: string; isNext: boolean };

export type PrayerTimesListProps = {
  rows: PrayerTimeRow[];
  /** Shown beneath the list, e.g. the high-latitude estimate caption. */
  note?: string;
  /** Spoken suffix for the highlighted row, e.g. "next". */
  nextLabel: string;
};

/** Today's prayer times as a quiet list; the upcoming prayer is highlighted. */
export function PrayerTimesList({ rows, note, nextLabel }: PrayerTimesListProps) {
  const { colors } = useTheme();
  return (
    <View>
      {rows.map((r) => (
        <View
          key={r.key}
          accessible
          accessibilityLabel={`${r.label}, ${r.time}${r.isNext ? `, ${nextLabel}` : ''}`}
          style={[
            styles.row,
            { borderBottomColor: colors.line, backgroundColor: r.isNext ? colors.surface : 'transparent' },
          ]}
        >
          <AppText variant="body" weight={r.isNext ? 'medium' : 'regular'} color={r.isNext ? colors.accent : undefined} style={styles.label}>
            {r.label}
          </AppText>
          <AppText variant="body" weight={r.isNext ? 'medium' : 'regular'} color={r.isNext ? colors.accent : undefined}>
            {r.time}
          </AppText>
        </View>
      ))}
      {note ? <AppText variant="caption" muted style={styles.note}>{note}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderRadius: 8,
  },
  label: { flex: 1 },
  note: { marginTop: 8 },
});
