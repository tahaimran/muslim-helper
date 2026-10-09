import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ARABIC_SCALE, TYPE_SCALE, type FontRole } from '../theme/fonts';

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

export function AppText({ variant = 'body', muted, color, weight, center, style, maxFontSizeMultiplier = 1.3, ...rest }: AppTextProps) {
  const { colors, font, lineHeight } = useTheme();
  const isArabic = variant === 'arabic' || variant === 'arabicLarge';
  const size = variant === 'arabic' ? ARABIC_SCALE.normal : variant === 'arabicLarge' ? ARABIC_SCALE.large : TYPE_SCALE[variant];

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

  return <Text maxFontSizeMultiplier={maxFontSizeMultiplier} {...rest} style={[base, style]} />;
}
