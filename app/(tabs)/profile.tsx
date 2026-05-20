import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { appStorage } from '@/lib/storage';
import { getLevelTitle } from '@/lib/planGenerator';
import { AppState } from '@/lib/types';
import { useTheme } from '@/lib/theme';
import { RotateCcw, BookOpen, Star, Flame, Settings, Pencil, Heart, User } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const appState = await appStorage.getState();
    setState(appState);
  };

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleReset = () => {
    triggerHaptic();
    Alert.alert(
      'Reset All Progress',
      'This will permanently delete all your journey data. Are you sure you want to start fresh?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            await appStorage.resetAll();
            router.replace('/(onboarding)');
          },
        },
      ]
    );
  };

  if (!state || !state.userProfile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        <Text style={styles.loadingText}>Gathering your profile...</Text>
      </SafeAreaView>
    );
  }

  const profile = state.userProfile;
  const levelInfo = getLevelTitle(state.totalPoints);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown} style={styles.header}>
          <Text style={[styles.title, { color: colors.primaryGreen }]}>Your Presence</Text>
          <TouchableOpacity onPress={() => { router.push('/(modals)/settings'); triggerHaptic(); }}>
            <Settings size={22} color={colors.mediumGreen} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.profileMain}>
          <View style={[styles.avatar, { backgroundColor: colors.white }]}>
            <User size={40} color={colors.mediumGreen} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.darkText }]}>{profile.name}</Text>
            <View style={styles.levelTag}>
              <Star size={12} color={colors.gold} fill={colors.gold} />
              <Text style={[styles.levelText, { color: colors.gold }]}>{levelInfo.level}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.editCircle, { backgroundColor: colors.white }]} onPress={() => { router.push('/(modals)/edit-profile'); triggerHaptic(); }}>
            <Pencil size={18} color={colors.mediumGreen} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.white }]}>
            <Flame size={20} color={colors.gold} />
            <Text style={[styles.statValue, { color: colors.darkText }]}>{state.streakDays}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>Streak</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.white }]}>
            <Star size={20} color={colors.mediumGreen} />
            <Text style={[styles.statValue, { color: colors.darkText }]}>{state.totalPoints}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>Points</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.white }]}>
            <BookOpen size={20} color={colors.primaryGreen} />
            <Text style={[styles.statValue, { color: colors.darkText }]}>{state.currentDay}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>Day</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={18} color={colors.mediumGreen} />
            <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Your Focus</Text>
          </View>
          <View style={styles.tagsContainer}>
            {profile.improvementAreas.map((area) => (
              <View key={area} style={[styles.tag, { backgroundColor: colors.white }]}>
                <Text style={[styles.tagText, { color: colors.primaryGreen }]}>{area}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitleSmall, { color: colors.mutedText }]}>Preferences</Text>
          <View style={[styles.detailsCard, { backgroundColor: colors.white }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.mediumText }]}>Knowledge Level</Text>
              <Text style={[styles.detailValue, { color: colors.darkText }]}>{profile.knowledgeLevel}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.mediumText }]}>Prayer Consistency</Text>
              <Text style={[styles.detailValue, { color: colors.darkText }]}>{profile.prayerConsistency}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.detailLabel, { color: colors.mediumText }]}>Daily Goal</Text>
              <Text style={[styles.detailValue, { color: colors.darkText }]}>{profile.dailyMinutes} mins</Text>
            </View>
          </View>
        </View>

        <View style={styles.accountSection}>
          <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.resetButton, { backgroundColor: colors.white }]} 
            onPress={handleReset}
          >
            <RotateCcw size={18} color={colors.error} />
            <Text style={[styles.resetText, { color: colors.error }]}>Reset My Journey</Text>
          </TouchableOpacity>
          <Text style={[styles.footerText, { color: colors.mutedText }]}>
            Nafs v1.0 • Local Storage Mode{'\n'}Your data stays on this device.
          </Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingText: { textAlign: 'center', fontSize: 16, marginTop: 40 },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800' },
  profileMain: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, gap: 20 },
  avatar: { width: 80, height: 80, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 1 },
  profileInfo: { flex: 1 },
  name: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  levelTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelText: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  editCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, padding: 20, borderRadius: 28, alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600' },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  sectionTitleSmall: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  tagText: { fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  detailsCard: { padding: 20, borderRadius: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.03)' },
  detailLabel: { fontSize: 14, fontWeight: '600' },
  detailValue: { fontSize: 14, fontWeight: '700' },
  accountSection: { alignItems: 'center', gap: 20, marginTop: 10 },
  resetButton: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 24, paddingVertical: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  resetText: { fontSize: 15, fontWeight: '700' },
  footerText: { textAlign: 'center', fontSize: 12, fontWeight: '500', lineHeight: 20 },
});

