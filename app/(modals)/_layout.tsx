import { Stack } from 'expo-router';
import { useTheme } from '@/lib/theme';

export default function ModalsLayout() {
  const { colors } = useTheme();

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
    </Stack>
  );
}
