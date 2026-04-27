import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { appStorage } from '@/lib/storage';
import { getLevelTitle } from '@/lib/planGenerator';
import { AppState } from '@/lib/types';
import { useTheme } from '@/lib/theme';
import { LogOut, RotateCcw, BookOpen, Star, Flame, Settings, Pencil } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const appState = await appStorage.getState();
    setState(appState);
  };

  const handleLogout = async () => {
    await appStorage.updateState({ isAuthenticated: false });
    router.replace('/(auth)/login');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await appStorage.resetAll();
            router.replace('/(auth)/register');
          },
        },
      ]
    );
  };

  if (!state || !state.userProfile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        <Text style={[styles.loadingText, { color: colors.mutedText }]}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const profile = state.userProfile;
  const levelInfo = getLevelTitle(state.totalPoints);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.primaryGreen }]}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/(modals)/settings')} accessibilityLabel="Open settings" accessibilityRole="button">
            <Settings size={22} color={colors.mediumGreen} />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.mediumGreen }]}>
            <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={[styles.name, { color: colors.primaryGreen }]}>{profile.name}</Text>
          <Text style={[styles.levelBadge, { color: colors.gold }]}>{levelInfo.level}</Text>
          <Text style={[styles.levelArabic, { color: colors.mediumText }]}>{levelInfo.arabic}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Star size={20} color={colors.gold} strokeWidth={2} />
            <Text style={[styles.statValue, { color: colors.darkText }]}>{state.totalPoints}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>Points</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Flame size={20} color={colors.mediumGreen} strokeWidth={2} />
            <Text style={[styles.statValue, { color: colors.darkText }]}>{state.streakDays}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>Streak</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <BookOpen size={20} color={colors.primaryGreen} strokeWidth={2} />
            <Text style={[styles.statValue, { color: colors.darkText }]}>Day {state.currentDay}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>Current</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.paleGreen }]} onPress={() => router.push('/(modals)/edit-profile')} accessibilityLabel="Edit your profile" accessibilityRole="button">
          <Pencil size={16} color={colors.primaryGreen} />
          <Text style={[styles.editButtonText, { color: colors.primaryGreen }]}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Profile Details</Text>
          <View style={[styles.detailCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Age</Text>
              <Text style={[styles.detailValue, { color: colors.darkText }]}>{profile.age}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Gender</Text>
              <Text style={[styles.detailValue, { color: colors.darkText }]}>{profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Knowledge Level</Text>
              <Text style={[styles.detailValue, { color: colors.darkText }]}>{profile.knowledgeLevel.charAt(0).toUpperCase() + profile.knowledgeLevel.slice(1)}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Prayer Consistency</Text>
              <Text style={[styles.detailValue, { color: colors.darkText }]}>{profile.prayerConsistency.charAt(0).toUpperCase() + profile.prayerConsistency.slice(1)}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Daily Time</Text>
              <Text style={[styles.detailValue, { color: colors.darkText }]}>{profile.dailyMinutes} min</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Commitment</Text>
              <Text style={[styles.detailValue, { color: colors.darkText }]}>{profile.commitmentLevel}/10</Text>
            </View>
          </View>
        </View>

        {profile.improvementAreas.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Focus Areas</Text>
            <View style={styles.tagsContainer}>
              {profile.improvementAreas.map((area) => (
                <View key={area} style={[styles.tag, { backgroundColor: colors.paleGreen }]}>
                  <Text style={[styles.tagText, { color: colors.primaryGreen }]}>{area.charAt(0).toUpperCase() + area.slice(1)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {profile.personalGoal ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Personal Goal</Text>
            <View style={[styles.goalCard, { backgroundColor: colors.cardBackground, borderLeftColor: colors.gold }]}>
              <Text style={[styles.goalText, { color: colors.darkText }]}>{profile.personalGoal}</Text>
            </View>
          </View>
        ) : null}

        {profile.challenges ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Challenges</Text>
            <View style={[styles.goalCard, { backgroundColor: colors.cardBackground, borderLeftColor: colors.mediumGreen }]}>
              <Text style={[styles.goalText, { color: colors.darkText }]}>{profile.challenges}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Account</Text>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.cardBackground }]} onPress={handleLogout} accessibilityLabel="Logout" accessibilityRole="button">
            <LogOut size={18} color={colors.mediumGreen} strokeWidth={2} />
            <Text style={[styles.actionText, { color: colors.mediumGreen }]}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleReset} accessibilityLabel="Reset all data" accessibilityRole="button">
            <RotateCcw size={18} color={colors.error} strokeWidth={2} />
            <Text style={[styles.actionText, { color: colors.error }]}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footerText, { color: colors.mutedText }]}>Nafs - 30-Day Islamic Transformation{'\n'}All data stored locally on your device</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 16 },
  loadingText: { textAlign: 'center', fontSize: 16, marginTop: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  header: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#FFFFFF' },
  name: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  levelBadge: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  levelArabic: { fontSize: 12 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', gap: 6 },
  statValue: { fontSize: 16, fontWeight: '700' },
  statLabel: { fontSize: 11 },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 10, marginBottom: 24 },
  editButtonText: { fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  detailCard: { borderRadius: 12, padding: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 13, fontWeight: '600' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
  tagText: { fontSize: 12, fontWeight: '600' },
  goalCard: { borderRadius: 12, padding: 14, borderLeftWidth: 4 },
  goalText: { fontSize: 14, lineHeight: 20 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 10 },
  dangerButton: { backgroundColor: '#FEE8E8' },
  actionText: { fontSize: 14, fontWeight: '600' },
  footerText: { textAlign: 'center', fontSize: 12, marginTop: 8, marginBottom: 24, lineHeight: 18 },
});
