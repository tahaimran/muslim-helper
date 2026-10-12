import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Share2 } from 'lucide-react-native';
import {
  AppText, ArabicBlock, Button, ListRow, PrayerHorizon, PressableScale, Screen, Section, SkyHeader, showToast,
} from '@/components';
import { MoodPicker } from '@/components/day/MoodPicker';
import { ReflectionBox } from '@/components/day/ReflectionBox';
import { TaskThread } from '@/components/day/TaskThread';
import { localizedWelcomeBack, showMeaning } from '@/content/i18n';
import type { SourcedText } from '@/content/types';
import { dateFromKey, formatTime, formatWeekdayDate } from '@/lib/dates';
import type { DateKey } from '@/lib/day';
import { toHijri } from '@/lib/hijri';
import { MOODS, PRAYER_NAMES, persistedFrom } from '@/lib/model';
import { useAppStore } from '@/lib/store';
import type { MoodType, PrayerName } from '@/lib/types';
import { useDatesWithoutTasbih } from '@/lib/useDatesWithoutTasbih';
import { useNow } from '@/lib/useNow';
import { usePrayerTimes } from '@/lib/usePrayerTimes';
import { useToday } from '@/lib/useToday';
import { countdownLine } from '@/lib/view/nextPrayer';
import { buildTodayVM, istiqamahJournalDay, type TaskVM } from '@/lib/view/today';
import { SKY, getSkyPhase } from '@/theme/sky';
import { useTheme } from '@/theme/ThemeProvider';
import { useLang } from '@/theme/useLang';

const CONFIRM_MS = 4000;

type SkyAreaProps = {
  today: DateKey;
  greeting: string;
  title: string;
  titleArabic: string;
  dateLine: string;
  prayersDone: PrayerName[];
  onTogglePrayer: (p: PrayerName) => void;
};

/** Owns the minute clock so only the sky re-renders as time passes, not the whole screen. */
function SkyArea({ today, greeting, title, titleArabic, dateLine, prayersDone, onTogglePrayer }: SkyAreaProps) {
  const { t } = useTranslation();
  const now = useNow();
  const lang = useLang();
  // One clock drives the sky, the next prayer and its countdown.
  const { times, next } = usePrayerTimes(today, now);
  const phase = getSkyPhase(now, times);
  const sky = SKY[phase];
  const timeLabel = useCallback((d: Date) => formatTime(d, lang), [lang]);
  const nextPrayerLine = useMemo(() => {
    if (!next) return undefined;
    const prayer = t(`prayers.${next.name}`);
    const time = timeLabel(next.time);
    const { key, h, m } = countdownLine(now, next.time);
    return t(key, { prayer, time, h, m });
  }, [next, now, t, timeLabel]);
  const prayerLabels = useMemo(
    () => Object.fromEntries(PRAYER_NAMES.map((p) => [p, t(`prayers.${p}`)])) as Record<PrayerName, string>,
    [t],
  );
  return (
    <SkyHeader phase={phase} greeting={greeting} title={title} titleArabic={titleArabic} dateLine={dateLine} nextPrayerLine={nextPrayerLine}>
      <View style={styles.horizonPad}>
        <PrayerHorizon
          labels={prayerLabels}
          times={times}
          timeLabel={timeLabel}
          done={prayersDone}
          now={now}
          textColor={sky.text}
          mutedColor={sky.textMuted}
          phase={phase}
          onToggle={onTogglePrayer}
        />
        {times?.estimated ? (
          <AppText variant="caption" center color={sky.textMuted} style={styles.estimated}>{t('prayer.estimated')}</AppText>
        ) : null}
      </View>
    </SkyHeader>
  );
}

