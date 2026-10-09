import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Check, Share2 } from 'lucide-react-native';
import {
  AppText, ArabicBlock, Button, ListRow, PrayerHorizon, PressableScale, Screen, Section, SkyHeader, showToast,
} from '@/components';
import { MoodPicker } from '@/components/day/MoodPicker';
import { ReflectionBox } from '@/components/day/ReflectionBox';
import { TaskThread } from '@/components/day/TaskThread';
import { WELCOME_BACK } from '@/content/milestones';
import type { SourcedText } from '@/content/types';
import { toHijri } from '@/lib/hijri';
import { MOODS, PRAYER_NAMES, type PersistedState } from '@/lib/model';
import { useAppStore } from '@/lib/store';
import type { MoodType, PrayerName } from '@/lib/types';
import { useToday } from '@/lib/useToday';
import { buildTodayVM, istiqamahJournalDay, type TaskVM } from '@/lib/view/today';
import { SKY, getSkyPhase } from '@/theme/sky';
import { useTheme } from '@/theme/ThemeProvider';
import { useLang } from '@/theme/useLang';

const CONFIRM_MS = 4000;

/** The current time, refreshed every minute (drives the sky phase and the sun). */
function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export default function TodayScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const lang = useLang();
  const today = useToday();
  const now = useNow();

  const profile = useAppStore((s) => s.profile);
  const settings = useAppStore((s) => s.settings);
  const cycle = useAppStore((s) => s.cycle);
  const planStartDate = useAppStore((s) => s.planStartDate);
  const planDays = useAppStore((s) => s.planDays);
  const dates = useAppStore((s) => s.dates);
  const milestones = useAppStore((s) => s.milestones);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const togglePrayer = useAppStore((s) => s.togglePrayer);
  const setJournal = useAppStore((s) => s.setJournal);
  const setMood = useAppStore((s) => s.setMood);
  const startNextCycle = useAppStore((s) => s.startNextCycle);

  const vm = useMemo(() => {
    const state: PersistedState = { schema: 1, profile, settings, cycle, planStartDate, planDays, dates, milestones };
    return buildTodayVM(state, today);
  }, [profile, settings, cycle, planStartDate, planDays, dates, milestones, today]);

  const phase = getSkyPhase(now, null);
  const sky = SKY[phase];

  const prayerLabels = useMemo(
    () => Object.fromEntries(PRAYER_NAMES.map((p) => [p, t(`prayers.${p}`)])) as Record<PrayerName, string>,
    [t],
  );
  const moodLabels = useMemo(
    () => Object.fromEntries(MOODS.map((m) => [m, t(`mood.${m}`)])) as Record<MoodType, string>,
    [t],
  );
  const categoryLabel = (c: TaskVM['category']) => t(`category.${c}`);

  const dateLine = useMemo(() => {
    const parts: string[] = [];
    const h = toHijri(now);
    if (h) parts.push(t('today.hijriDate', { day: h.day, month: t(`hijri.months.${h.month}`), year: h.year }));
    let greg: string;
    try {
      greg = new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
    } catch {
      greg = now.toDateString();
    }
    parts.push(greg);
    return parts.join(' · ');
    // Recompute when the calendar day or language changes, not every minute.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, lang, t]);

  // Inline confirm for starting a new cycle: a second tap within 4s.
  const [confirming, setConfirming] = useState(false);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (confirmTimer.current) clearTimeout(confirmTimer.current);
  }, []);
  const onNewCycle = () => {
    if (confirming) {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      confirmTimer.current = null;
      setConfirming(false);
      startNextCycle(today);
      return;
    }
    setConfirming(true);
    confirmTimer.current = setTimeout(() => {
      confirmTimer.current = null;
      setConfirming(false);
    }, CONFIRM_MS);
  };

  const share = (text: SourcedText) => {
    const message = `${text.meaning}\n— ${text.source.ref}\n\n${t('share.footer')}`;
    Share.share({ message }).catch(() => showToast(t('errors.generic'), 'error'));
  };

  const name = profile?.name.trim();
  const greeting = name ? t('today.greeting', { name }) : t('today.greetingNoName');
  const content = vm.day?.content;
  const title = vm.istiqamah ? t('istiqamah.title') : content?.theme ?? t('today.dayN', { day: vm.day?.day ?? '' });
  const titleArabic = vm.istiqamah ? t('istiqamah.titleArabic') : content?.themeArabic ?? '';

  return (
    <Screen padded={false} edges={[]} contentStyle={styles.noTop}>
      <SkyHeader phase={phase} greeting={greeting} title={title} titleArabic={titleArabic} dateLine={dateLine}>
        <View style={styles.horizonPad}>
          <PrayerHorizon
            labels={prayerLabels}
            times={null}
            done={vm.prayersDone}
            now={now}
            textColor={sky.text}
            mutedColor={sky.textMuted}
            accent={colors.accent}
            onToggle={(p) => togglePrayer(today, p)}
          />
        </View>
      </SkyHeader>

      <View style={styles.body}>
        {settings.location ? null : (
          <View style={styles.setTimes}>
            <Button variant="ghost" label={t('today.setPrayerTimes')} onPress={() => router.push('/(modals)/settings')} />
          </View>
        )}

        {vm.welcomeBack ? (
          <Section>
            <ArabicBlock arabic={WELCOME_BACK.arabic} meaning={WELCOME_BACK.meaning} sourceRef={WELCOME_BACK.source.ref} />
            <AppText variant="body" center muted style={styles.welcomeLine}>{t('today.welcomeBack')}</AppText>
          </Section>
        ) : null}

        {vm.showLearnSalah ? (
          <Section>
            <ListRow title={t('today.learnSalah')} subtitle={t('today.learnSalahHint')} onPress={() => router.push('/(tabs)/learn')} />
          </Section>
        ) : null}

        {vm.day && content ? (
          <>
            <Section title={t('today.intention')} subtitle={t('today.dayN', { day: vm.day.day })}>
              <AppText variant="body">{content.intro}</AppText>
            </Section>

            <Section title={t('today.steps')}>
              <TaskThread
                tasks={vm.day.tasks}
                editable={vm.day.editable}
                onToggle={(id) => toggleTask(vm.day!.day, id, today)}
                onLockedPress={() => showToast(t('today.tasbihLocked'))}
                categoryLabel={categoryLabel}
                labels={{ a11yDone: t('today.a11yDone') }}
              />
            </Section>

            <HadithBlock text={content.hadith} onShare={share} shareLabel={t('today.share')} />

            <Section title={t('today.reflect')}>
              <ReflectionBox
                question={content.reflection}
                value={vm.day.journal}
                onChange={(text) => setJournal(vm.day!.day, text, today)}
                placeholder={t('today.reflectPlaceholder')}
                savedLabel={t('today.saved')}
              />
              <AppText variant="small" muted style={styles.moodPrompt}>{t('today.moodPrompt')}</AppText>
              <MoodPicker value={vm.day.mood} onChange={(m) => setMood(vm.day!.day, m)} labels={moodLabels} />
            </Section>
          </>
        ) : null}

        {vm.phase === 'journey' && !vm.day ? (
          <Section>
            <AppText variant="body" center muted>{t('today.contentComing')}</AppText>
          </Section>
        ) : null}

        {vm.istiqamah ? (
          <>
            <Section title={t('istiqamah.steps')} subtitle={t('istiqamah.subtitle')}>
              <ListRow
                title={t('istiqamah.morning')}
                onPress={() => router.push('/(tabs)/worship')}
                trailing={vm.istiqamah.morningDone ? <Check size={20} color={colors.accent} accessibilityLabel={t('today.a11yDone')} /> : undefined}
              />
              <ListRow
                title={t('istiqamah.evening')}
                onPress={() => router.push('/(tabs)/worship')}
                trailing={vm.istiqamah.eveningDone ? <Check size={20} color={colors.accent} accessibilityLabel={t('today.a11yDone')} /> : undefined}
              />
            </Section>

            <HadithBlock text={vm.istiqamah.hadith} onShare={share} shareLabel={t('today.share')} />

            <Section title={t('today.reflect')}>
              <ReflectionBox
                key={vm.istiqamah.reflectionKey}
                question={t('istiqamah.reflection')}
                value={vm.istiqamah.journal}
                onChange={(text) => setJournal(istiqamahJournalDay(vm.istiqamah!.reflectionKey), text, today)}
                placeholder={t('today.reflectPlaceholder')}
                savedLabel={t('today.saved')}
              />
            </Section>

            <Section title={t('istiqamah.newCycleTitle')} subtitle={t('istiqamah.newCycleHint')}>
              <Button
                variant="secondary"
                label={confirming ? t('istiqamah.confirm') : t('istiqamah.newCycle')}
                onPress={onNewCycle}
              />
            </Section>
          </>
        ) : null}
      </View>
    </Screen>
  );
}

function HadithBlock({ text, onShare, shareLabel }: { text: SourcedText; onShare: (t: SourcedText) => void; shareLabel: string }) {
  const { colors } = useTheme();
  return (
    <Section>
      <ArabicBlock arabic={text.arabic} transliteration={text.transliteration} meaning={text.meaning} sourceRef={text.source.ref} size="large" />
      <View style={styles.shareRow}>
        <PressableScale onPress={() => onShare(text)} accessibilityRole="button" accessibilityLabel={shareLabel} style={styles.shareBtn}>
          <Share2 size={20} color={colors.textMuted} />
        </PressableScale>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  noTop: { paddingTop: 0 },
  horizonPad: { paddingHorizontal: 8 },
  body: { paddingHorizontal: 20 },
  setTimes: { marginTop: 8, alignItems: 'center' },
  welcomeLine: { marginTop: 12 },
  moodPrompt: { marginTop: 20, marginBottom: 10 },
  shareRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  shareBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
