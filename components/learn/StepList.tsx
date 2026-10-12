import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../AppText';
import { ArabicBlock } from '../ArabicBlock';
import { PressableScale } from '../PressableScale';

export type StepItem = {
  id: string;
  title: string;
  body: string;
  recite?: { arabic: string; transliteration: string; meaning?: string; sourceRef?: string };
};

export type StepListProps = {
  steps: StepItem[];
  /** Spoken label for the collapsed/expanded hint, e.g. "Show details". */
  expandHint: string;
  collapseHint: string;
};

/** Numbered, expandable steps (a real sequence, so numbering is appropriate). */
export function StepList({ steps, expandHint, collapseHint }: StepListProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <View>
      {steps.map((step, i) => {
        const expanded = !!open[step.id];
        const Icon = expanded ? ChevronUp : ChevronDown;
        return (
          <View key={step.id} style={[styles.item, { borderBottomColor: colors.line }]}>
            <PressableScale
              haptic={false}
              onPress={() => setOpen((o) => ({ ...o, [step.id]: !o[step.id] }))}
              accessibilityRole="button"
              accessibilityLabel={`${i + 1}. ${step.title}`}
              accessibilityHint={expanded ? collapseHint : expandHint}
              accessibilityState={{ expanded }}
              style={styles.head}
            >
              <View style={[styles.badge, { backgroundColor: colors.surface, borderColor: colors.line }]}>
                <AppText variant="small" weight="medium">{String(i + 1)}</AppText>
              </View>
              <View style={styles.title}>
                <AppText variant="body" weight="medium">{step.title}</AppText>
              </View>
              <Icon size={20} color={colors.textMuted} />
            </PressableScale>
            {expanded ? (
              <View style={styles.detail}>
                <AppText variant="body" muted>{step.body}</AppText>
                {step.recite ? (
                  <View style={[styles.recite, { backgroundColor: colors.surface }]}>
                    <ArabicBlock
                      arabic={step.recite.arabic}
                      transliteration={step.recite.transliteration}
                      meaning={step.recite.meaning}
                      sourceRef={step.recite.sourceRef}
                    />
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { borderBottomWidth: StyleSheet.hairlineWidth },
  head: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  badge: { width: 32, height: 32, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1 },
  detail: { paddingBottom: 16, paddingStart: 44, gap: 12 },
  recite: { borderRadius: 14, padding: 14 },
});
