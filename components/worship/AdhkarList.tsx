import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { Dhikr } from '../../content/types';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../AppText';
import { ArabicBlock } from '../ArabicBlock';
import { Button } from '../Button';
import { PressableScale } from '../PressableScale';
import { Section } from '../Section';

export type AdhkarListProps = {
  title: string;
  items: Dhikr[];
  /** Whether the section's items start expanded. */
  defaultExpanded: boolean;
  completed: boolean;
  completeLabel: string;
  completedLabel: string;
  onComplete: () => void;
  /** Formats a source for display, e.g. "Muslim 2692, sahih". */
  sourceLabel: (d: Dhikr) => string | undefined;
};

/**
 * One adhkar section. Per-item counters and expansion are UI state only. Memoized: it sits under
 * the tasbih counter and should not re-render on every tap (callers pass stable handlers).
 */
export const AdhkarList = memo(function AdhkarList({
  title, items, defaultExpanded, completed, completeLabel, completedLabel, onComplete, sourceLabel,
}: AdhkarListProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [counts, setCounts] = useState<Record<number, number>>({});
  const isOpen = (i: number) => open[i] ?? defaultExpanded;

  return (
    <Section title={title}>
      {items.map((d, i) => {
        const expanded = isOpen(i);
        const n = counts[i] ?? 0;
        const done = n >= d.count;
        const Chevron = expanded ? ChevronUp : ChevronDown;
        return (
          <View key={`${d.id}-${i}`} style={[styles.item, { borderBottomColor: colors.line }]}>
            <PressableScale
              haptic={false}
              onPress={() => setOpen((o) => ({ ...o, [i]: !expanded }))}
              accessibilityRole="button"
              accessibilityLabel={d.transliteration}
              accessibilityState={{ expanded }}
              style={styles.head}
            >
              <AppText variant="body" numberOfLines={2} style={styles.headText}>{d.transliteration}</AppText>
              <Chevron size={20} color={colors.control} />
            </PressableScale>
            {expanded ? (
              <View style={styles.body}>
                <ArabicBlock arabic={d.arabic} meaning={d.meaning} sourceRef={sourceLabel(d)} />
                <Button
                  variant="secondary"
                  label={done ? t('worship.itemDone', { count: d.count }) : t('worship.itemCount', { n, count: d.count })}
                  disabled={done}
                  onPress={() => setCounts((c) => ({ ...c, [i]: Math.min((c[i] ?? 0) + 1, d.count) }))}
                />
              </View>
            ) : null}
          </View>
        );
      })}
      <View style={styles.complete}>
        <Button
          variant="primary"
          label={completed ? completedLabel : completeLabel}
          disabled={completed}
          onPress={onComplete}
        />
      </View>
    </Section>
  );
});

const styles = StyleSheet.create({
  item: { borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 4 },
  head: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headText: { flex: 1 },
  body: { gap: 12, paddingTop: 8, paddingBottom: 12 },
  complete: { marginTop: 16 },
});
