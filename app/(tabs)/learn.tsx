import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppText, Screen } from '@/components';

export default function LearnScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <AppText variant="title">{t('tabs.learn')}</AppText>
    </Screen>
  );
}
