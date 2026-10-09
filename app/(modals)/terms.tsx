import React from 'react';
import { useTranslation } from 'react-i18next';
import { DocPage } from '@/components';
import { LEGAL_UPDATED, formatLegalDate } from '@/lib/legal';
import { useLang } from '@/theme/useLang';

const KEYS = ['guidance', 'scholars', 'asIs', 'yourData'] as const;

export default function TermsScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  return (
    <DocPage
      intro={t('terms.intro')}
      sections={KEYS.map((k) => ({ title: t(`terms.${k}.title`), body: t(`terms.${k}.body`) }))}
      caption={t('terms.updated', { date: formatLegalDate(LEGAL_UPDATED, lang) })}
    />
  );
}
