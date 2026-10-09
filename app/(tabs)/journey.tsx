import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Screen, Section } from '@/components';
import { WeekPath } from '@/components/journey/WeekPath';
import { initialState, type PersistedState } from '@/lib/model';
import { useAppStore } from '@/lib/store';
import { useToday } from '@/lib/useToday';
import { buildJourneyVM, type JourneyDayVM } from '@/lib/view/journey';
import { useTheme } from '@/theme/ThemeProvider';

export default function JourneyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const today = useToday();

  // Only the fields buildJourneyVM reads: profile, cycle, plan start, plan days, and the
  // per-date logs (today's tasbih counts can complete the current day).
  const profile = useAppStore((s) => s.profile);
  const cycle = useAppStore((s) => s.cycle);
  const planStartDate = useAppStore((s) => s.planStartDate);
  const planDays = useAppStore((s) => s.planDays);
  const dates = useAppStore((s) => s.dates);

  const vm = useMemo(() => {
    const state: PersistedState = { ...initialState(), profile, cycle, planStartDate, planDays, dates };
    return buildJourneyVM(state, today);
  }, [profile, cycle, planStartDate, planDays, dates, today]);

  const open = (d: JourneyDayVM) => {
    if (d.status === 'today') router.navigate('/(tabs)');
    else router.push(`/(modals)/day/${d.day}`);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title" accessibilityRole="header">{t('journey.title')}</AppText>
        {vm.cycle >= 2 ? <AppText variant="small" muted>{t('journey.cycle', { n: vm.cycle })}</AppText> : null}
      </View>

      {vm.weeks.map((w) => (
        <Section key={w.week}>
          <View style={styles.weekHeader} accessible accessibilityRole="header">
            <AppText variant="heading">{w.title}</AppText>
            <AppText variant="arabic" color={colors.gold} style={{ writingDirection: 'rtl' }}>
              {w.titleArabic}
            </AppText>
          </View>
          <AppText variant="small" muted style={styles.weekSub}>
            {t('journey.weekProgress', { done: w.doneCount, total: w.days.length })}
          </AppText>
          <WeekPath
            days={w.days}
            dayLabel={(n) => t('journey.dayN', { n })}
            a11yLabel={(d) => `${t('journey.dayN', { n: d.day })}, ${d.theme}, ${t(`journey.status.${d.status}`)}`}
            onPress={open}
          />
        </Section>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 8 },
  weekHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 12 },
  weekSub: { marginBottom: 8 },
});
