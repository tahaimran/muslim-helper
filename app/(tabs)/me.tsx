import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { AppText, ListRow, PressableScale, Screen, Section } from '@/components';
import { MilestoneGrid } from '@/components/me/MilestoneGrid';
import { PrayerHeatmap } from '@/components/me/PrayerHeatmap';
import { MILESTONE_CONTENT } from '@/content/milestones';
import type { PersistedState } from '@/lib/model';
import { useAppStore } from '@/lib/store';
import { useToday } from '@/lib/useToday';
import { buildProgressVM } from '@/lib/view/progress';
import { useTheme } from '@/theme/ThemeProvider';

function shortDate(key: string, language: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  try {
    return new Intl.DateTimeFormat(language, { day: 'numeric', month: 'short' }).format(date);
  } catch {
    return key;
  }
}

export default function MeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const today = useToday();

  const profile = useAppStore((s) => s.profile);
  const settings = useAppStore((s) => s.settings);
  const cycle = useAppStore((s) => s.cycle);
  const planStartDate = useAppStore((s) => s.planStartDate);
  const planDays = useAppStore((s) => s.planDays);
  const dates = useAppStore((s) => s.dates);
  const milestones = useAppStore((s) => s.milestones);

  const vm = useMemo(() => {
    const state: PersistedState = { schema: 1, profile, settings, cycle, planStartDate, planDays, dates, milestones };
    return buildProgressVM(state, today);
  }, [profile, settings, cycle, planStartDate, planDays, dates, milestones, today]);

  const name = profile?.name?.trim();
  const stats = [
    { value: vm.daysShownUp, label: t('me.daysShownUp') },
    { value: vm.streak, label: t('me.streak') },
    { value: vm.prayersKept30, label: t('me.prayersKept') },
  ];

  const items = vm.milestones.map((m) => {
    const content = MILESTONE_CONTENT[m.id];
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
          cellLabel={(date, count) => t('me.heatmapCell', { date: shortDate(date, i18n.language), count })}
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