export default function TodayScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = useLang();
  const today = useToday();

  // Narrow slices: settings and milestones are not read here except whether a location is set.
  const profile = useAppStore((s) => s.profile);
  const hasLocation = useAppStore((s) => s.settings.location !== null);
  const cycle = useAppStore((s) => s.cycle);
  const planStartDate = useAppStore((s) => s.planStartDate);
  const planDays = useAppStore((s) => s.planDays);
  // Past days only need active flags and prayers; today's log also carries the tasbih counts
  // that can complete a step.
  const pastDates = useDatesWithoutTasbih();
  const todayLog = useAppStore((s) => s.dates[today]);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const togglePrayer = useAppStore((s) => s.togglePrayer);
  const setJournal = useAppStore((s) => s.setJournal);
  const setMood = useAppStore((s) => s.setMood);
  const startNextCycle = useAppStore((s) => s.startNextCycle);

  const vm = useMemo(() => {
    const dates = todayLog ? { ...pastDates, [today]: todayLog } : pastDates;
    return buildTodayVM(persistedFrom({ profile, cycle, planStartDate, planDays, dates }), today, lang);
  }, [profile, cycle, planStartDate, planDays, pastDates, todayLog, today, lang]);
  const welcomeBack = useMemo(() => localizedWelcomeBack(lang), [lang]);
  const meaningShown = showMeaning(lang);

  const moodLabels = useMemo(
    () => Object.fromEntries(MOODS.map((m) => [m, t(`mood.${m}`)])) as Record<MoodType, string>,
    [t],
  );
  const categoryLabel = (c: TaskVM['category']) => t(`category.${c}`);

  // Built from `today` (not a clock) so it rolls over exactly when the date key does.
  const dateLine = useMemo(() => {
    const gregorian = formatWeekdayDate(today, lang);
    const h = toHijri(dateFromKey(today));
    if (!h) return gregorian;
    const hijri = t('today.hijriDate', { day: h.day, month: t(`hijri.months.${h.month}`), year: h.year });
    return t('today.dateLine', { hijri, gregorian });
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
    const message = `${meaningShown ? text.meaning : text.arabic}\n— ${text.source.ref}\n\n${t('share.footer')}`;
    Share.share({ message }).catch(() => showToast(t('errors.generic'), 'error'));
  };

  const onTogglePrayer = useCallback((p: PrayerName) => togglePrayer(today, p), [togglePrayer, today]);

  const name = profile?.name.trim();
  const greeting = name ? t('today.greeting', { name }) : t('today.greetingNoName');
  const content = vm.day?.content;
  const title = vm.istiqamah ? t('istiqamah.title') : content?.theme ?? t('today.dayN', { day: vm.day?.day ?? '' });
  const titleArabic = vm.istiqamah ? t('istiqamah.titleArabic') : content?.themeArabic ?? '';

  return (
    <Screen padded={false} edges={[]} contentStyle={styles.noTop}>
      <SkyArea
        today={today}
        greeting={greeting}
        title={title}
        titleArabic={titleArabic}
        dateLine={dateLine}
        prayersDone={vm.prayersDone}
        onTogglePrayer={onTogglePrayer}
      />

      <View style={styles.body}>
        {hasLocation ? null : (
          <View style={styles.setTimes}>
            <Button variant="ghost" label={t('today.setPrayerTimes')} onPress={() => router.push('/(modals)/settings')} />
          </View>
        )}

        {vm.welcomeBack ? (
          <Section>
            <ArabicBlock arabic={welcomeBack.arabic} meaning={meaningShown ? welcomeBack.meaning : undefined} sourceRef={welcomeBack.source.ref} />
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

            <HadithBlock text={content.hadith} showMeaningLine={meaningShown} onShare={share} shareLabel={t('today.share')} />

            <Section title={t('today.reflect')}>
              <ReflectionBox
                key={`${vm.day.cycle}:${vm.day.day}`}
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
                subtitle={vm.istiqamah.morningDone ? t('istiqamah.doneToday') : undefined}
              />
              <ListRow
                title={t('istiqamah.evening')}
                onPress={() => router.push('/(tabs)/worship')}
                subtitle={vm.istiqamah.eveningDone ? t('istiqamah.doneToday') : undefined}
              />
            </Section>

            <HadithBlock text={vm.istiqamah.hadith} showMeaningLine={meaningShown} onShare={share} shareLabel={t('today.share')} />

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

function HadithBlock({ text, showMeaningLine, onShare, shareLabel }: { text: SourcedText; showMeaningLine: boolean; onShare: (t: SourcedText) => void; shareLabel: string }) {
  const { colors } = useTheme();
  return (
    <Section>
      <ArabicBlock arabic={text.arabic} transliteration={text.transliteration} meaning={showMeaningLine ? text.meaning : undefined} sourceRef={text.source.ref} size="large" />
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
  estimated: { marginTop: 4 },
  body: { paddingHorizontal: 20 },
  setTimes: { marginTop: 8, alignItems: 'center' },
  welcomeLine: { marginTop: 12 },
  moodPrompt: { marginTop: 20, marginBottom: 10 },
  shareRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  shareBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
