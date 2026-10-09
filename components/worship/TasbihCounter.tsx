import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeProvider';
import { roundProgress, ROUND_TARGETS, type DhikrOption } from '../../lib/view/worship';
import { AppText } from '../AppText';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { PressableScale } from '../PressableScale';

const SIZE = 240;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export type TasbihCounterProps = {
  options: DhikrOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  target: number;
  onTargetChange: (n: number) => void;
  /** Count within the current round (UI state only). */
  round: number;
  /** Today's total for the selected dhikr, from the store. */
  todayCount: number;
  onTap: () => void;
  onResetRound: () => void;
};

export function TasbihCounter({
  options, selectedId, onSelect, target, onTargetChange, round, todayCount, onTap, onResetRound,
}: TasbihCounterProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const selected = options.find((o) => o.id === selectedId) ?? options[0];
  if (!selected) return null;
  const progress = roundProgress(round, target);

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {options.map((o) => (
          <Chip key={o.id} label={o.transliteration} selected={o.id === selected.id} onPress={() => onSelect(o.id)} />
        ))}
      </ScrollView>

      <AppText variant="arabicLarge" center style={styles.arabic}>{selected.arabic}</AppText>

      <PressableScale
        haptic={false}
        onPress={onTap}
        accessibilityRole="button"
        accessibilityLabel={t('worship.tapA11y', { name: selected.transliteration, round, target })}
        accessibilityHint={t('worship.tapHint')}
        style={[styles.circle, { backgroundColor: colors.surface }]}
      >
        <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill} accessible={false}>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={colors.line} strokeWidth={STROKE} fill="none" />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.accent}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <AppText variant="hero" center>{round}</AppText>
        <AppText variant="small" muted center>{t('worship.ofTarget', { target })}</AppText>
      </PressableScale>

      <AppText variant="body" center muted accessibilityLiveRegion="polite">
        {t('worship.today', { count: todayCount })}
      </AppText>

      <View style={styles.targets}>
        {ROUND_TARGETS.map((n) => (
          <Chip key={n} label={String(n)} selected={n === target} onPress={() => onTargetChange(n)} />
        ))}
      </View>

      <Button variant="ghost" label={t('worship.resetRound')} onPress={onResetRound} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'stretch', gap: 16 },
  chips: { gap: 8, paddingVertical: 4 },
  arabic: { marginTop: 8 },
  circle: {
    width: SIZE, height: SIZE, minWidth: 220, minHeight: 220, borderRadius: SIZE / 2,
    alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
  },
  targets: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
});
