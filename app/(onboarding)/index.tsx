import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import {
  AppText, ArabicBlock, Button, DirectionalIcon, FocusChips, HabitOptions, KnowledgeOptions, LanguageOptions,
  MinutesOptions, NameInput, PressableScale, Screen,
} from '@/components';
import { CityPicker } from '@/components/settings/CityPicker';
import { useLocationSetup } from '@/lib/useLocationSetup';
import { useLanguageChange } from '@/lib/useLanguageChange';
import { useAppStore } from '@/lib/store';
import { useToday } from '@/lib/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { useLang } from '@/theme/useLang';
import {
  ONBOARDING_STEPS, buildProfile, canAdvance, toggleFocusArea, type OnboardingDraft,
} from '@/lib/onboarding';
import type { ImprovementArea, KnowledgeLevel, PracticeLevel } from '@/lib/types';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const today = useToday();
  const lang = useLang();
  const changeLanguage = useLanguageChange();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState('');
  const [prayerHabit, setPrayerHabit] = useState<PracticeLevel | null>(null);
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel | null>(null);
  const [focusAreas, setFocusAreas] = useState<ImprovementArea[]>([]);
  const [dailyMinutes, setDailyMinutes] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const hasLocation = useAppStore((s) => s.settings.location !== null);
  const { busy, error, fromGps, chooseCity } = useLocationSetup();

  const step = ONBOARDING_STEPS[stepIndex];
  const draft: OnboardingDraft = useMemo(
    () => ({ name, prayerHabit, knowledgeLevel, focusAreas, dailyMinutes }),
    [name, prayerHabit, knowledgeLevel, focusAreas, dailyMinutes],
  );
  const last = stepIndex === ONBOARDING_STEPS.length - 1;

  const next = () => setStepIndex((i) => Math.min(ONBOARDING_STEPS.length - 1, i + 1));
  const back = () => setStepIndex((i) => Math.max(0, i - 1));

  const finish = () => {
    const profile = buildProfile(draft);
    if (!profile || saving) return;
    setSaving(true);
    completeOnboarding(profile, today);
  };

  const title = t(`onboarding.${step}.title`);
  const habitLabel = prayerHabit ? t(`profile.habit.${prayerHabit}`) : '';

  return (
    <Screen scroll={false} edges={['top', 'bottom']} padded={false}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <View style={styles.backSlot}>
            {stepIndex > 0 ? (
              <PressableScale onPress={back} accessibilityRole="button" accessibilityLabel={t('common.back')} haptic={false} style={styles.back}>
                <DirectionalIcon icon={ChevronLeft} size={24} color={colors.text} />
              </PressableScale>
            ) : null}
          </View>
          <View
            style={styles.dots}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={t('onboarding.progress', { current: stepIndex + 1, total: ONBOARDING_STEPS.length })}
          >
            {ONBOARDING_STEPS.map((s, i) => (
              <View
                key={s}
                style={[styles.dot, { backgroundColor: i <= stepIndex ? colors.accent : colors.line, width: i === stepIndex ? 22 : 8 }]}
              />
            ))}
          </View>
          <View style={styles.backSlot} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {step === 'welcome' ? (
            <View style={styles.welcome}>
              <AppText variant="arabicLarge" style={styles.hero} accessibilityLabel={t('onboarding.welcome.arabicLabel')}>
                {t('onboarding.welcome.arabic')}
              </AppText>
              <AppText variant="display" center accessibilityRole="header">{title}</AppText>
              <AppText variant="body" muted center>{t('onboarding.welcome.body')}</AppText>
            </View>
          ) : (
            <View style={styles.head}>
              <AppText variant="title" accessibilityRole="header">{title}</AppText>
              <AppText variant="body" muted>{t(`onboarding.${step}.subtitle`)}</AppText>
            </View>
          )}

          {step === 'language' ? (
            <LanguageOptions value={lang} onChange={changeLanguage} />
          ) : null}
          {step === 'name' ? <NameInput value={name} onChange={setName} autoFocus /> : null}
          {step === 'habit' ? <HabitOptions value={prayerHabit} onChange={setPrayerHabit} /> : null}
          {step === 'knowledge' ? <KnowledgeOptions value={knowledgeLevel} onChange={setKnowledgeLevel} /> : null}
          {step === 'focus' ? <FocusChips value={focusAreas} onToggle={(a) => setFocusAreas((f) => toggleFocusArea(f, a))} /> : null}
          {step === 'time' ? <MinutesOptions value={dailyMinutes} onChange={setDailyMinutes} /> : null}
          {step === 'prayerTimes' ? (
            <View style={styles.intention}>
              <Button
                label={busy ? t('location.locating') : t('location.useMyLocation')}
                loading={busy}
                onPress={() => { fromGps().then((ok) => { if (ok) next(); }); }}
              />
              <Button variant="secondary" label={t('location.chooseCity')} onPress={() => setPickerOpen(true)} />
              {error ? <AppText variant="small" muted accessibilityLiveRegion="polite">{t(`location.${error}`)}</AppText> : null}
              <CityPicker
                visible={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(city) => { chooseCity(city); setPickerOpen(false); next(); }}
              />
            </View>
          ) : null}
          {step === 'intention' ? (
            <View style={styles.intention}>
              <AppText variant="body" muted center>
                {t('onboarding.intention.summary', {
                  habit: habitLabel,
                  minutes: dailyMinutes === null ? '' : t('profile.minutes', { count: dailyMinutes }),
                })}
              </AppText>
              <ArabicBlock
                size="large"
                arabic={t('onboarding.intention.hadithArabic')}
                meaning={t('onboarding.intention.hadithMeaning')}
                sourceRef={t('onboarding.intention.hadithSource')}
              />
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {step === 'welcome' ? (
            <Button label={t('onboarding.begin')} onPress={next} />
          ) : last ? (
            <Button label={t('onboarding.start')} onPress={finish} loading={saving} disabled={!buildProfile(draft)} />
          ) : (
            <>
              {step === 'prayerTimes' ? (
                <Button
                  variant={hasLocation ? 'primary' : 'ghost'}
                  label={hasLocation ? t('common.continue') : t('onboarding.later')}
                  onPress={next}
                />
              ) : (
                <Button label={t('common.continue')} onPress={next} disabled={!canAdvance(step, draft)} />
              )}
              {step === 'name' ? <Button variant="ghost" label={t('onboarding.skip')} onPress={() => { setName(''); next(); }} /> : null}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, minHeight: 52 },
  backSlot: { width: 44, height: 44 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dots: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 24, flexGrow: 1 },
  head: { gap: 8 },
  welcome: { flex: 1, justifyContent: 'center', alignItems: 'stretch', gap: 16, paddingTop: 48 },
  hero: { fontSize: 72, lineHeight: 120 },
  intention: { gap: 24 },
  footer: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
});
