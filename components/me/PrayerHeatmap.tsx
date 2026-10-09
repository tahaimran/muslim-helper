import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type PrayerHeatmapProps = {
  /** Oldest to newest; length should be a multiple of 7. */
  cells: { date: string; count: number }[];
  cellLabel: (date: string, count: number) => string;
};

const COLUMNS = 7;

/** 7 columns by N rows of square cells; opacity grows with prayers kept (0-5). */
export function PrayerHeatmap({ cells, cellLabel }: PrayerHeatmapProps) {
  const { colors } = useTheme();
  const rows: PrayerHeatmapProps['cells'][] = [];
  for (let i = 0; i < cells.length; i += COLUMNS) rows.push(cells.slice(i, i + COLUMNS));
  return (
    <View style={styles.grid} accessibilityRole="summary">
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: COLUMNS }, (_, c) => {
            const cell = row[c];
            if (!cell) return <View key={c} style={styles.cell} />;
            const filled = cell.count > 0;
            return (
              <View
                key={cell.date}
                accessible
                accessibilityLabel={cellLabel(cell.date, cell.count)}
                style={[
                  styles.cell,
                  filled
                    ? { backgroundColor: colors.accent, opacity: 0.25 + 0.15 * Math.min(5, cell.count) }
                    : { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, backgroundColor: colors.surface },
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 6 },
  row: { flexDirection: 'row', gap: 6 },
  cell: { flex: 1, aspectRatio: 1, borderRadius: 6 },
});
