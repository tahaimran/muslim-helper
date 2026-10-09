import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';

export type ArabicBlockProps = {
  arabic: string;
  transliteration?: string;
  meaning: string;
  sourceRef?: string;
  size?: 'normal' | 'large';
};

export function ArabicBlock({ arabic, transliteration, meaning, sourceRef, size = 'normal' }: ArabicBlockProps) {
  return (
    <View style={styles.block}>
      <AppText variant={size === 'large' ? 'arabicLarge' : 'arabic'}>{arabic}</AppText>
      {transliteration ? <AppText variant="small" muted center style={styles.italic}>{transliteration}</AppText> : null}
      <AppText variant="body" center>{meaning}</AppText>
      {sourceRef ? <AppText variant="caption" muted center>{sourceRef}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 8, alignItems: 'stretch' },
  italic: { fontStyle: 'italic' },
});
