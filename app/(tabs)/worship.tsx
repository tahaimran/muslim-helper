import React, { useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { AppText, ListRow, Screen, Section } from '@/components';
import { AdhkarList } from '@/components/worship/AdhkarList';
import { TasbihCounter } from '@/components/worship/TasbihCounter';
import { DAYS } from '@/content/days';
import { EVENING_ADHKAR, MORNING_ADHKAR } from '@/content/learn';
import type { Dhikr } from '@/content/types';
import { getPlanPosition } from '@/lib/day';
import { getPrayerTimes, resolveCalcSettings } from '@/lib/prayerTimes';
import { useAppStore } from '@/lib/store';
import { useToday } from '@/lib/useToday';
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

  const settings = useAppStore((s) => s.settings);
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
  const [round, setRound] = useState(0);

  const selected = options.find((o) => o.id === selectedId) ?? options[0];
  const activeId = selected?.id ?? selectedId;

  const onSelect = useCallback((id: string) => {
    setSelectedId(id);
    setRound(0);
  }, []);
  const onTargetChange = useCallback((n: number) => {
    setTarget(n);
    setRound(0);
  }, []);
  // The per-round counter is UI state only; the store's day total only ever increases.
  const onTap = useCallback(() => {
    if (!selected) return;
    incrementTasbih(today, selected.id);
    const r = nextRound(round, target);
    setRound(r.round);
    haptic(r.complete ? 'success' : 'light');
  }, [incrementTasbih, today, selected, round, target]);

  // Which adhkar section starts open: from prayer times when a location is saved, else the clock.
  const { location, calcMethod, madhab } = settings;
  const expansion = useMemo(() => {
    const now = new Date();
    let times: { dhuhr: Date; asr: Date } | null = null;
    if (location) {
      try {
        const calc = resolveCalcSettings({ calcMethod, madhab }, location.countryCode);
        const p = getPrayerTimes(now, location, calc.method, calc.madhab);
        times = { dhuhr: p.dhuhr, asr: p.asr };
      } catch {
        times = null;
      }
    }
    return adhkarExpansion(now, times);
    // today is a dependency on purpose: re-evaluate when the day rolls over.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, calcMethod, madhab, today]);

  const sourceLabel = useCallback(
    (d: Dhikr) => {
      if (!d.source) return undefined;
      return d.source.grade ? `${d.source.ref}, ${t(`worship.grade.${d.source.grade}`)}` : d.source.ref;
    },
    [t],
  );

  const complete = (id: 'morning_adhkar' | 'evening_adhkar') => {
    incrementTasbih(today, id);
    haptic('success');
  };

  return (
    <Screen>
      <AppText variant="title" accessibilityRole="header" style={styles.title}>{t('worship.title')}</AppText>

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
            onResetRound={() => setRound(0)}
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
        onComplete={() => complete('morning_adhkar')}
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
        onComplete={() => complete('evening_adhkar')}
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
