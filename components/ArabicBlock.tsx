import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { showTransliteration } from '../content/i18n';
import { localizeSourceRef } from '../lib/sourceRef';
import type { Lang } from '../lib/model';
import { AppText } from './AppText';

export type ArabicBlockProps = {
  arabic: string;
  transliteration?: string;
  meaning?: string;
  sourceRef?: string;
  size?: 'normal' | 'large';
};

export function ArabicBlock({ arabic, transliteration, meaning, sourceRef, size = 'normal' }: ArabicBlockProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language ?? 'en').split('-')[0] as Lang;
  return (
    <View style={styles.block}>
      <AppText variant={size === 'large' ? 'arabicLarge' : 'arabic'}>{arabic}</AppText>
      {transliteration && showTransliteration(lang) ? <AppText variant="small" muted center>{transliteration}</AppText> : null}
      {meaning ? <AppText variant="body" center>{meaning}</AppText> : null}
      {sourceRef ? <AppText variant="caption" muted center>{localizeSourceRef(sourceRef, lang)}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 8, alignItems: 'stretch' },
});
