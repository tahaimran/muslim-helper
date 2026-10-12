import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';
import type { JourneyDayVM } from '../../lib/view/journey';
import { AppText } from '../AppText';
import { PressableScale } from '../PressableScale';
import { DayNode } from './DayNode';

export const ROW_H = 64;
const X_NEAR = 22;
const X_FAR = 46;
const NODE = 36;

/** Centre of the node for row `i`, measured from the start edge. */
const nodeX = (i: number) => (i % 2 === 0 ? X_NEAR : X_FAR);

/** One smooth cubic curve through every node centre. `flip` mirrors it for RTL. */
export function buildPath(count: number, width: number, flip: boolean): string {
  const px = (i: number) => (flip ? width - nodeX(i) : nodeX(i));
  const py = (i: number) => i * ROW_H + ROW_H / 2;
  let d = '';
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      d = `M ${px(0)} ${py(0)}`;
      continue;
    }
    const mid = ROW_H / 2;
    d += ` C ${px(i - 1)} ${py(i - 1) + mid} ${px(i)} ${py(i) - mid} ${px(i)} ${py(i)}`;
  }
  return d;
}

export type WeekPathProps = {
  days: JourneyDayVM[];
  dayLabel: (day: number) => string;
  a11yLabel: (day: JourneyDayVM) => string;
  onPress: (day: JourneyDayVM) => void;
};

/** A winding path: nodes alternate near/far from the start edge, joined by one continuous curve. */
export function WeekPath({ days, dayLabel, a11yLabel, onPress }: WeekPathProps) {
  const { colors, isRTL } = useTheme();
  const [width, setWidth] = useState(0);
  return (
    <View style={{ height: days.length * ROW_H }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && days.length > 1 ? (
        <Svg width={width} height={days.length * ROW_H} style={styles.svg} pointerEvents="none">
          <Path d={buildPath(days.length, width, isRTL)} stroke={colors.line} strokeWidth={1.5} fill="none" />
        </Svg>
      ) : null}
      {days.map((d, i) => (
        <PressableScale
          key={d.day}
          onPress={() => onPress(d)}
          accessibilityRole="button"
          accessibilityLabel={a11yLabel(d)}
          style={[styles.row, { paddingStart: nodeX(i) - NODE / 2 }]}
        >
          <DayNode status={d.status} />
          <View style={styles.text}>
            <AppText variant="caption" maxFontSizeMultiplier={1.4} color={d.status === 'today' ? colors.gold : colors.textMuted}>
              {dayLabel(d.day)}
            </AppText>
            <AppText variant="body" weight="medium" maxFontSizeMultiplier={1.4} muted={d.status === 'locked'}>{d.theme}</AppText>
          </View>
        </PressableScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  svg: { position: 'absolute', top: 0, start: 0 },
  row: { height: ROW_H, flexDirection: 'row', alignItems: 'center' },
  text: { flex: 1, marginStart: 12, justifyContent: 'center' },
});
