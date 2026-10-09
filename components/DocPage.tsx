import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Screen } from './Screen';

export type DocSection = { title: string; body: string };

/** A simple reading page: intro, titled paragraphs and an optional caption. */
export function DocPage({ intro, sections, caption }: { intro?: string; sections: DocSection[]; caption?: string }) {
  return (
    <Screen edges={['bottom']}>
      {intro ? <AppText variant="body" style={styles.intro}>{intro}</AppText> : null}
      {sections.map((s) => (
        <View key={s.title} style={styles.section}>
          <AppText variant="heading" accessibilityRole="header">{s.title}</AppText>
          <AppText variant="body" muted>{s.body}</AppText>
        </View>
      ))}
      {caption ? <AppText variant="caption" muted style={styles.caption}>{caption}</AppText> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: 8 },
  section: { marginTop: 24, gap: 6 },
  caption: { marginTop: 32 },
});
