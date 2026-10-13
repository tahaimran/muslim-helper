import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '@/lib/theme';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Privacy Policy', headerStyle: { backgroundColor: colors.cream }, headerTintColor: colors.primaryGreen }} />
      <SafeAreaView style={[s.container, { backgroundColor: colors.cream }]}>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={s.lastUpdated}>Last updated: April 2026</Text>

          <Text style={s.heading}>Privacy Policy for Nafs</Text>

          <Text style={s.body}>
            {"Nafs (\"we\", \"our\", or \"the app\") is committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our mobile application."}
          </Text>

          <Text style={s.subheading}>1. Data Collection</Text>
          <Text style={s.body}>
            Nafs does NOT collect, transmit, or store any personal data on external servers. All your data — including your profile, progress, journal entries, and settings — is stored exclusively on your device using local storage mechanisms.
          </Text>

          <Text style={s.subheading}>2. No Third-Party Sharing</Text>
          <Text style={s.body}>
            We do not share, sell, rent, or trade your personal information with any third parties. Since all data remains on your device, there is no data transmission to external services, advertisers, or analytics platforms.
          </Text>

          <Text style={s.subheading}>3. No Internet Access Required</Text>
          <Text style={s.body}>
            Nafs functions entirely offline. The app does not require an internet connection to operate, and no data is sent to or received from any remote server during normal use. Reminder notifications are scheduled locally on your device; no push-notification service or server is involved.
          </Text>

          <Text style={s.subheading}>4. Local Storage</Text>
          <Text style={s.body}>
            Your data is stored locally on your device. This includes:{'\n'}
            {'\n'}- Your profile information (name, age, preferences){'\n'}
            - Daily progress and task completions{'\n'}
            - Points, streaks, and achievements{'\n'}
            - Journal entries and reflections{'\n'}
            - App settings and preferences{'\n'}
            {'\n'}This data persists on your device until you manually delete it or uninstall the app.
          </Text>

          <Text style={s.subheading}>5. Security</Text>
          <Text style={s.body}>
            {"Your data never leaves your device, which keeps it out of reach of third parties. However, no method of electronic storage is 100% secure. We recommend using your device's built-in security features (screen lock, biometric authentication) for additional protection."}
          </Text>

          <Text style={s.subheading}>{"6. Children's Privacy"}</Text>
          <Text style={s.body}>
            Nafs is suitable for users of all ages. We do not knowingly collect personal information from children, as we do not collect personal information from any users.
          </Text>

          <Text style={s.subheading}>7. Data Backup & Export</Text>
          <Text style={s.body}>
            You can export your data at any time using the Settings screen. Since data is stored locally, uninstalling the app or resetting your device will permanently delete all your data. We recommend regular exports if you wish to preserve your progress.
          </Text>

          <Text style={s.subheading}>8. Changes to This Policy</Text>
          <Text style={s.body}>
            {"We may update this Privacy Policy from time to time. Any changes will be reflected in the \"Last updated\" date above. Continued use of the app after changes constitutes acceptance of the updated policy."}
          </Text>

          <Text style={s.subheading}>9. Contact</Text>
          <Text style={s.body}>
            If you have questions about this Privacy Policy, please contact us at nafs.app.support@gmail.com.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const makeStyles = (c: typeof import('@/lib/theme').lightTheme) =>
  StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingVertical: 16 },
    lastUpdated: { fontSize: 12, color: c.mutedText, marginBottom: 16 },
    heading: { fontSize: 24, fontWeight: '700', color: c.primaryGreen, marginBottom: 16 },
    subheading: { fontSize: 16, fontWeight: '700', color: c.darkText, marginTop: 20, marginBottom: 8 },
    body: { fontSize: 14, color: c.mediumText, lineHeight: 22 },
  });
