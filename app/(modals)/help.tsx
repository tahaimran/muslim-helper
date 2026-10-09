import React from 'react';
import { useTranslation } from 'react-i18next';
import { DocPage } from '@/components';

const FAQ = ['days', 'missed', 'past', 'prayers', 'tasbih', 'language', 'reset'] as const;

export default function HelpScreen() {
  const { t } = useTranslation();
  return (
    <DocPage intro={t('help.intro')} sections={FAQ.map((k) => ({ title: t(`help.${k}.q`), body: t(`help.${k}.a`) }))} />
  );
}
