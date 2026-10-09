import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Screen } from '@/components';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen scroll={false} contentStyle={{ justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <AppText variant="heading" center>{t('errors.notFound')}</AppText>
        <Button label={t('common.home')} onPress={() => router.replace('/(tabs)')} />
      </Screen>
    </>
  );
}
