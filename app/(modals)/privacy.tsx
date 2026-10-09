import React from 'react';
import { useTranslation } from 'react-i18next';
import { DocPage } from '@/components';
import { LEGAL_UPDATED, formatLegalDate } from '@/lib/legal';
import { useLang } from '@/theme/useLang';

const KEYS = ['storage', 'accounts', 'location', 'deletion'] as const;

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  return (
    <DocPage
      intro={t('privacy.intro')}
      sections={KEYS.map((k) => ({ title: t(`privacy.${k}.title`), body: t(`privacy.${k}.body`) }))}
      caption={t('privacy.updated', { date: formatLegalDate(LEGAL_UPDATED, lang) })}
    />
  );
}
