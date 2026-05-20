import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { appStorage } from '@/lib/storage';
import { useTheme } from '@/lib/theme';
import { ACHIEVEMENTS, getAchievementProgress } from '@/lib/achievements';
import { AppState } from '@/lib/types';
import { Lock } from 'lucide-react-native';

export default function AchievementsScreen() {
  const { colors } = useTheme();
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    (async () => { setState(await appStorage.getState()); })();
  }, []);

  if (!state) return null;

  const unlocked = ACHIEVEMENTS.filter(a => getAchievementProgress(a, state) >= a.requirement);
  const locked = ACHIEVEMENTS.filter(a => getAchievementProgress(a, state) < a.requirement);

  const categoryOrder = ['prayer', 'quran', 'dhikr', 'sunnah', 'character', 'streak', 'milestone'] as const;
  const grouped = categoryOrder.map(cat => ({
    category: cat,
    achievements: ACHIEVEMENTS.filter(a => a.category === cat),
  }));

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Achievements', headerStyle: { backgroundColor: colors.cream }, headerTintColor: colors.primaryGreen }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.summaryNumber, { color: colors.primaryGreen }]}>{unlocked.length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.mutedText }]}>of {ACHIEVEMENTS.length} achievements unlocked</Text>
            <View style={[styles.summaryBar, { backgroundColor: colors.paleGreen }]}>
              <View style={[styles.summaryBarFill, { width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%`, backgroundColor: colors.mediumGreen }]} />
            </View>
          </View>

          {grouped.map(({ category, achievements }) => (
            <View key={category} style={styles.categorySection}>
              <Text style={[styles.categoryTitle, { color: colors.darkText }]}>
                {category === 'prayer' ? 'Prayer' : category === 'quran' ? 'Quran' : category === 'dhikr' ? 'Dhikr' : category === 'sunnah' ? 'Sunnah' : category === 'character' ? 'Character' : category === 'streak' ? 'Streak' : 'Milestones'}
              </Text>
              {achievements.map((achievement) => {
                const progress = getAchievementProgress(achievement, state);
                const isUnlocked = progress >= achievement.requirement;
                const percent = Math.min((progress / achievement.requirement) * 100, 100);

                return (
                  <View key={achievement.id} style={[styles.achievementCard, { backgroundColor: colors.cardBackground, opacity: isUnlocked ? 1 : 0.7 }]}>
                    <View style={styles.achievementHeader}>
                      <Text style={styles.achievementIcon}>{isUnlocked ? achievement.icon : '🔒'}</Text>
                      <View style={styles.achievementInfo}>
                        <Text style={[styles.achievementTitle, { color: isUnlocked ? colors.darkText : colors.mutedText }]}>{achievement.title}</Text>
                        <Text style={[styles.achievementArabic, { color: colors.gold }]}>{achievement.titleArabic}</Text>
                        <Text style={[styles.achievementDesc, { color: colors.mediumText }]}>{achievement.description}</Text>
                      </View>
                    </View>
                    <View style={[styles.achievementBar, { backgroundColor: colors.paleGreen }]}>
                      <View style={[styles.achievementBarFill, { width: `${percent}%`, backgroundColor: isUnlocked ? colors.success : colors.mediumGreen }]} />
                    </View>
                    <Text style={[styles.achievementProgress, { color: colors.mutedText }]}>{progress}/{achievement.requirement}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 16 },
  summaryCard: { borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 24 },
  summaryNumber: { fontSize: 36, fontWeight: '700', marginBottom: 4 },
  summaryLabel: { fontSize: 14, marginBottom: 12 },
  summaryBar: { height: 8, borderRadius: 4, overflow: 'hidden', width: '100%' },
  summaryBarFill: { height: '100%' },
  categorySection: { marginBottom: 20 },
  categoryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, textTransform: 'capitalize' },
  achievementCard: { borderRadius: 12, padding: 14, marginBottom: 8 },
  achievementHeader: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  achievementIcon: { fontSize: 28 },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  achievementArabic: { fontSize: 12, marginBottom: 4 },
  achievementDesc: { fontSize: 12, lineHeight: 18 },
  achievementBar: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  achievementBarFill: { height: '100%' },
  achievementProgress: { fontSize: 11, textAlign: 'right' },
});
