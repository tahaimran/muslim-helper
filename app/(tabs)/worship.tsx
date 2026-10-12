import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { AppText, ListRow, Screen, Section } from '@/components';
import { AdhkarList } from '@/components/worship/AdhkarList';
import { PrayerTimesList, type PrayerTimeRow } from '@/components/worship/PrayerTimesList';
import { TasbihCounter } from '@/components/worship/TasbihCounter';
import { DAYS } from '@/content/days';
import { EVENING_ADHKAR, MORNING_ADHKAR } from '@/content/learn';
import type { Dhikr } from '@/content/types';
import { formatTime } from '@/lib/dates';
import { getPlanPosition } from '@/lib/day';
import { useAppStore } from '@/lib/store';
import { usePrayerTimes } from '@/lib/usePrayerTimes';
import { useToday } from '@/lib/useToday';
import { useLang } from '@/theme/useLang';
import { adhkarExpansion, buildDhikrOptions, nextRound, ROUND_TARGETS } from '@/lib/view/worship';

const NO_TASBIH: Record<string, number> = {};

function haptic(kind: 'light' | 'success') {
  if (Platform.OS === 'web') return;
  const p = kind === 'light'
    ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  p.catch(() => {});
}

export default function WorshipScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const today = useToday();

  const planStartDate = useAppStore((s) => s.planStartDate);
  const tasbih = useAppStore((s) => s.dates[today]?.tasbih) ?? NO_TASBIH;
  const incrementTasbih = useAppStore((s) => s.incrementTasbih);

  const todayContent = useMemo(() => {
    const pos = getPlanPosition(planStartDate ?? today, today);
    return pos.phase === 'journey' ? DAYS[pos.day - 1] ?? null : null;
  }, [planStartDate, today]);

  const options = useMemo(() => buildDhikrOptions(DAYS, todayContent), [todayContent]);

  const [selectedId, setSelectedId] = useState('subhanallah');
  const [target, setTarget] = useState<number>(ROUND_TARGETS[0]);
  const [round, setRoundState] = useState(0);
  // The latest round, read synchronously by rapid taps so none of them see a stale value.
  const roundRef = useRef(0);
  const setRound = useCallback((next: number) => {
    roundRef.current = next;
    setRoundState(next);
  }, []);

  const selected = options.find((o) => o.id === selectedId) ?? options[0];
  const activeId = selected?.id ?? selectedId;

  const onSelect = useCallback((id: string) => {
    setSelectedId(id);
    setRound(0);
  }, [setRound]);
  const onTargetChange = useCallback((n: number) => {
    setTarget(n);
    setRound(0);
  }, [setRound]);
  const onResetRound = useCallback(() => setRound(0), [setRound]);
  // The per-round counter is UI state only; the store's day total only ever increases.
  // The haptic is chosen from the computed next round, not from a render-time closure.
  const onTap = useCallback(() => {
    if (!selected) return;
    incrementTasbih(today, selected.id);
    const r = nextRound(roundRef.current, target);
    setRound(r.round);
    haptic(r.complete ? 'success' : 'light');
  }, [incrementTasbih, today, selected, target, setRound]);

  // Which adhkar section starts open: from prayer times when a location is saved, else the clock.
  const lang = useLang();
  const { times, next } = usePrayerTimes(today);
  const expansion = useMemo(
    () => adhkarExpansion(new Date(), times ? { dhuhr: times.dhuhr, asr: times.asr } : null),
    // today is a dependency on purpose: re-evaluate when the day rolls over.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [times, today],
  );

  const timeRows = useMemo<PrayerTimeRow[] | null>(() => {
    if (!times) return null;
    const valid = (d: Date) => Number.isFinite(d.getTime());
    const order: ('fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha')[] = [
      'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha',
    ];
    return order
      .filter((k) => valid(times[k]))
      .map((k) => ({
        key: k,
        label: t(`prayers.${k}`),
        time: formatTime(times[k], lang),
        isNext: k !== 'sunrise' && next?.name === k && next.time.getTime() === times[k].getTime(),
      }));
  }, [times, next, lang, t]);

  const sourceLabel = useCallback(
    (d: Dhikr) => {
      if (!d.source) return undefined;
      return d.source.grade ? `${d.source.ref}, ${t(`worship.grade.${d.source.grade}`)}` : d.source.ref;
    },
    [t],
  );

  // Stable handlers so the memoized adhkar lists skip re-rendering on tasbih taps.
  const completeMorning = useCallback(() => {
    incrementTasbih(today, 'morning_adhkar');
    haptic('success');
  }, [incrementTasbih, today]);
  const completeEvening = useCallback(() => {
    incrementTasbih(today, 'evening_adhkar');
    haptic('success');
  }, [incrementTasbih, today]);

  return (
    <Screen>
      <AppText variant="title" accessibilityRole="header" style={styles.title}>{t('worship.title')}</AppText>

      {timeRows ? (
        <Section title={t('worship.prayerTimesToday')}>
          <PrayerTimesList rows={timeRows} note={times?.estimated ? t('prayer.estimated') : undefined} nextLabel={t('worship.nextPrayer')} />
        </Section>
      ) : null}

      <Section title={t('worship.tasbih')}>
        {selected ? (
          <TasbihCounter
            options={options}
            selectedId={activeId}
            onSelect={onSelect}
            target={target}
            onTargetChange={onTargetChange}
            round={round}
            todayCount={tasbih[activeId] ?? 0}
            onTap={onTap}
            onResetRound={onResetRound}
          />
        ) : null}
      </Section>

      {/* Keyed by day so per-item counters start fresh when the date rolls over. */}
      <AdhkarList
        key={`m-${today}`}
        title={t('worship.morning')}
        items={MORNING_ADHKAR}
        defaultExpanded={expansion === 'morning'}
        completed={(tasbih.morning_adhkar ?? 0) >= 1}
        completeLabel={t('worship.completeMorning')}
        completedLabel={t('worship.completedMorning')}
        onComplete={completeMorning}
        sourceLabel={sourceLabel}
      />
      <AdhkarList
        key={`e-${today}`}
        title={t('worship.evening')}
        items={EVENING_ADHKAR}
        defaultExpanded={expansion === 'evening'}
        completed={(tasbih.evening_adhkar ?? 0) >= 1}
        completeLabel={t('worship.completeEvening')}
        completedLabel={t('worship.completedEvening')}
        onComplete={completeEvening}
        sourceLabel={sourceLabel}
      />

      <View style={styles.duas}>
        <ListRow title={t('worship.duas')} onPress={() => router.push('/(modals)/duas')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 8 },
  duas: { marginTop: 32 },
});
