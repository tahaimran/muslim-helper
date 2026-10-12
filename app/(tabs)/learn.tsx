import React, { useMemo } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, ArabicBlock, ListRow, Screen, Section, showToast } from '@/components';
import { StepList, type StepItem } from '@/components/learn/StepList';
import { useLang } from '@/theme/useLang';
import { useTheme } from '@/theme/ThemeProvider';
import { localizeLearn, showMeaning } from '@/content/i18n';
import { PILLARS_SOURCES, RAKAH_COUNTS, type LearnStep } from '@/content/learn';

const toItems = (steps: LearnStep[], withMeaning: boolean): StepItem[] =>
  steps.map((s) => ({
    id: s.id,
    title: s.title,
    body: s.body,
    recite: s.recite
      ? {
          arabic: s.recite.arabic,
          transliteration: s.recite.transliteration,
          meaning: withMeaning ? s.recite.meaning : undefined,
          sourceRef: s.recite.source?.ref,
        }
      : undefined,
  }));

const RESOURCES = [
  { id: 'quran', url: 'https://quran.com' },
  { id: 'sunnah', url: 'https://sunnah.com' },
] as const;

type Pillar = { id: string; name: string; arabic: string; meaning: string };

function PillarList({ items }: { items: Pillar[] }) {
  const { colors } = useTheme();
  return (
    <View>
      {items.map((p) => (
        <View key={p.id} style={[styles.pillar, { borderBottomColor: colors.line }]}>
          <View style={styles.pillarHead}>
            <AppText variant="body" weight="medium" style={styles.flex}>{p.name}</AppText>
            <AppText variant="arabic">{p.arabic}</AppText>
          </View>
          <AppText variant="small" muted>{p.meaning}</AppText>
        </View>
      ))}
    </View>
  );
}

export default function LearnScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const lang = useLang();
  const learn = useMemo(() => localizeLearn(lang), [lang]);
  const withMeaning = showMeaning(lang);
  const wudu = useMemo(() => toItems(learn.WUDU_STEPS, withMeaning), [learn, withMeaning]);
  const salah = useMemo(() => toItems(learn.SALAH_STEPS, withMeaning), [learn, withMeaning]);
  const { DUA_AFTER_WUDU, SALAH_NOTES, PILLARS_OF_ISLAM, PILLARS_OF_IMAN } = learn;
  const hints = { expandHint: t('learn.expandHint'), collapseHint: t('learn.collapseHint') };

  return (
    <Screen>
      <AppText variant="title">{t('tabs.learn')}</AppText>

      <Section title={t('learn.wudu.title')} subtitle={t('learn.wudu.subtitle')}>
        <StepList steps={wudu} {...hints} />
        <View style={styles.dua}>
          <AppText variant="body" weight="medium" style={styles.duaTitle}>{t('learn.wudu.duaAfter')}</AppText>
          <ArabicBlock
            arabic={DUA_AFTER_WUDU.arabic}
            transliteration={DUA_AFTER_WUDU.transliteration}
            meaning={withMeaning ? DUA_AFTER_WUDU.meaning : undefined}
            sourceRef={DUA_AFTER_WUDU.source.ref}
          />
        </View>
      </Section>

      <Section title={t('learn.salah.title')} subtitle={t('learn.salah.subtitle')}>
        <StepList steps={salah} {...hints} />
        <View style={styles.notes}>
          {SALAH_NOTES.map((n) => (
            <View key={n.id} style={styles.note}>
              <AppText variant="body" weight="medium">{n.title}</AppText>
              <AppText variant="small" muted>{n.body}</AppText>
            </View>
          ))}
        </View>
      </Section>

      <Section title={t('learn.rakah.title')} subtitle={t('learn.rakah.subtitle')}>
        <View accessibilityRole="list">
          {RAKAH_COUNTS.map((r) => (
            <View
              key={r.prayer}
              accessible
              accessibilityLabel={t('learn.rakah.rowLabel', { prayer: t(`prayers.${r.prayer}`), count: r.fard })}
              style={[styles.rakahRow, { borderBottomColor: colors.line }]}
            >
              <AppText variant="body" style={styles.flex}>{t(`prayers.${r.prayer}`)}</AppText>
              <AppText variant="body" weight="medium">{String(r.fard)}</AppText>
            </View>
          ))}
        </View>
      </Section>

      <Section title={t('learn.islam.title')}>
        <PillarList items={PILLARS_OF_ISLAM} />
        <AppText variant="caption" muted style={styles.source}>{PILLARS_SOURCES.islam.ref}</AppText>
      </Section>

      <Section title={t('learn.iman.title')}>
        <PillarList items={PILLARS_OF_IMAN} />
        <AppText variant="caption" muted style={styles.source}>{PILLARS_SOURCES.iman.ref}</AppText>
      </Section>

      <Section title={t('learn.resources.title')} subtitle={t('learn.resources.caption')}>
        {RESOURCES.map((r) => (
          <ListRow
            key={r.id}
            title={t(`learn.resources.${r.id}.title`)}
            subtitle={t(`learn.resources.${r.id}.subtitle`)}
            onPress={() => { Linking.openURL(r.url).catch(() => showToast(t('errors.generic'), 'error')); }}
            accessibilityHint={t('learn.resources.hint')}
          />
        ))}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  dua: { marginTop: 20, gap: 10 },
  duaTitle: { marginBottom: 2 },
  notes: { marginTop: 24, gap: 20 },
  note: { gap: 4 },
  rakahRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  pillar: { paddingVertical: 12, gap: 4, borderBottomWidth: StyleSheet.hairlineWidth },
  pillarHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  source: { marginTop: 8 },
});
