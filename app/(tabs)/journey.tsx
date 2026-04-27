import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { appStorage } from '@/lib/storage';
import { getDayPlan } from '@/lib/planGenerator';
import { AppState } from '@/lib/types';
import { WEEK_TITLES } from '@/constants/islamicContent';
import { useTheme } from '@/lib/theme';

export default function JourneyScreen() {
  const { colors } = useTheme();
  const [state, setState] = useState<AppState | null>(null);
  const [expandedWeek, setExpandedWeek] = useState(1);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const appState = await appStorage.getState();
    setState(appState);
  };

  if (!state || !state.userProfile) {
    return <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}><Text style={[styles.loadingText, { color: colors.mutedText }]}>Loading...</Text></SafeAreaView>;
  }

  const isDayCompleted = (day: number) => state.dayProgress[day]?.completedTaskIds?.length > 0;

  const renderWeek = (weekNum: number) => {
    const weekInfo = WEEK_TITLES[weekNum - 1];
    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = Math.min(weekNum * 7, 30);
    const days = Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);

    return (
      <View key={weekNum} style={styles.weekContainer}>
        <TouchableOpacity
          style={[styles.weekHeader, { backgroundColor: colors.paleGreen, borderBottomColor: weekInfo.color }]}
          onPress={() => setExpandedWeek(expandedWeek === weekNum ? 0 : weekNum)}
          accessibilityLabel={`Week ${weekNum}: ${weekInfo.subtitle}. ${expandedWeek === weekNum ? 'Collapse' : 'Expand'}`}
          accessibilityRole="button"
        >
          <View>
            <Text style={[styles.weekTitle, { color: weekInfo.color }]}>Week {weekNum}: {weekInfo.subtitle}</Text>
            <Text style={[styles.weekArabic, { color: colors.mediumText }]}>{weekInfo.arabic}</Text>
          </View>
          <Text style={[styles.expandIcon, { color: weekInfo.color }]}>{expandedWeek === weekNum ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        {expandedWeek === weekNum && (
          <View style={[styles.daysContainer, { backgroundColor: colors.cardBackground }]}>
            {days.map((day) => {
              const plan = getDayPlan(day);
              const isCompleted = isDayCompleted(day);
              const isCurrent = day === state.currentDay;
              return (
                <View key={day} style={[styles.dayItem, { borderBottomColor: colors.border }]}>
                  <View style={[styles.dayIndicator, { backgroundColor: isCompleted ? colors.success : isCurrent ? colors.gold : colors.paleGreen }]}>
                    <Text style={[styles.dayNumber, { color: isCurrent ? '#FFFFFF' : colors.darkText }]}>{day}</Text>
                  </View>
                  <View style={styles.dayInfo}>
                    <Text style={[styles.dayName, { color: colors.darkText }]}>{plan.theme}</Text>
                    <Text style={[styles.dayProgressText, { color: colors.mutedText }]}>{state.dayProgress[day]?.completedTaskIds?.length ?? 0} / {plan.tasks.length} tasks</Text>
                  </View>
                  {isCompleted && <Text style={[styles.completedBadge, { color: colors.success }]}>✓</Text>}
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primaryGreen }]}>Your Journey</Text>
          <Text style={[styles.subtitle, { color: colors.mediumText }]}>30-Day Transformation Progress</Text>
        </View>
        <View style={[styles.profileCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.profileLabel, { color: colors.darkText }]}>Welcome, {state.userProfile.name}!</Text>
          <Text style={[styles.profileSubtitle, { color: colors.mediumText }]}>Day {state.currentDay} of 30</Text>
          <View style={styles.profileStats}>
            <View style={styles.stat}><Text style={[styles.statValue, { color: colors.mediumGreen }]}>{state.totalPoints}</Text><Text style={[styles.statLabel, { color: colors.mutedText }]}>Total Points</Text></View>
            <View style={styles.stat}><Text style={[styles.statValue, { color: colors.mediumGreen }]}>{state.streakDays}</Text><Text style={[styles.statLabel, { color: colors.mutedText }]}>Day Streak</Text></View>
          </View>
        </View>
        <Text style={[styles.weeksSectionTitle, { color: colors.darkText }]}>All Weeks</Text>
        {[1, 2, 3, 4].map((week) => renderWeek(week))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 16 },
  loadingText: { textAlign: 'center', fontSize: 16, marginTop: 24 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14 },
  profileCard: { borderRadius: 16, padding: 16, marginBottom: 24 },
  profileLabel: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  profileSubtitle: { fontSize: 14, marginBottom: 16 },
  profileStats: { flexDirection: 'row', gap: 16 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
  weeksSectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  weekContainer: { marginBottom: 12, borderRadius: 12, overflow: 'hidden' },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 2 },
  weekTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  weekArabic: { fontSize: 12 },
  expandIcon: { fontSize: 12, fontWeight: '700' },
  daysContainer: { paddingVertical: 12 },
  dayItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1 },
  dayIndicator: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  dayNumber: { fontSize: 14, fontWeight: '700' },
  dayInfo: { flex: 1 },
  dayName: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  dayProgressText: { fontSize: 12 },
  completedBadge: { fontSize: 16, fontWeight: '700' },
});
