import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';

export default function ModalsLayout() {
  const { t } = useTranslation();
  const { colors, font } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.text, fontSize: 17, fontFamily: font('uiMedium') },
        headerTintColor: colors.accent,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        headerBackTitle: t('common.back'),
        contentStyle: { backgroundColor: colors.bg },
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}>
      <Stack.Screen name="settings" options={{ title: t('me.settings') }} />
      <Stack.Screen name="edit-profile" options={{ title: t('me.editProfile') }} />
      <Stack.Screen name="about" options={{ title: t('me.about') }} />
      <Stack.Screen name="privacy" options={{ title: t('me.privacy') }} />
      <Stack.Screen name="terms" options={{ title: t('me.terms') }} />
      <Stack.Screen name="help" options={{ title: t('me.help') }} />
      <Stack.Screen name="duas" options={{ title: t('me.duas') }} />
      <Stack.Screen name="milestone/[id]" options={{ title: t('me.milestones') }} />
      <Stack.Screen name="day/[n]" options={{ title: t('day.generic') }} />
    </Stack>
  );
}
