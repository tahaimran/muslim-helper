import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme as useAppTheme } from '@/theme/ThemeProvider';
import { useTheme } from '@/lib/theme';

export default function ModalsLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const app = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.cream,
        },
        headerTitleStyle: {
          color: colors.darkText,
          fontSize: 17,
          fontWeight: '600',
        },
        headerTintColor: colors.mediumGreen,
        headerShadowVisible: false,
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}>
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          headerTitle: 'About Nafs',
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          headerTitle: 'Privacy Policy',
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          headerTitle: 'Terms of Service',
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          headerTitle: 'Help & Support',
        }}
      />
      <Stack.Screen
        name="achievements"
        options={{
          headerTitle: 'Achievements',
        }}
      />
      <Stack.Screen
        name="duas"
        options={{
          headerTitle: 'Daily Duas',
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerTitle: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name="day/[n]"
        options={{
          title: t('day.generic'),
          headerStyle: { backgroundColor: app.colors.bg },
          headerTitleStyle: { color: app.colors.text, fontSize: 17, fontFamily: app.font('uiMedium') },
          headerTintColor: app.colors.accent,
        }}
      />
    </Stack>
  );
}
