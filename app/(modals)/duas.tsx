import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { AppText, ArabicBlock, PressableScale, Screen, Section } from '@/components';
import { DUA_CATEGORIES, type DuaEntry } from '@/content/duas';
import { useTheme } from '@/theme/ThemeProvider';

export default function DuasScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const sourceLabel = (d: DuaEntry) => {
    const s = d.text.source;
    if (!s) return undefined;
    return s.grade ? `${s.ref}, ${t(`worship.grade.${s.grade}`)}` : s.ref;
  };

  return (
    <Screen edges={['bottom']}>
      <AppText variant="body" muted style={styles.intro}>{t('duas.intro')}</AppText>
      {DUA_CATEGORIES.map((cat) => (
        <Section key={cat.id} title={cat.title} subtitle={cat.titleArabic}>
          {cat.duas.map((d) => {
            const expanded = !!open[d.id];
            const Chevron = expanded ? ChevronUp : ChevronDown;
            return (
              <View key={d.id} style={[styles.item, { borderBottomColor: colors.line }]}>
                <PressableScale
                  haptic={false}
                  onPress={() => setOpen((o) => ({ ...o, [d.id]: !expanded }))}
                  accessibilityRole="button"
                  accessibilityLabel={d.title}
                  accessibilityState={{ expanded }}
                  style={styles.header}>
                  <View style={styles.titles}>
                    <AppText variant="body">{d.title}</AppText>
                    {d.occasion ? <AppText variant="small" muted>{d.occasion}</AppText> : null}
                  </View>
                  <Chevron size={18} color={colors.textMuted} />
                </PressableScale>
                {expanded ? (
                  <View style={styles.body}>
                    <ArabicBlock
                      arabic={d.text.arabic}
                      transliteration={d.text.transliteration}
                      meaning={d.text.meaning}
                      sourceRef={sourceLabel(d)}
                    />
                  </View>
                ) : null}
              </View>
            );
          })}
        </Section>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: 8 },
  item: { borderBottomWidth: StyleSheet.hairlineWidth },
  header: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  titles: { flex: 1 },
  body: { paddingBottom: 16 },
});
