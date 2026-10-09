import React from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, ArabicBlock, Screen, Section } from '@/components';
import { MILESTONE_CONTENT } from '@/content/milestones';
import { MILESTONE_IDS, type MilestoneId } from '@/lib/milestones';
import { useAppStore } from '@/lib/store';

function parseId(raw: string | string[] | undefined): MilestoneId | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return (MILESTONE_IDS as readonly string[]).includes(value ?? '') ? (value as MilestoneId) : null;
}

function formatDate(key: string, language: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  try {
    return new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  } catch {
    return key;
  }
}

export default function MilestoneScreen() {
  const { t, i18n } = useTranslation();
  const { id: raw } = useLocalSearchParams<{ id?: string | string[] }>();
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

  const content = MILESTONE_CONTENT[id];
  return (
    <Screen>
      <Stack.Screen options={{ title: t('me.milestones') }} />
      <Section>
        <View style={{ gap: 4 }}>
          <AppText variant="title" accessibilityRole="header">{content.title}</AppText>
          <AppText variant="small" muted>
            {unlockedOn ? t('me.reachedOn', { date: formatDate(unlockedOn, i18n.language) }) : t('me.notYet')}
          </AppText>
        </View>
      </Section>
      <Section>
        <ArabicBlock arabic={content.text.arabic} meaning={content.text.meaning} sourceRef={content.text.source.ref} size="large" />
      </Section>
    </Screen>
  );
}
