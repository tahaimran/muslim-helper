import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '@/lib/theme';

export default function TermsOfServiceScreen() {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Terms of Service', headerStyle: { backgroundColor: colors.cream }, headerTintColor: colors.primaryGreen }} />
      <SafeAreaView style={[s.container, { backgroundColor: colors.cream }]}>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={s.lastUpdated}>Last updated: April 2026</Text>

          <Text style={s.heading}>Terms of Service</Text>

          <Text style={s.body}>
            By downloading and using Nafs, you agree to the following terms and conditions. Please read them carefully before using the app.
          </Text>

          <Text style={s.subheading}>1. Acceptance of Terms</Text>
          <Text style={s.body}>
            By accessing or using Nafs, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.
          </Text>

          <Text style={s.subheading}>2. Description of Service</Text>
          <Text style={s.body}>
            {"Nafs is a free, offline 30-day Islamic spiritual transformation application. It provides daily plans, tasks, dhikr, Quran goals, and character-building exercises based on Islamic teachings. The app is provided \"as is\" for personal, non-commercial use."}
          </Text>

          <Text style={s.subheading}>3. Islamic Content Disclaimer</Text>
          <Text style={s.body}>
            The Islamic content in Nafs — including hadith references, Quranic verses, dhikr, and dua — is compiled from reputable sources and is intended for educational and spiritual guidance purposes. While we strive for accuracy:{'\n'}
            {'\n'}- Translations are interpretive and may differ from other scholarly works{'\n'}
            - Hadith sources are cited but users are encouraged to verify with scholars{'\n'}
            - The app is not a substitute for formal Islamic education or scholarly advice{'\n'}
            - Users should consult qualified Islamic scholars for religious rulings (fatwa)
          </Text>

          <Text style={s.subheading}>4. User Responsibilities</Text>
          <Text style={s.body}>
            You are responsible for:{'\n'}
            {'\n'}- Maintaining the security of your device and PIN{'\n'}
            - Backing up your data regularly using the export feature{'\n'}
            - Using the app in a manner consistent with its intended purpose{'\n'}
            - Understanding that the app is a tool for personal spiritual growth, not a religious authority
          </Text>

          <Text style={s.subheading}>5. Data & Privacy</Text>
          <Text style={s.body}>
            All data is stored locally on your device. We do not collect, transmit, or store any personal information on external servers. See our Privacy Policy for complete details.
          </Text>

          <Text style={s.subheading}>6. Limitation of Liability</Text>
          <Text style={s.body}>
            {"Nafs is provided \"as is\" without warranties of any kind. We are not liable for:"}{'\n'}
            {'\n'}- Any loss of data due to device issues, app uninstallation, or system resets{'\n'}
            {"- Any spiritual, religious, or personal decisions made based on the app's content"}{'\n'}
            - Any damages arising from the use or inability to use the app{'\n'}
            - The accuracy or completeness of Islamic content, hadith, or translations
          </Text>

          <Text style={s.subheading}>7. Modifications</Text>
          <Text style={s.body}>
            We reserve the right to modify these terms at any time. Continued use of the app after modifications constitutes acceptance of the updated terms.
          </Text>

          <Text style={s.subheading}>8. Termination</Text>
          <Text style={s.body}>
            You may stop using the app at any time by uninstalling it from your device. Upon uninstallation, all locally stored data will be permanently deleted.
          </Text>

          <Text style={s.subheading}>9. Contact</Text>
          <Text style={s.body}>
            For questions about these Terms of Service, please contact us at nafs.app.support@gmail.com.
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
