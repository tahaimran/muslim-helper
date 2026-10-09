import React from 'react';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { DocPage } from '@/components';

export default function AboutScreen() {
  const { t } = useTranslation();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <DocPage
      intro={t('about.intro')}
      sections={[
        { title: t('about.whatTitle'), body: t('about.whatBody') },
        { title: t('about.freeTitle'), body: t('about.freeBody') },
        { title: t('about.sourcesTitle'), body: t('about.sourcesBody') },
      ]}
      caption={t('about.version', { version })}
    />
  );
}
