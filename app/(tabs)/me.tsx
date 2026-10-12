import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { AppText, ListRow, PressableScale, Screen, Section } from '@/components';
import { MilestoneGrid } from '@/components/me/MilestoneGrid';
import { PrayerHeatmap } from '@/components/me/PrayerHeatmap';
import { localizeMilestone } from '@/content/i18n';
import { formatShortDate } from '@/lib/dates';
import { persistedFrom } from '@/lib/model';
import { useAppStore } from '@/lib/store';
import { useDatesWithoutTasbih } from '@/lib/useDatesWithoutTasbih';
import { useToday } from '@/lib/useToday';
import { buildProgressVM } from '@/lib/view/progress';
import { useLang } from '@/theme/useLang';
import { useTheme } from '@/theme/ThemeProvider';

export default function MeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const today = useToday();
  const lang = useLang();

  // Progress reads only active flags, prayers and milestones, so tasbih taps do not re-render it.
  const profile = useAppStore((s) => s.profile);
  const dates = useDatesWithoutTasbih();
  const milestones = useAppStore((s) => s.milestones);

  const vm = useMemo(() => buildProgressVM(persistedFrom({ dates, milestones }), today), [dates, milestones, today]);

  const name = profile?.name?.trim();
  const stats = [
    { value: vm.daysShownUp, label: t('me.daysShownUp') },
    { value: vm.streak, label: t('me.streak') },
    { value: vm.prayersKept30, label: t('me.prayersKept') },
  ];

  const items = vm.milestones.map((m) => {
    const content = localizeMilestone(m.id, lang);
    const unlocked = m.unlockedOn !== null;
    return {
      id: m.id,
      title: content.title,
      glyph: Array.from(content.text.arabic)[0] ?? '',
      unlocked,
      accessibilityLabel: `${content.title}, ${unlocked ? t('me.unlocked') : t('me.locked')}`,
    };
  });

  return (
    <Screen>
      <View style={styles.greetingRow}>
        <AppText variant="title" accessibilityRole="header" style={styles.flex}>
          {name ? t('me.greeting', { name }) : t('me.greetingNoName')}
        </AppText>
        <PressableScale
          onPress={() => router.push('/(modals)/edit-profile')}
          accessibilityRole="button"
          accessibilityLabel={t('me.editProfile')}
          style={styles.iconButton}
        >
          <Pencil size={20} color={colors.textMuted} />
        </PressableScale>
      </View>

      <View style={styles.stats}>
        {stats.map((s) => (
          <View key={s.label} style={styles.stat} accessible accessibilityLabel={`${s.value}, ${s.label}`}>
            <AppText variant="display" color={colors.accent}>{String(s.value)}</AppText>
            <AppText variant="small" muted>{s.label}</AppText>
          </View>
        ))}
      </View>

      <Section title={t('me.heatmapTitle')} subtitle={t('me.heatmapSubtitle')}>
        <PrayerHeatmap
          cells={vm.heatmap}
          cellLabel={(date, count) => t('me.heatmapCell', { date: formatShortDate(date, i18n.language), count })}
        />
      </Section>

      <Section title={t('me.milestones')}>
        <MilestoneGrid items={items} onPress={(id) => router.push(`/(modals)/milestone/${id}`)} />
      </Section>

      <Section>
        <ListRow title={t('me.settings')} onPress={() => router.push('/(modals)/settings')} />
        <ListRow title={t('me.about')} onPress={() => router.push('/(modals)/about')} />
        <ListRow title={t('me.help')} onPress={() => router.push('/(modals)/help')} />
        <ListRow title={t('me.privacy')} onPress={() => router.push('/(modals)/privacy')} />
        <ListRow title={t('me.terms')} onPress={() => router.push('/(modals)/terms')} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginTop: 24 },
  stat: { minWidth: 96 },
});
