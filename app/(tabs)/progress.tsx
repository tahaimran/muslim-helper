import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { appStorage } from '@/lib/storage';
import { getDaysCompleted, getOverallProgress, getLevelTitle } from '@/lib/planGenerator';
import { AppState } from '@/lib/types';
import { useTheme } from '@/lib/theme';
import { getUnlockedAchievements } from '@/lib/achievements';
import { Trophy, BookOpen, Star } from 'lucide-react-native';

export default function ProgressScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => { setState(await appStorage.getState()); };

  if (!state) return <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}><Text style={[styles.loadingText, { color: colors.mutedText }]}>Loading...</Text></SafeAreaView>;

  const daysCompleted = getDaysCompleted(state.dayProgress);
  const overallProgress = getOverallProgress(state.dayProgress);
  const levelInfo = getLevelTitle(state.totalPoints);
  const unlockedAchievements = getUnlockedAchievements(state);

  const categoryStats = [
    { name: 'Prayer', key: 'prayer', icon: '🕌' },
    { name: 'Quran', key: 'quran', icon: '📖' },
    { name: 'Dhikr', key: 'dhikr', icon: '📿' },
    { name: 'Sunnah', key: 'sunnah', icon: '🌙' },
    { name: 'Character', key: 'character', icon: '💎' },
    { name: 'Reflection', key: 'reflection', icon: '💭' },
  ].map(cat => {
    let count = 0;
    for (const progress of Object.values(state.dayProgress)) {
      for (const taskId of progress.completedTaskIds) {
        if (taskId.startsWith(cat.key)) count++;
      }
    }
    return { ...cat, count };
  });

  const totalTasksCompleted = categoryStats.reduce((sum, c) => sum + c.count, 0);

  const milestones = [
    { label: 'Complete First Week', target: 7 },
    { label: 'Halfway There!', target: 14 },
    { label: 'Three Weeks Strong', target: 21 },
    { label: 'Complete 30-Day Journey', target: 30 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primaryGreen }]}>Your Progress</Text>
          <Text style={[styles.subtitle, { color: colors.mediumText }]}>Spiritual Growth Metrics</Text>
        </View>

        <View style={[styles.mainStatsCard, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.progressCircle, { backgroundColor: colors.paleGreen }]}>
            <Text style={[styles.progressPercent, { color: colors.primaryGreen }]}>{Math.round(overallProgress)}%</Text>
            <Text style={[styles.progressLabel, { color: colors.mediumText }]}>Complete</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statBlock}><Text style={[styles.statNumber, { color: colors.gold }]}>{daysCompleted}</Text><Text style={[styles.statName, { color: colors.mutedText }]}>Days Done</Text></View>
            <View style={styles.statBlock}><Text style={[styles.statNumber, { color: colors.gold }]}>{state.totalPoints}</Text><Text style={[styles.statName, { color: colors.mutedText }]}>Points</Text></View>
            <View style={styles.statBlock}><Text style={[styles.statNumber, { color: colors.gold }]}>{state.streakDays}</Text><Text style={[styles.statName, { color: colors.mutedText }]}>Streak</Text></View>
          </View>
        </View>

        <View style={[styles.levelCard, { backgroundColor: colors.cardBackground, borderLeftColor: colors.gold }]}>
          <Text style={[styles.levelLabel, { color: colors.mutedText }]}>Current Level</Text>
          <Text style={[styles.levelName, { color: colors.mediumGreen }]}>{levelInfo.level}</Text>
          <Text style={[styles.levelArabic, { color: colors.gold }]}>{levelInfo.arabic}</Text>
        </View>

        <View style={styles.quickLinks}>
          <TouchableOpacity style={[styles.quickLinkCard, { backgroundColor: colors.cardBackground }]} onPress={() => router.push('/(modals)/achievements')} accessibilityLabel="View achievements" accessibilityRole="button">
            <Trophy size={20} color={colors.gold} />
            <View style={styles.quickLinkInfo}>
              <Text style={[styles.quickLinkTitle, { color: colors.darkText }]}>Achievements</Text>
              <Text style={[styles.quickLinkSub, { color: colors.mutedText }]}>{unlockedAchievements.length} unlocked</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickLinkCard, { backgroundColor: colors.cardBackground }]} onPress={() => router.push('/(modals)/duas')} accessibilityLabel="Browse duas library" accessibilityRole="button">
            <BookOpen size={20} color={colors.mediumGreen} />
            <View style={styles.quickLinkInfo}>
              <Text style={[styles.quickLinkTitle, { color: colors.darkText }]}>Duas Library</Text>
              <Text style={[styles.quickLinkSub, { color: colors.mutedText }]}>Browse collections</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.categorySection}>
          <Text style={[styles.categoryTitle, { color: colors.darkText }]}>Category Breakdown</Text>
          <Text style={[styles.categorySubtitle, { color: colors.mutedText }]}>{totalTasksCompleted} total tasks completed</Text>
          {categoryStats.map((cat) => {
            const maxPossible = 30;
            const percent = maxPossible > 0 ? (cat.count / maxPossible) * 100 : 0;
            return (
              <View key={cat.key} style={[styles.categoryBar, { backgroundColor: colors.cardBackground }]}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryName, { color: colors.darkText }]}>{cat.name}</Text>
                <View style={[styles.categoryProgressBar, { backgroundColor: colors.paleGreen }]}>
                  <View style={[styles.categoryProgressFill, { width: `${percent}%`, backgroundColor: colors.mediumGreen }]} />
                </View>
                <Text style={[styles.categoryCount, { color: colors.mutedText }]}>{cat.count}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.milestoneSection}>
          <Text style={[styles.milestoneTitle, { color: colors.darkText }]}>Milestones</Text>
          {milestones.map((m) => {
            const done = daysCompleted >= m.target;
            return (
              <View key={m.target} style={[styles.milestoneItem, { backgroundColor: colors.cardBackground }]}>
                <View style={[styles.milestoneMark, { backgroundColor: done ? colors.success : colors.paleGreen }]}>
                  <Text style={styles.milestoneIcon}>✓</Text>
                </View>
                <Text style={[styles.milestoneText, { color: colors.darkText }]}>{m.label}</Text>
                <Text style={[styles.milestoneStatus, { color: colors.mutedText }]}>{done ? 'Done!' : `${daysCompleted}/${m.target}`}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 16 },
  loadingText: { textAlign: 'center', fontSize: 16, marginTop: 24 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14 },
  mainStatsCard: { borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center' },
  progressCircle: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  progressPercent: { fontSize: 36, fontWeight: '700' },
  progressLabel: { fontSize: 12, marginTop: 4 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  statBlock: { alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  statName: { fontSize: 11, textAlign: 'center' },
  levelCard: { borderRadius: 16, padding: 16, marginBottom: 16, borderLeftWidth: 4 },
  levelLabel: { fontSize: 12, fontWeight: '500', marginBottom: 4 },
  levelName: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  levelArabic: { fontSize: 14, fontWeight: '600' },
  quickLinks: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  quickLinkCard: { flex: 1, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  quickLinkInfo: { flex: 1 },
  quickLinkTitle: { fontSize: 14, fontWeight: '700' },
  quickLinkSub: { fontSize: 11, marginTop: 2 },
  categorySection: { marginBottom: 20 },
  categoryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  categorySubtitle: { fontSize: 12, marginBottom: 12 },
  categoryBar: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryIcon: { fontSize: 16 },
  categoryName: { fontSize: 13, fontWeight: '600', width: 70 },
  categoryProgressBar: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  categoryProgressFill: { height: '100%' },
  categoryCount: { fontSize: 12, fontWeight: '600', width: 30, textAlign: 'right' },
  milestoneSection: { marginBottom: 24 },
  milestoneTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  milestoneItem: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  milestoneMark: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  milestoneIcon: { fontSize: 16, color: '#FFFFFF', fontWeight: '700' },
  milestoneText: { fontSize: 13, fontWeight: '600', flex: 1 },
  milestoneStatus: { fontSize: 11, fontWeight: '500' },
});
