import React, { useEffect, useMemo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { G, Path } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SKY, type SkyPhase } from '../theme/sky';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

export type SkyHeaderProps = {
  phase: SkyPhase;
  greeting: string;
  title: string;
  titleArabic: string;
  dateLine: string;
  nextPrayerLine?: string;
  children?: ReactNode;
};

const PAD = 24;
const RADIUS = 28;
const ARABIC_TITLE = 39;
const TEXTURE = 140;
const FADE_MS = 900;

/** Full-bleed sky panel whose gradient follows the time of day; hosts the Prayer Horizon. */
export function SkyHeader({ phase, greeting, title, titleArabic, dateLine, nextPrayerLine, children }: SkyHeaderProps) {
  const { font, isRTL, reduceMotion } = useTheme();
  const insets = useSafeAreaInsets();
  const sky = SKY[phase];
  const focused = useIsFocused();

  const opacity = useSharedValue(reduceMotion ? 1 : 0.6);
  useEffect(() => {
    opacity.value = reduceMotion ? 1 : withTiming(1, { duration: FADE_MS, easing: Easing.out(Easing.quad) });
  }, [opacity, reduceMotion]);
  const skyStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.panel}>
      {focused ? <StatusBar style={sky.isDark ? 'light' : 'dark'} /> : null}
      <Animated.View style={[StyleSheet.absoluteFill, skyStyle]}>
        <LinearGradient colors={sky.gradient} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <GirihCorner color={sky.text} isRTL={isRTL} />

      <View style={[styles.content, { paddingTop: insets.top + PAD }]}>
        <AppText variant="small" color={sky.textMuted}>
          {greeting}
        </AppText>
        <AppText
          variant="hero"
          color={sky.text}
          style={[
            styles.arabic,
            { fontFamily: font('arabic'), fontSize: ARABIC_TITLE, lineHeight: Math.round(ARABIC_TITLE * 1.7) },
          ]}
        >
          {titleArabic}
        </AppText>
        <AppText variant="heading" weight="medium" color={sky.text} accessibilityRole="header">
          {title}
        </AppText>
        <AppText variant="caption" color={sky.textMuted} style={styles.date}>
          {dateLine}
        </AppText>
        {nextPrayerLine ? (
          <AppText variant="small" weight="medium" color={sky.text} style={styles.next}>
            {nextPrayerLine}
          </AppText>
        ) : null}
      </View>

      {children ? <View style={styles.horizon}>{children}</View> : null}
    </View>
  );
}

/** 16-point outline of an 8-point star (khatam) centred at (cx, cy). */
function starPath(cx: number, cy: number, r: number): string {
  const inner = r * 0.62;
  let d = '';
  for (let i = 0; i < 16; i++) {
    const rad = ((i * 22.5 - 90) * Math.PI) / 180;
    const len = i % 2 === 0 ? r : inner;
    d += `${i === 0 ? 'M' : 'L'} ${(cx + len * Math.cos(rad)).toFixed(2)} ${(cy + len * Math.sin(rad)).toFixed(2)} `;
  }
  return `${d}Z`;
}

const STEP = 64;
const STAR_R = 26;
// A small cluster of stars radiating from the top-end corner, fading away from it.
const STARS = [0, 1, 2].flatMap((row) =>
  [0, 1, 2].map((col) => ({ col, row, strength: Math.max(0.25, 1 - (row + col) * 0.28) })),
);

function GirihCorner({ color, isRTL }: { color: string; isRTL: boolean }) {
  const stars = useMemo(
    () =>
      STARS.map(({ col, row, strength }) => {
        const cx = isRTL ? col * STEP : TEXTURE - col * STEP;
        const cy = row * STEP;
        return { key: `${row}-${col}`, strength, outer: starPath(cx, cy, STAR_R), inner: starPath(cx, cy, STAR_R * 0.45) };
      }),
    [isRTL],
  );
  return (
    <View style={styles.texture} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <Svg width={TEXTURE} height={TEXTURE}>
        <G opacity={0.06}>
          {stars.map(({ key, strength, outer, inner }) => (
            <G key={key} opacity={strength}>
              <Path d={outer} fill={color} />
              <Path d={inner} fill="none" stroke={color} strokeWidth={1.5} />
            </G>
          ))}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { overflow: 'hidden', borderBottomStartRadius: RADIUS, borderBottomEndRadius: RADIUS },
  content: { paddingHorizontal: PAD },
  arabic: { alignSelf: 'flex-start', writingDirection: 'rtl', marginTop: 8 },
  date: { marginTop: 4 },
  next: { marginTop: 12 },
  horizon: { marginTop: 16, paddingBottom: 20 },
  texture: { position: 'absolute', top: 0, end: 0, width: TEXTURE, height: TEXTURE, pointerEvents: 'none' },
});
