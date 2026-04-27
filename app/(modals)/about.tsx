import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@/lib/theme';
import Constants from 'expo-constants';

export default function AboutScreen() {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'About', headerStyle: { backgroundColor: colors.cream }, headerTintColor: colors.primaryGreen }} />
      <SafeAreaView style={[s.container, { backgroundColor: colors.cream }]}>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={s.logoSection}>
            <View style={s.logoCircle}>
              <Text style={s.logoText}>N</Text>
            </View>
            <Text style={s.appName}>Nafs</Text>
            <Text style={s.appArabic}>النفس</Text>
            <Text style={s.version}>Version {version}</Text>
          </View>

          <Text style={s.description}>
            Nafs is a free, offline 30-day Islamic spiritual transformation app designed to help Muslims build consistent daily habits of worship, character development, and spiritual growth.
          </Text>

          <View style={s.section}>
            <Text style={s.sectionTitle}>What's Inside</Text>
            <View style={s.card}>
              <Text style={s.bullet}>30-day structured program with daily themes</Text>
              <Text style={s.bullet}>Morning and evening dhikr with transliteration</Text>
              <Text style={s.bullet}>Daily Quran goals and prayer focus</Text>
              <Text style={s.bullet}>Sunnah practices and character building</Text>
              <Text style={s.bullet}>Authentic hadith with sources</Text>
              <Text style={s.bullet}>Daily reflection questions</Text>
              <Text style={s.bullet}>Points, streaks, and milestone tracking</Text>
              <Text style={s.bullet}>Personalized based on your level</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Content Sources</Text>
            <View style={s.card}>
              <Text style={s.bullet}>Quran translations based on widely accepted English renditions</Text>
              <Text style={s.bullet}>Hadith from Sahih Bukhari, Sahih Muslim, and other authenticated collections</Text>
              <Text style={s.bullet}>Dhikr and dua from established Islamic tradition</Text>
              <Text style={s.bullet}>Sunnah practices referenced from hadith literature</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Our Mission</Text>
            <View style={s.card}>
              <Text style={s.body}>
                To provide every Muslim, regardless of their knowledge level, with an accessible, structured, and meaningful path to spiritual growth — completely free, completely private, and completely offline.
              </Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Contact & Support</Text>
            <View style={s.card}>
              <Text style={s.body}>Email: nafs.app.support@gmail.com</Text>
            </View>
          </View>

          <Text style={s.footer}>Made with faith and dedication{'\n'}for the Muslim ummah</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const makeStyles = (c: typeof import('@/lib/theme').lightTheme) =>
  StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingVertical: 16 },
    logoSection: { alignItems: 'center', marginBottom: 24 },
    logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: c.mediumGreen, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    logoText: { fontSize: 36, fontWeight: '700', color: '#FFFFFF' },
    appName: { fontSize: 28, fontWeight: '700', color: c.primaryGreen, marginBottom: 2 },
    appArabic: { fontSize: 18, color: c.gold, marginBottom: 4 },
    version: { fontSize: 13, color: c.mutedText },
    description: { fontSize: 14, color: c.mediumText, lineHeight: 22, marginBottom: 24, textAlign: 'center' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: c.darkText, marginBottom: 10 },
    card: { backgroundColor: c.cardBackground, borderRadius: 12, padding: 14 },
    bullet: { fontSize: 13, color: c.mediumText, lineHeight: 20, paddingLeft: 8, marginBottom: 4 },
    body: { fontSize: 14, color: c.mediumText, lineHeight: 22 },
    footer: { textAlign: 'center', fontSize: 12, color: c.mutedText, marginTop: 16, marginBottom: 24, lineHeight: 18 },
  });
