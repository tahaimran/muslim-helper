import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Check, Lock } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { DayStatus } from '../../lib/view/journey';

const SIZE = 36;

/** 36px status circle for a journey day. Today pulses once on mount unless motion is reduced. */
export function DayNode({ status }: { status: DayStatus }) {
  const { colors, reduceMotion } = useTheme();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // reduceMotion resolves asynchronously (it starts false), so wait briefly and re-check
  // the latest value before pulsing.
  const reduceRef = useRef(reduceMotion);
  reduceRef.current = reduceMotion;
  useEffect(() => {
    if (status !== 'today') return;
    const id = setTimeout(() => {
      if (reduceRef.current) return;
      scale.value = withSequence(withTiming(1.18, { duration: 380 }), withTiming(1, { duration: 380 }));
    }, 300);
    return () => clearTimeout(id);
  }, [status, scale]);

  let body: React.ReactNode;
  switch (status) {
    case 'complete':
      body = (
        <View style={[styles.circle, { backgroundColor: colors.accent }]}>
          <Check size={20} color={colors.onAccent} strokeWidth={3} />
        </View>
      );
      break;
    case 'partial':
      body = (
        <View style={[styles.circle, styles.ring2, { borderColor: colors.accent, backgroundColor: colors.bg }]}>
          <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        </View>
      );
      break;
    case 'today':
      body = <View style={[styles.circle, styles.ring3, { borderColor: colors.gold, backgroundColor: colors.bg }]} />;
      break;
    case 'locked':
      body = (
        <View style={[styles.circle, styles.ring2, { borderColor: colors.line, backgroundColor: colors.bg, opacity: 0.5 }]}>
          <Lock size={12} color={colors.textMuted} />
        </View>
      );
      break;
    default:
      body = <View style={[styles.circle, styles.ring2, { borderColor: colors.line, backgroundColor: colors.bg }]} />;
  }
  return <Animated.View style={anim}>{body}</Animated.View>;
}

const styles = StyleSheet.create({
  circle: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, alignItems: 'center', justifyContent: 'center' },
  ring2: { borderWidth: 2 },
  ring3: { borderWidth: 3 },
  dot: { width: 14, height: 14, borderRadius: 7 },
});
