import React from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, ArabicBlock, Screen, Section } from '@/components';
import { localizeMilestone, showMeaning } from '@/content/i18n';
import { formatLongDate } from '@/lib/dates';
import { MILESTONE_IDS, type MilestoneId } from '@/lib/milestones';
import { sourceLabel } from '@/lib/sourceRef';
import { useAppStore } from '@/lib/store';
import { useLang } from '@/theme/useLang';

function parseId(raw: string | string[] | undefined): MilestoneId | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return (MILESTONE_IDS as readonly string[]).includes(value ?? '') ? (value as MilestoneId) : null;
}

export default function MilestoneScreen() {
  const { t, i18n } = useTranslation();
  const { id: raw } = useLocalSearchParams<{ id?: string | string[] }>();
  const lang = useLang();
  const id = parseId(raw);
  const unlockedOn = useAppStore((s) => (id ? s.milestones[id] ?? null : null));

  if (!id) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('me.milestones') }} />
        <Section><AppText variant="body" center muted>{t('me.milestoneUnknown')}</AppText></Section>
      </Screen>
    );
  }

  const content = localizeMilestone(id, lang);
  return (
    <Screen>
      <Stack.Screen options={{ title: t('me.milestones') }} />
      <Section>
        <View style={{ gap: 4 }}>
          <AppText variant="title" accessibilityRole="header">{content.title}</AppText>
          <AppText variant="small" muted>
            {unlockedOn ? t('me.reachedOn', { date: formatLongDate(unlockedOn, i18n.language) }) : t('me.notYet')}
          </AppText>
        </View>
      </Section>
      <Section>
        <ArabicBlock arabic={content.text.arabic} meaning={showMeaning(lang) ? content.text.meaning : undefined} sourceRef={sourceLabel(content.text.source, t, lang)} size="large" />
      </Section>
    </Screen>
  );
}
