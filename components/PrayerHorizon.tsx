import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import type { DailyPrayerTimes } from '../lib/prayerTimes';
import { PRAYER_ORDER } from '../lib/prayerTimes';
import type { PrayerName } from '../lib/types';
import { TYPE_SCALE } from '../theme/fonts';
import { SKY, type SkyPhase } from '../theme/sky';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { NODE_ANGLES, arcGeometry, arcPath, minNodeSpacing, nodePositions, pointAtAngle, sunDisplayAngle } from './horizonGeometry';
import { PressableScale } from './PressableScale';

export type PrayerHorizonProps = {
  labels: Record<PrayerName, string>;
  times: DailyPrayerTimes | null;
  timeLabel?: (d: Date) => string;
  done: PrayerName[];
  now: Date;
  textColor: string;
  mutedColor: string;
  /** Sky phase; supplies the default accent, check color and sun color. */
  phase: SkyPhase;
  /** Done-node fill; defaults to SKY[phase].accent. */
  accent?: string;
  /** Check-mark color on a done node; defaults to SKY[phase].onAccent. */
  onAccent?: string;
  onToggle: (p: PrayerName) => void;
};

const ARC_HEIGHT = 72;
const INSET = 24;
const TOP_PAD = 22; // room for the apex node's touch target above the arc
const HIT = 44;
const MIN_HIT = 32;
const NODE = 18;
const LABEL_GAP = 4;
const SUN = 10;
const GLOW = 26;
const SUN_MS = 900;

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const defaultTime = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi));

/** The five daily prayers as tappable nodes along the sky's horizon arc, with the sun riding the arc by the clock. */
export function PrayerHorizon({
  labels, times, timeLabel = defaultTime, done, now, textColor, mutedColor, phase, accent, onAccent, onToggle,
}: PrayerHorizonProps) {
  const { isRTL, reduceMotion, lineHeight } = useTheme();
  const { fontScale } = useWindowDimensions();
  const sky = SKY[phase];
  const fillColor = accent ?? sky.accent;
  const sunColor = sky.sun;
  const [width, setWidth] = useState(0);
  const checkColor = onAccent ?? sky.onAccent;

  const geom = useMemo(() => arcGeometry(width, ARC_HEIGHT, isRTL, INSET), [width, isRTL]);
  const nodes = useMemo(() => nodePositions(geom), [geom]);
  const span = Math.floor(minNodeSpacing(nodes));
  // Labels use the room between nodes (at least 44); touch targets never overlap above the 32 floor.
  const labelW = Math.max(HIT, span);
  const pressW = Math.max(MIN_HIT, Math.min(labelW, span));
  const target = times ? sunDisplayAngle(geom, now, times) : null;

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
  // AppText caps font scaling at 1.3, so the label block must not grow past that either.
  const captionLine = lineHeight(TYPE_SCALE.caption * Math.min(fontScale, 1.3));
  const labelTop = HIT / 2 + NODE / 2 + LABEL_GAP; // measured from the top of a node's touch box
  const labelsH = captionLine * (times ? 2 : 1);
  const pressH = labelTop + labelsH + LABEL_GAP;
  const height = TOP_PAD + ARC_HEIGHT - HIT / 2 + pressH;

  const onLayout = (e: LayoutChangeEvent) => setWidth(Math.round(e.nativeEvent.layout.width));

  return (
    <View onLayout={onLayout} style={{ height }}>
      {ready ? (
        // Positions are physical (already mirrored for RTL by the geometry), so lay out this layer LTR.
        // Deliberate exception to the start/end rule: below, `left` is used for those physical coordinates.
        <View style={[StyleSheet.absoluteFill, styles.ltr]}>
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <G transform={`translate(0, ${TOP_PAD})`}>
              <Path d={arcPath(geom)} stroke={mutedColor} strokeOpacity={0.4} strokeWidth={1.5} fill="none" />
            </G>
          </Svg>

          {/* The sun sits beneath the nodes so it never hides a node's check. */}
          {target !== null ? (
            <Animated.View style={[styles.sun, sunStyle]}>
              <View style={[styles.glowOuter, { backgroundColor: sunColor }]} />
              <View style={[styles.glowInner, { backgroundColor: sunColor }]} />
              <View style={[styles.core, { backgroundColor: sunColor, shadowColor: sunColor }]} />
            </Animated.View>
          ) : null}

          {PRAYER_ORDER.map((p) => {
            const { x, y } = nodes[p];
            const checked = doneSet.has(p);
            const time = times ? timeLabel(times[p]) : null;
            // One pressable covers the node and its name/time beneath it.
            const pressStart = clamp(x - pressW / 2, 0, width - pressW);
            const labelStart = clamp(x - labelW / 2, 0, width - labelW) - pressStart;
            return (
              <PressableScale
                key={p}
                onPress={() => onToggle(p)}
                accessibilityRole="checkbox"
                accessibilityLabel={time ? `${labels[p]}, ${time}` : labels[p]}
                accessibilityState={{ checked }}
                aria-checked={checked}
                style={[styles.press, { width: pressW, height: pressH, left: pressStart, top: TOP_PAD + y - HIT / 2 }]}
              >
                <View
                  style={[
                    styles.node,
                    { left: x - pressStart - NODE / 2 },
                    checked ? { backgroundColor: fillColor } : { borderWidth: 2, borderColor: textColor },
                  ]}
                >
                  {checked ? <Check size={11} color={checkColor} strokeWidth={3.5} /> : null}
                </View>
                <View
                  style={[styles.label, { width: labelW, left: labelStart, top: labelTop }]}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden
                >
                  <AppText variant="caption" color={textColor} center numberOfLines={1}>
                    {labels[p]}
                  </AppText>
                  {time ? (
                    <AppText
                      variant="caption"
                      color={mutedColor}
                      center
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                    >
                      {time}
                    </AppText>
                  ) : null}
                </View>
              </PressableScale>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ltr: { direction: 'ltr' },
  press: { position: 'absolute' },
  node: {
    position: 'absolute', top: HIT / 2 - NODE / 2, width: NODE, height: NODE, borderRadius: NODE / 2,
    alignItems: 'center', justifyContent: 'center',
  },
  label: { position: 'absolute', pointerEvents: 'none' },
  sun: {
    position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: GLOW, height: GLOW,
    alignItems: 'center', justifyContent: 'center',
  },
  glowOuter: { position: 'absolute', width: GLOW, height: GLOW, borderRadius: GLOW / 2, opacity: 0.16 },
  glowInner: { position: 'absolute', width: 17, height: 17, borderRadius: 8.5, opacity: 0.3 },
  core: {
    width: SUN, height: SUN, borderRadius: SUN / 2,
    shadowOpacity: 0.9, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 0,
  },
});
