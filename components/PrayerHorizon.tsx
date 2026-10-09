import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import type { DailyPrayerTimes } from '../lib/prayerTimes';
import { PRAYER_ORDER } from '../lib/prayerTimes';
import type { PrayerName } from '../lib/types';
import { TYPE_SCALE } from '../theme/fonts';
import { palette } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { NODE_ANGLES, arcGeometry, arcPath, minNodeSpacing, nodePositions, pointAtAngle, sunAngle } from './horizonGeometry';
import { PressableScale } from './PressableScale';

export type PrayerHorizonProps = {
  labels: Record<PrayerName, string>;
  times: DailyPrayerTimes | null;
  timeLabel?: (d: Date) => string;
  done: PrayerName[];
  now: Date;
  textColor: string;
  mutedColor: string;
  accent: string;
  onToggle: (p: PrayerName) => void;
};

const ARC_HEIGHT = 72;
const INSET = 24;
const TOP_PAD = 22; // room for Dhuhr's touch target above the arc's apex
const HIT = 44;
const NODE = 18;
const LABEL_W = 56;
const LABEL_GAP = 4;
const SUN = 10;
const GLOW = 26;
const SUN_MS = 900;
// The sky is not themed, so the sun keeps one bright gold in both app schemes.
const SUN_GOLD = palette.dawnGoldNight;

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const defaultTime = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

/** The five daily prayers as tappable nodes along the sky's horizon arc, with the sun riding the arc by the clock. */
export function PrayerHorizon({
  labels, times, timeLabel = defaultTime, done, now, textColor, mutedColor, accent, onToggle,
}: PrayerHorizonProps) {
  const { colors, isRTL, reduceMotion, lineHeight } = useTheme();
  const [width, setWidth] = useState(0);

  const geom = useMemo(() => arcGeometry(width, ARC_HEIGHT, isRTL, INSET), [width, isRTL]);
  const nodes = useMemo(() => nodePositions(geom), [geom]);
  // Touch targets are 44 wide unless the nodes sit closer than that (narrow screens): never overlap.
  const hitW = Math.min(HIT, Math.floor(minNodeSpacing(nodes)));
  const target = times ? sunAngle(now, times) : null;

  const angle = useSharedValue(reduceMotion && target !== null ? target : NODE_ANGLES[0]);
  const ready = width > 0;
  useEffect(() => {
    if (target === null || !ready) return;
    angle.value = reduceMotion
      ? target
      : withTiming(target, { duration: SUN_MS, easing: Easing.out(Easing.cubic) });
  }, [target, ready, reduceMotion, angle]);

  const sunStyle = useAnimatedStyle(() => {
    const p = pointAtAngle(geom, angle.value);
    return { transform: [{ translateX: p.x - GLOW / 2 }, { translateY: TOP_PAD + p.y - GLOW / 2 }] };
  });

  const doneSet = new Set(done);
  const captionLine = lineHeight(TYPE_SCALE.caption);
  const labelTop = NODE / 2 + LABEL_GAP;
  const height = TOP_PAD + ARC_HEIGHT + labelTop + captionLine * (times ? 2 : 1) + LABEL_GAP;

  const onLayout = (e: LayoutChangeEvent) => setWidth(Math.round(e.nativeEvent.layout.width));

  return (
    <View onLayout={onLayout} style={{ height }}>
      {ready ? (
        // Positions are physical (already mirrored for RTL by the geometry), so lay out this layer LTR.
        <View style={[StyleSheet.absoluteFill, styles.ltr]}>
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <G transform={`translate(0, ${TOP_PAD})`}>
              <Path d={arcPath(geom)} stroke={mutedColor} strokeOpacity={0.4} strokeWidth={1.5} fill="none" />
            </G>
          </Svg>

          {PRAYER_ORDER.map((p) => {
            const { x, y } = nodes[p];
            const checked = doneSet.has(p);
            const time = times ? timeLabel(times[p]) : null;
            const labelStart = Math.min(Math.max(x - LABEL_W / 2, 0), Math.max(0, width - LABEL_W));
            return (
              <React.Fragment key={p}>
                <View
                  style={[styles.label, { start: labelStart, top: TOP_PAD + y + labelTop }]}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden
                >
                  <AppText variant="caption" color={textColor} center numberOfLines={1}>
                    {labels[p]}
                  </AppText>
                  {time ? (
                    <AppText variant="caption" color={mutedColor} center numberOfLines={1}>
                      {time}
                    </AppText>
                  ) : null}
                </View>
                <PressableScale
                  onPress={() => onToggle(p)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={time ? `${labels[p]}, ${time}` : labels[p]}
                  accessibilityState={{ checked }}
                  style={[styles.hit, { width: hitW, start: x - hitW / 2, top: TOP_PAD + y - HIT / 2 }]}
                >
                  <View
                    style={[
                      styles.node,
                      checked ? { backgroundColor: accent } : { borderWidth: 2, borderColor: textColor },
                    ]}
                  >
                    {checked ? <Check size={11} color={colors.onAccent} strokeWidth={3.5} /> : null}
                  </View>
                </PressableScale>
              </React.Fragment>
            );
          })}

          {target !== null ? (
            <Animated.View style={[styles.sun, sunStyle]}>
              <View style={[styles.glowOuter, { backgroundColor: SUN_GOLD }]} />
              <View style={[styles.glowInner, { backgroundColor: SUN_GOLD }]} />
              <View style={[styles.core, { backgroundColor: SUN_GOLD, shadowColor: SUN_GOLD }]} />
            </Animated.View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ltr: { direction: 'ltr' },
  label: { position: 'absolute', width: LABEL_W, pointerEvents: 'none' },
  hit: { position: 'absolute', height: HIT, alignItems: 'center', justifyContent: 'center' },
  node: { width: NODE, height: NODE, borderRadius: NODE / 2, alignItems: 'center', justifyContent: 'center' },
  sun: { position: 'absolute', top: 0, start: 0, pointerEvents: 'none', width: GLOW, height: GLOW, alignItems: 'center', justifyContent: 'center' },
  glowOuter: { position: 'absolute', width: GLOW, height: GLOW, borderRadius: GLOW / 2, opacity: 0.16 },
  glowInner: { position: 'absolute', width: 17, height: 17, borderRadius: 8.5, opacity: 0.3 },
  core: {
    width: SUN, height: SUN, borderRadius: SUN / 2,
    shadowOpacity: 0.9, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 0,
  },
});
