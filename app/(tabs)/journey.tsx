import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, PressableScale, Screen, Section, ThreadItem, ThreadList } from '@/components';
import { DayNode } from '@/components/journey/DayNode';
import type { PersistedState } from '@/lib/model';
import { useAppStore } from '@/lib/store';
import { useToday } from '@/lib/useToday';
import { buildJourneyVM, type DayStatus } from '@/lib/view/journey';
import { useTheme } from '@/theme/ThemeProvider';

const INDENT = 24;

export default function JourneyScreen() {
  const { t } = useTranslation();
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
    return buildJourneyVM(state, today);
  }, [profile, settings, cycle, planStartDate, planDays, dates, milestones, today]);

  const open = (day: number, status: DayStatus) => {
    if (status === 'today') router.navigate('/(tabs)');
    else router.push(`/(modals)/day/${day}`);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title" accessibilityRole="header">{t('journey.title')}</AppText>
        {vm.cycle >= 2 ? <AppText variant="small" muted>{t('journey.cycle', { n: vm.cycle })}</AppText> : null}
      </View>

      {vm.weeks.map((w) => (
        <Section
          key={w.week}
          title={`${w.title}  ${w.titleArabic}`}
          subtitle={t('journey.weekProgress', { done: w.doneCount, total: w.days.length })}
        >
          <ThreadList>
            {w.days.map((d, i) => {
              const label = `${t('journey.dayN', { n: d.day })}, ${d.theme}, ${t(`journey.status.${d.status}`)}`;
              return (
                <View key={d.day} style={i % 2 === 1 ? styles.shiftEnd : styles.shiftStart}>
                  <ThreadItem node={<DayNode status={d.status} />} first={i === 0} last={i === w.days.length - 1}>
                    <PressableScale
                      onPress={() => open(d.day, d.status)}
                      accessibilityRole="button"
                      accessibilityLabel={label}
                      style={styles.row}
                    >
                      <AppText variant="caption" color={d.status === 'today' ? colors.gold : colors.textMuted}>
                        {t('journey.dayN', { n: d.day })}
                      </AppText>
                      <AppText variant="body" weight="medium" muted={d.status === 'locked'}>{d.theme}</AppText>
                    </PressableScale>
                  </ThreadItem>
                </View>
              );
            })}
          </ThreadList>
        </Section>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 8 },
  row: { minHeight: 44, justifyContent: 'center' },
  shiftStart: { paddingStart: 0 },
  shiftEnd: { paddingStart: INDENT },
});
