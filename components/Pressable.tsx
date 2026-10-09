import React from 'react';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
};

/** Pressable with 0.97 scale feedback and a native-only selection haptic. */
export function PressableScale({ style, haptic = true, onPressIn, onPressOut, onPress, ...rest }: PressableScaleProps) {
  const { reduceMotion } = useTheme();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        if (!reduceMotion) scale.value = withTiming(0.97, { duration: 90 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: 140 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic && Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={[style, anim]}
    />
  );
}
