import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@/lib/theme';

const FAQ_ITEMS = [
  {
    q: 'How does the 30-day program work?',
    a: 'Each day has a unique theme with 5-6 tasks covering prayer, Quran, dhikr, sunnah practices, character building, and reflection. Complete tasks to earn points and build your streak.',
  },
  {
    q: 'Can I use the app offline?',
    a: 'Yes! Nafs works entirely offline. All content and data is stored on your device. No internet connection is needed.',
  },
  {
    q: 'How are points calculated?',
    a: 'Each task has a point value (10-30 points). Complete tasks to earn points. Your total points determine your level: Beginner Seeker, Dedicated Student, Sincere Worshipper, Devoted Believer, or Champion of the Deen.',
  },
  {
    q: 'How does the streak work?',
    a: 'Your streak counts consecutive days with at least one completed task. Complete tasks daily to maintain and grow your streak.',
  },
  {
    q: 'Can I go back to previous days?',
    a: 'Yes! Use the Journey tab to view and complete tasks from any previous day. You can also review past content and hadith.',
  },
  {
    q: 'Is my data private?',
    a: 'Absolutely. All your data stays on your device. We do not collect, transmit, or share any personal information. See our Privacy Policy for details.',
  },
  {
    q: 'How do I backup my progress?',
    a: 'Go to Settings > Data > Export Data to create a backup. You can import this backup on a new device using the Import Data option.',
  },
  {
    q: 'What if I forget my PIN?',
    a: 'Currently, there is no PIN recovery option. You would need to reset the app from Settings, which will clear all data. We recommend using a memorable PIN.',
  },
  {
    q: 'How is the content personalized?',
    a: 'During onboarding, you select your knowledge level and available daily time. Beginners get simplified task descriptions, and the number of daily tasks adjusts based on your time commitment.',
  },
  {
    q: 'Are the hadith authentic?',
    a: 'We cite hadith sources (e.g., Bukhari, Muslim, Ibn Majah). However, we encourage users to verify with scholars for religious rulings. The app is for educational and motivational purposes.',
  },
  {
    q: 'Can I edit my profile after onboarding?',
    a: 'Yes! Go to the Profile tab and tap "Edit Profile" to update your information, goals, and preferences.',
  },
  {
    q: 'What happens after 30 days?',
    a: 'After completing the 30-day program, you can review all days, revisit your favorite content, and continue building on the habits you have established.',
  },
];

export default function HelpScreen() {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Help & FAQ', headerStyle: { backgroundColor: colors.cream }, headerTintColor: colors.primaryGreen }} />
      <SafeAreaView style={[s.container, { backgroundColor: colors.cream }]}>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={s.intro}>Frequently asked questions about Nafs</Text>

          {FAQ_ITEMS.map((item, i) => (
            <View key={i} style={s.faqItem}>
              <Text style={s.question}>{item.q}</Text>
              <Text style={s.answer}>{item.a}</Text>
            </View>
          ))}

          <View style={s.contactCard}>
            <Text style={s.contactTitle}>Still need help?</Text>
            <Text style={s.contactBody}>Email us at nafs.app.support@gmail.com and we will get back to you as soon as possible.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const makeStyles = (c: typeof import('@/lib/theme').lightTheme) =>
  StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingVertical: 16 },
    intro: { fontSize: 14, color: c.mutedText, marginBottom: 20 },
    faqItem: { backgroundColor: c.cardBackground, borderRadius: 12, padding: 14, marginBottom: 12 },
    question: { fontSize: 14, fontWeight: '700', color: c.darkText, marginBottom: 8 },
    answer: { fontSize: 13, color: c.mediumText, lineHeight: 20 },
    contactCard: { backgroundColor: c.paleGreen, borderRadius: 12, padding: 16, marginTop: 8, marginBottom: 24 },
    contactTitle: { fontSize: 14, fontWeight: '700', color: c.primaryGreen, marginBottom: 6 },
    contactBody: { fontSize: 13, color: c.mediumText, lineHeight: 20 },
  });
