import React from 'react';
import { useTranslation } from 'react-i18next';
import { DocPage } from '@/components';

const KEYS = ['storage', 'accounts', 'location', 'backups', 'deletion'] as const;

export default function PrivacyScreen() {
  const { t } = useTranslation();
  return (
    <DocPage
      intro={t('privacy.intro')}
      sections={KEYS.map((k) => ({ title: t(`privacy.${k}.title`), body: t(`privacy.${k}.body`) }))}
      caption={t('privacy.updated', { date: '2026-10-09' })}
    />
  );
}
