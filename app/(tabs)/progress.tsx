import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { appStorage } from '@/lib/storage';
import { getDaysCompleted, getOverallProgress, getLevelTitle } from '@/lib/planGenerator';
import { AppState } from '@/lib/types';
import { useTheme } from '@/lib/theme';
import { getUnlockedAchievements } from '@/lib/achievements';
import { Trophy, BookOpen, Star, TrendingUp, Award } from 'lucide-react-native';

export default function ProgressScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => { setState(await appStorage.getState()); };

  if (!state) return <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}><Text style={styles.loadingText}>Gathering your growth...</Text></SafeAreaView>;

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
  ].map(cat => {
    let count = 0;
    for (const progress of Object.values(state.dayProgress)) {
      for (const taskId of progress.completedTaskIds) {
        if (taskId.startsWith(cat.key)) count++;
      }
    }
    return { ...cat, count };
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown} style={styles.header}>
          <Text style={[styles.title, { color: colors.primaryGreen }]}>Your Growth</Text>
          <Text style={[styles.subtitle, { color: colors.mediumText }]}>Nurturing your soul, step by step</Text>
        </Animated.View>

        <View style={styles.mainStatsContainer}>
          <BlurView intensity={Platform.OS === 'ios' ? 40 : 100} tint={mode === 'dark' ? 'dark' : 'light'} style={[styles.mainStatsCard, { backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' }]}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={[styles.levelLabel, { color: colors.mutedText }]}>Current Level</Text>
                <Text style={[styles.levelName, { color: colors.primaryGreen }]}>{levelInfo.level}</Text>
              </View>
              <Award size={32} color={colors.gold} />
            </View>

            <View style={styles.overallProgressContainer}>
              <View style={styles.progressInfo}>
                <Text style={[styles.progressTitle, { color: colors.darkText }]}>Journey Completion</Text>
                <Text style={[styles.progressPercent, { color: colors.mediumGreen }]}>{Math.round(overallProgress)}%</Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.paleGreen }]}>
                <Animated.View layout={Layout.springify()} style={[styles.progressFill, { width: `${overallProgress}%`, backgroundColor: colors.mediumGreen }]} />
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: colors.gold }]}>{daysCompleted}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedText }]}>Days</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: colors.gold }]}>{state.totalPoints}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedText }]}>Points</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: colors.gold }]}>{state.streakDays}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedText }]}>Streak</Text>
              </View>
            </View>
          </BlurView>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.white }]} 
            onPress={() => router.push('/(modals)/achievements')}
          >
            <Trophy size={22} color={colors.gold} />
            <View>
              <Text style={[styles.actionTitle, { color: colors.darkText }]}>Achievements</Text>
              <Text style={[styles.actionSub, { color: colors.mutedText }]}>{unlockedAchievements.length} Unlocked</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.white }]} 
            onPress={() => router.push('/(modals)/duas')}
          >
            <BookOpen size={22} color={colors.mediumGreen} />
            <View>
              <Text style={[styles.actionTitle, { color: colors.darkText }]}>Duas Library</Text>
              <Text style={[styles.actionSub, { color: colors.mutedText }]}>Browse Collection</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.breakdownSection}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={colors.mediumGreen} />
            <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Focus Breakdown</Text>
          </View>
          
          <View style={[styles.breakdownCard, { backgroundColor: colors.white }]}>
            {categoryStats.map((cat, index) => {
              const max = 30; // Approximation for visualization
              const percent = Math.min((cat.count / max) * 100, 100);
              return (
                <View key={cat.key} style={[styles.breakdownRow, index === categoryStats.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.breakdownIcon}>{cat.icon}</Text>
                  <View style={styles.breakdownInfo}>
                    <View style={styles.breakdownLabelRow}>
                      <Text style={[styles.breakdownName, { color: colors.darkText }]}>{cat.name}</Text>
                      <Text style={[styles.breakdownCount, { color: colors.gold }]}>{cat.count}</Text>
                    </View>
                    <View style={[styles.smallProgressBar, { backgroundColor: colors.paleGreen }]}>
                      <View style={[styles.smallProgressFill, { width: `${percent}%`, backgroundColor: colors.mediumGreen }]} />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
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
  header: { marginBottom: 28 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 15, fontWeight: '500' },
  mainStatsContainer: { marginBottom: 32, borderRadius: 32, overflow: 'hidden' },
  mainStatsCard: { padding: 24, borderRadius: 32 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  levelLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  levelName: { fontSize: 24, fontWeight: '800' },
  overallProgressContainer: { marginBottom: 28 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  progressTitle: { fontSize: 15, fontWeight: '700' },
  progressPercent: { fontSize: 20, fontWeight: '800' },
  progressBar: { height: 10, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 12, fontWeight: '600' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(0,0,0,0.05)' },
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  actionCard: { flex: 1, padding: 20, borderRadius: 28, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  actionTitle: { fontSize: 15, fontWeight: '700' },
  actionSub: { fontSize: 11, fontWeight: '600' },
  breakdownSection: { gap: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  breakdownCard: { padding: 20, borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.03)' },
  breakdownIcon: { fontSize: 20, marginRight: 16 },
  breakdownInfo: { flex: 1 },
  breakdownLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  breakdownName: { fontSize: 14, fontWeight: '700' },
  breakdownCount: { fontSize: 14, fontWeight: '800' },
  smallProgressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  smallProgressFill: { height: '100%', borderRadius: 3 },
});

