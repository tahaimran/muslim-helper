import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  AppText, Button, FocusChips, HabitOptions, KnowledgeOptions, MinutesOptions, NameInput, Screen, Section, showToast,
} from '@/components';
import { useAppStore } from '@/lib/store';
import { buildProfile, toggleFocusArea } from '@/lib/onboarding';
import type { ImprovementArea, KnowledgeLevel, PracticeLevel } from '@/lib/types';

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);

  const [name, setName] = useState(profile?.name ?? '');
  const [prayerHabit, setPrayerHabit] = useState<PracticeLevel | null>(profile?.prayerHabit ?? null);
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel | null>(profile?.knowledgeLevel ?? null);
  const [focusAreas, setFocusAreas] = useState<ImprovementArea[]>(profile?.focusAreas ?? []);
  const [dailyMinutes, setDailyMinutes] = useState<number | null>(profile?.dailyMinutes ?? null);

  const next = buildProfile({ name, prayerHabit, knowledgeLevel, focusAreas, dailyMinutes });
  const valid = next !== null && next.focusAreas.length >= 1;

  const save = () => {
    if (!next || !valid) return;
    updateProfile(next);
    showToast(t('profile.saved'));
    router.back();
  };

  return (
    <Screen edges={['bottom']}>
      <Section title={t('profile.name')} subtitle={t('profile.nameOptional')}>
        <NameInput value={name} onChange={setName} />
      </Section>
      <Section title={t('onboarding.habit.title')}>
        <HabitOptions value={prayerHabit} onChange={setPrayerHabit} />
      </Section>
      <Section title={t('onboarding.knowledge.title')}>
        <KnowledgeOptions value={knowledgeLevel} onChange={setKnowledgeLevel} />
      </Section>
      <Section title={t('onboarding.focus.title')} subtitle={t('onboarding.focus.subtitle')}>
        <FocusChips value={focusAreas} onToggle={(a) => setFocusAreas((f) => toggleFocusArea(f, a))} />
      </Section>
      <Section title={t('onboarding.time.title')}>
        <MinutesOptions value={dailyMinutes} onChange={setDailyMinutes} />
      </Section>
      <View style={styles.footer}>
        {!valid ? <AppText variant="small" muted style={styles.hint}>{t('profile.needFocus')}</AppText> : null}
        <Button label={t('common.save')} onPress={save} disabled={!valid} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: { marginTop: 32 },
  hint: { marginBottom: 8 },
});
