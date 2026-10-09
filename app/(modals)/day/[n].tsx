import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, ArabicBlock, Screen, Section, showToast } from '@/components';
import { MoodPicker } from '@/components/day/MoodPicker';
import { ReflectionBox } from '@/components/day/ReflectionBox';
import { TaskThread } from '@/components/day/TaskThread';
import { PLAN_LENGTH } from '@/lib/day';
import { MOODS, type PersistedState } from '@/lib/model';
import { useAppStore } from '@/lib/store';
import type { MoodType } from '@/lib/types';
import { useToday } from '@/lib/useToday';
import { buildDayVM, type TaskVM } from '@/lib/view/today';

/** Parses the route param to a plan day (1..PLAN_LENGTH, clamped); null when not a number. */
function parseDay(raw: string | string[] | undefined): number | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === undefined || !/^-?\d+$/.test(value.trim())) return null;
  return Math.min(PLAN_LENGTH, Math.max(1, parseInt(value, 10)));
}

export default function DayDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { n } = useLocalSearchParams<{ n?: string | string[] }>();
  const today = useToday();
  const day = parseDay(n);

  const profile = useAppStore((s) => s.profile);
  const settings = useAppStore((s) => s.settings);
  const cycle = useAppStore((s) => s.cycle);
  const planStartDate = useAppStore((s) => s.planStartDate);
  const planDays = useAppStore((s) => s.planDays);
  const dates = useAppStore((s) => s.dates);
  const milestones = useAppStore((s) => s.milestones);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const setJournal = useAppStore((s) => s.setJournal);
  const setMood = useAppStore((s) => s.setMood);

  useEffect(() => {
    if (day === null) router.back();
  }, [day, router]);

  const vm = useMemo(() => {
    if (day === null) return null;
    const state: PersistedState = { schema: 1, profile, settings, cycle, planStartDate, planDays, dates, milestones };
    return buildDayVM(state, day, today);
  }, [day, profile, settings, cycle, planStartDate, planDays, dates, milestones, today]);

  const moodLabels = useMemo(
    () => Object.fromEntries(MOODS.map((m) => [m, t(`mood.${m}`)])) as Record<MoodType, string>,
    [t],
  );

  if (day === null) return null;

  const header = <Stack.Screen options={{ title: t('day.title', { n: day }) }} />;

  if (!vm) {
    return (
      <Screen>
        {header}
        <Section>
          <AppText variant="body" center muted>{t('today.contentComing')}</AppText>
        </Section>
      </Screen>
    );
  }

  const { content } = vm;
  return (
    <Screen edges={[]}>
      {header}
      <View style={styles.theme}>
        {content.themeArabic ? <AppText variant="arabicLarge" center>{content.themeArabic}</AppText> : null}
        <AppText variant="heading" center>{content.theme}</AppText>
      </View>

      {vm.isFuture ? (
        <AppText variant="small" center muted style={styles.locked}>{t('day.locked', { n: day })}</AppText>
      ) : null}

      <Section title={t('today.intention')}>
        <AppText variant="body">{content.intro}</AppText>
      </Section>

      <Section title={t('today.steps')}>
        <TaskThread
          tasks={vm.tasks}
          editable={vm.editable}
          onToggle={(id) => toggleTask(day, id, today)}
          onLockedPress={() => showToast(t('today.tasbihLocked'))}
          categoryLabel={(c: TaskVM['category']) => t(`category.${c}`)}
          labels={{ a11yDone: t('today.a11yDone') }}
        />
      </Section>

      <Section>
        <ArabicBlock
          arabic={content.hadith.arabic}
          transliteration={content.hadith.transliteration}
          meaning={content.hadith.meaning}
          sourceRef={content.hadith.source.ref}
          size="large"
        />
      </Section>

      {vm.isFuture ? null : (
        <Section title={t('today.reflect')}>
          <ReflectionBox
            key={day}
            question={content.reflection}
            value={vm.journal}
            onChange={(text) => setJournal(day, text, today)}
            placeholder={t('today.reflectPlaceholder')}
            savedLabel={t('today.saved')}
          />
          <AppText variant="small" muted style={styles.moodPrompt}>{t('today.moodPrompt')}</AppText>
          <MoodPicker value={vm.mood} onChange={(m) => setMood(day, m)} labels={moodLabels} />
        </Section>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  theme: { alignItems: 'center', gap: 4, marginTop: 8 },
  locked: { marginTop: 12 },
  moodPrompt: { marginTop: 20, marginBottom: 10 },
});
