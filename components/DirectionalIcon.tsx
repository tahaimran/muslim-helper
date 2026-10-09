import React from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';

export function DirectionalIcon({ icon: Icon, size = 20, color }: { icon: LucideIcon; size?: number; color?: string }) {
  const { isRTL, colors } = useTheme();
  return (
    <View style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <Icon size={size} color={color ?? colors.textMuted} />
    </View>
  );
}
