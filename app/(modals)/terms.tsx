import React from 'react';
import { useTranslation } from 'react-i18next';
import { DocPage } from '@/components';

const KEYS = ['guidance', 'scholars', 'asIs', 'yourData'] as const;

export default function TermsScreen() {
  const { t } = useTranslation();
  return (
    <DocPage
      intro={t('terms.intro')}
      sections={KEYS.map((k) => ({ title: t(`terms.${k}.title`), body: t(`terms.${k}.body`) }))}
      caption={t('terms.updated', { date: '2026-10-09' })}
    />
  );
}
