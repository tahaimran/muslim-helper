import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { TYPE_SCALE, type FontRole } from '../theme/fonts';

export type TextVariant =
  | 'hero' | 'display' | 'title' | 'heading' | 'body' | 'small' | 'caption' | 'arabic' | 'arabicLarge';

export type TextWeight = 'regular' | 'medium' | 'bold';

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  muted?: boolean;
  color?: string;
  weight?: TextWeight;
  center?: boolean;
};

const ARABIC_SIZE = { arabic: 28, arabicLarge: 36 } as const;

export function AppText({ variant = 'body', muted, color, weight, center, style, ...rest }: AppTextProps) {
  const { colors, font, lineHeight } = useTheme();
  const isArabic = variant === 'arabic' || variant === 'arabicLarge';
  const size = isArabic ? ARABIC_SIZE[variant as 'arabic' | 'arabicLarge'] : TYPE_SCALE[variant as keyof typeof TYPE_SCALE];

  let role: FontRole;
  if (isArabic) role = 'arabic';
  else if (variant === 'hero' || variant === 'display') role = 'display';
  else {
    const w: TextWeight = weight ?? (variant === 'title' || variant === 'heading' ? 'bold' : 'regular');
    role = w === 'bold' ? 'uiBold' : w === 'medium' ? 'uiMedium' : 'ui';
  }

  const resolvedColor =
    color ?? (variant === 'arabicLarge' ? colors.gold : muted ? colors.textMuted : colors.text);

  const base: TextStyle = {
    fontFamily: font(role),
    fontSize: size,
    lineHeight: isArabic ? Math.round(size * 1.9) : lineHeight(size),
    color: resolvedColor,
  };
  if (isArabic) {
    base.writingDirection = 'rtl';
    base.textAlign = 'center';
  }
  if (center) base.textAlign = 'center';

  return <Text {...rest} style={[base, style]} />;
}
