import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../AppText';
import { PressableScale } from '../PressableScale';

export type MilestoneGridItem = {
  id: string;
  title: string;
  /** Arabic initial shown when unlocked. */
  glyph: string;
  unlocked: boolean;
  accessibilityLabel: string;
};

export type MilestoneGridProps = {
  items: MilestoneGridItem[];
  onPress: (id: string) => void;
};

/** Two-column grid; locked = outline with muted title, unlocked = gold Arabic initial. */
export function MilestoneGrid({ items, onPress }: MilestoneGridProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <PressableScale
          key={item.id}
          onPress={() => onPress(item.id)}
          accessibilityRole="button"
          accessibilityLabel={item.accessibilityLabel}
          style={[
            styles.tile,
            { borderColor: item.unlocked ? colors.gold : colors.line, backgroundColor: item.unlocked ? colors.surface : 'transparent' },
          ]}
        >
          <View style={styles.glyphBox}>
            {item.unlocked ? (
              <AppText variant="arabicLarge" style={styles.glyph}>{item.glyph}</AppText>
            ) : (
              <View style={[styles.lockedRing, { borderColor: colors.line }]} />
            )}
          </View>
          <AppText variant="small" weight="medium" center muted={!item.unlocked}>{item.title}</AppText>
        </PressableScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    flexGrow: 1, flexBasis: '45%', minHeight: 112, borderRadius: 14, borderWidth: 1,
    padding: 12, alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  glyphBox: { height: 48, alignItems: 'center', justifyContent: 'center' },
  glyph: { lineHeight: 48 },
  lockedRing: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5 },
});
