import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { appStorage } from '@/lib/storage';
import { getDayPlan, calculateDayPoints } from '@/lib/planGenerator';
import { AppState, DayPlan, DayProgress, MoodType } from '@/lib/types';
import { CATEGORY_COLORS, WEEK_TITLES } from '@/constants/islamicContent';
import { useTheme } from '@/lib/theme';
import { Check, Share2, BookOpen } from 'lucide-react-native';

const MOOD_OPTIONS: { value: MoodType; emoji: string; label: string }[] = [
  { value: 'grateful', emoji: '🤲', label: 'Grateful' },
  { value: 'peaceful', emoji: '☮️', label: 'Peaceful' },
  { value: 'motivated', emoji: '💪', label: 'Motivated' },
  { value: 'reflective', emoji: '💭', label: 'Reflective' },
  { value: 'struggling', emoji: '🙏', label: 'Struggling' },
];

function getHijriDate(): { date: string; month: string } {
  const today = new Date();
  const islamicEpoch = new Date(622, 6, 16);
  const diffMs = today.getTime() - islamicEpoch.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const lunarCycles = diffDays / 29.530588853;
  const lunarYears = Math.floor(lunarCycles / 12);
  const lunarMonths = Math.floor(lunarCycles % 12);
  const lunarDays = Math.floor((lunarCycles % 1) * 29.53);
  const months = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];
  return { date: `${lunarDays + 1}`, month: months[lunarMonths % 12] };
}

export default function TodayScreen() {
  const { colors } = useTheme();
  const [state, setState] = useState<AppState | null>(null);
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [dayProgress, setDayProgress] = useState<DayProgress | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [showStreakRecovery, setShowStreakRecovery] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const appState = await appStorage.getState();
    if (appState) {
      setState(appState);
      const plan = getDayPlan(appState.currentDay);
      setDayPlan(plan);
      const progress = appState.dayProgress[appState.currentDay] ?? { day: appState.currentDay, completedTaskIds: [] };
      setDayProgress(progress);
      setJournalEntry(progress.journalEntry ?? '');
      setSelectedMood(progress.mood ?? null);

      const lastActive = new Date(appState.lastActiveDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 1 && appState.streakDays > 0) {
        setShowStreakRecovery(true);
      }
    }
  };

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const toggleTask = async (taskId: string) => {
    if (!state || !dayProgress || !dayPlan) return;
    const isCompleted = dayProgress.completedTaskIds.includes(taskId);
    const newCompletedIds = isCompleted
      ? dayProgress.completedTaskIds.filter((id) => id !== taskId)
      : [...dayProgress.completedTaskIds, taskId];
    const updatedProgress: DayProgress = { ...dayProgress, completedTaskIds: newCompletedIds, journalEntry: dayProgress.journalEntry };
    await appStorage.saveDayProgress(dayProgress.day, updatedProgress);
    const totalPoints = state.totalPoints +
      calculateDayPoints(newCompletedIds, dayPlan.tasks) -
      calculateDayPoints(dayProgress.completedTaskIds, dayPlan.tasks);
    const newState: AppState = { ...state, totalPoints, dayProgress: { ...state.dayProgress, [dayProgress.day]: updatedProgress } };
    setState(newState);
    setDayProgress(updatedProgress);
    await appStorage.setState(newState);

    if (!isCompleted) {
      triggerHaptic();
      const allDone = newCompletedIds.length === dayPlan.tasks.length;
      if (allDone && Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const saveJournal = async () => {
    if (!state || !dayProgress) return;
    const updated: DayProgress = { ...dayProgress, journalEntry, mood: selectedMood ?? undefined };
    await appStorage.saveDayProgress(dayProgress.day, updated);
    const newState: AppState = { ...state, dayProgress: { ...state.dayProgress, [dayProgress.day]: updated } };
    setState(newState);
  };

  const setMood = async (mood: MoodType) => {
    const newMood = selectedMood === mood ? null : mood;
    setSelectedMood(newMood);
    if (!state || !dayProgress) return;
    const updated: DayProgress = { ...dayProgress, mood: newMood ?? undefined };
    await appStorage.saveDayProgress(dayProgress.day, updated);
    const newState: AppState = { ...state, dayProgress: { ...state.dayProgress, [dayProgress.day]: updated } };
    setState(newState);
  };

  const handleShare = async () => {
    if (!dayPlan) return;
    const text = `Day ${dayPlan.day} - ${dayPlan.theme} (${dayPlan.themeArabic})\n\n"${dayPlan.hadith.text}"\n- ${dayPlan.hadith.source}\n\nNafs - 30-Day Islamic Transformation`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: `Day ${dayPlan.day}`, text }); } catch { /* cancelled */ }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  };

  const recoverStreak = async () => {
    if (!state) return;
    const newState: AppState = { ...state, lastActiveDate: new Date().toDateString() };
    await appStorage.setState(newState);
    setState(newState);
    setShowStreakRecovery(false);
  };

  const progressPercentage = dayProgress ? (dayProgress.completedTaskIds.length / (dayPlan?.tasks.length || 1)) * 100 : 0;
  const weekNumber = dayPlan ? Math.ceil(dayPlan.day / 7) : 1;
  const weekInfo = WEEK_TITLES[weekNumber - 1];

  if (!state || !dayPlan || !dayProgress) {
    return <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}><Text style={[styles.loadingText, { color: colors.mutedText }]}>Loading...</Text></SafeAreaView>;
  }

  const dayPoints = calculateDayPoints(dayProgress.completedTaskIds, dayPlan.tasks);
  const allTasksDone = dayProgress.completedTaskIds.length === dayPlan.tasks.length;
  const hijri = getHijriDate();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.dayLabel, { color: colors.gold }]}>Day {dayPlan.day} of 30</Text>
              <Text style={[styles.dayTitle, { color: colors.primaryGreen }]}>{dayPlan.theme}</Text>
              <Text style={[styles.dayArabic, { color: colors.gold }]}>{dayPlan.themeArabic}</Text>
              <Text style={[styles.hijriDate, { color: colors.mediumText }]}>{hijri.date} {hijri.month}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleShare} accessibilityLabel="Share today's content" accessibilityRole="button" style={styles.iconButton}>
                <Share2 size={20} color={colors.mediumGreen} />
              </TouchableOpacity>
              <View style={[styles.pointsCard, { backgroundColor: weekInfo.color }]}>
                <Text style={styles.pointsValue}>{dayPoints}</Text>
                <Text style={styles.pointsLabel}>Points</Text>
              </View>
            </View>
          </View>
        </View>

        {showStreakRecovery && (
          <Animated.View entering={FadeIn} style={[styles.streakRecoveryCard, { backgroundColor: colors.paleGold, borderLeftColor: colors.gold }]}>
            <Text style={[styles.streakRecoveryTitle, { color: colors.darkText }]}>Streak at Risk!</Text>
            <Text style={[styles.streakRecoveryText, { color: colors.mediumText }]}>You missed some days. Continue now to keep your streak alive.</Text>
            <TouchableOpacity style={[styles.streakRecoveryButton, { backgroundColor: colors.mediumGreen }]} onPress={recoverStreak} accessibilityLabel="Recover your streak">
              <Text style={styles.streakRecoveryButtonText}>Continue Journey</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={[styles.weekBanner, { backgroundColor: colors.paleGreen, borderLeftColor: weekInfo.color, borderLeftWidth: 4 }]}>
          <Text style={[styles.weekLabel, { color: colors.darkText }]}>Week {weekNumber}: {weekInfo.subtitle}</Text>
          <Text style={[styles.weekArabic, { color: colors.mediumText }]}>{weekInfo.arabic}</Text>
        </View>

        <Text style={[styles.description, { color: colors.mediumText }]}>{dayPlan.themeDescription}</Text>

        <View style={styles.progressSection}>
          <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Tasks for Today</Text>
          <View style={[styles.progressBar, { backgroundColor: colors.paleGreen }]}>
            <Animated.View style={[styles.progressFill, { width: `${progressPercentage}%`, backgroundColor: weekInfo.color }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.mutedText }]}>{dayProgress.completedTaskIds.length} of {dayPlan.tasks.length} completed</Text>
        </View>

        {allTasksDone && (
          <Animated.View entering={ZoomIn} style={[styles.completionBanner, { backgroundColor: colors.paleGreen }]}>
            <Text style={styles.completionEmoji}>Masha'Allah!</Text>
            <Text style={[styles.completionText, { color: colors.primaryGreen }]}>All tasks completed for today!</Text>
          </Animated.View>
        )}

        <View style={styles.tasksContainer}>
          {dayPlan.tasks.map((task, index) => {
            const isCompleted = dayProgress.completedTaskIds.includes(task.id);
            const categoryColor = CATEGORY_COLORS[task.category];
            return (
              <Animated.View key={task.id} entering={FadeIn.delay(index * 50)}>
                <TouchableOpacity
                  style={[styles.taskCard, isCompleted && styles.taskCardCompleted, { borderLeftColor: categoryColor.text, borderLeftWidth: 4, backgroundColor: colors.cardBackground }]}
                  onPress={() => toggleTask(task.id)}
                  accessibilityLabel={`${isCompleted ? 'Completed' : 'Incomplete'}: ${task.title}, ${task.points} points`}
                  accessibilityRole="button"
                >
                  <View style={styles.taskContent}>
                    <View style={styles.taskHeader}>
                      <Text style={styles.taskIcon}>{categoryColor.icon}</Text>
                      <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted, { color: isCompleted ? colors.mutedText : colors.darkText }]}>{task.title}</Text>
                    </View>
                    <View style={styles.taskFooter}>
                      <Text style={[styles.taskCategory, { color: colors.mutedText }]}>{task.category.charAt(0).toUpperCase() + task.category.slice(1)}</Text>
                      <Text style={[styles.taskPoints, { color: colors.gold }]}>+{task.points} pts</Text>
                    </View>
                  </View>
                  {isCompleted && (
                    <Animated.View entering={ZoomIn} style={[styles.checkmark, { backgroundColor: categoryColor.text }]}>
                      <Check size={16} color="#FFFFFF" strokeWidth={3} />
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={[styles.motivationCard, { backgroundColor: colors.cardBackground, borderLeftColor: colors.gold }]}>
          <Text style={[styles.motivationText, { color: colors.darkText }]}>"{dayPlan.hadith.text}"</Text>
          <Text style={[styles.motivationSource, { color: colors.gold }]}>{dayPlan.hadith.source}</Text>
        </View>

        <View style={styles.reflectionSection}>
          <View style={styles.reflectionHeader}>
            <BookOpen size={18} color={colors.primaryGreen} />
            <Text style={[styles.reflectionLabel, { color: colors.darkText }]}>Today's Reflection</Text>
          </View>
          <Text style={[styles.reflectionQuestion, { color: colors.mediumText }]}>{dayPlan.reflectionQuestion}</Text>

          <Text style={[styles.moodLabel, { color: colors.darkText }]}>How are you feeling spiritually?</Text>
          <View style={styles.moodRow}>
            {MOOD_OPTIONS.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[styles.moodButton, selectedMood === mood.value && { backgroundColor: colors.paleGreen, borderColor: colors.mediumGreen }]}
                onPress={() => setMood(mood.value)}
                accessibilityLabel={mood.label}
                accessibilityRole="button"
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[styles.moodText, { color: selectedMood === mood.value ? colors.primaryGreen : colors.mutedText }]}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.journalInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.darkText }]}
            placeholder="Write your thoughts here..."
            placeholderTextColor={colors.mutedText}
            value={journalEntry}
            onChangeText={setJournalEntry}
            onBlur={saveJournal}
            multiline
            numberOfLines={4}
            accessibilityLabel="Journal entry for today"
          />
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
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: { padding: 8 },
  dayLabel: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  dayTitle: { fontSize: 28, fontWeight: '700', marginBottom: 2 },
  dayArabic: { fontSize: 16 },
  hijriDate: { fontSize: 12, marginTop: 4 },
  pointsCard: { borderRadius: 12, padding: 12, minWidth: 80, alignItems: 'center' },
  pointsValue: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  pointsLabel: { fontSize: 12, color: '#FFFFFF', marginTop: 2 },
  streakRecoveryCard: { borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4 },
  streakRecoveryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  streakRecoveryText: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  streakRecoveryButton: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start' },
  streakRecoveryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  weekBanner: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 16 },
  weekLabel: { fontSize: 14, fontWeight: '600' },
  weekArabic: { fontSize: 12, marginTop: 2 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  progressSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%' },
  progressText: { fontSize: 13 },
  completionBanner: { borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center' },
  completionEmoji: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  completionText: { fontSize: 14, fontWeight: '600' },
  tasksContainer: { marginBottom: 24 },
  taskCard: { borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskCardCompleted: { opacity: 0.6 },
  taskContent: { flex: 1 },
  taskHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  taskIcon: { fontSize: 16, marginRight: 10 },
  taskTitle: { fontSize: 14, fontWeight: '600', flex: 1 },
  taskTitleCompleted: { textDecorationLine: 'line-through' },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  taskCategory: { fontSize: 12, textTransform: 'capitalize' },
  taskPoints: { fontSize: 12, fontWeight: '600' },
  checkmark: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  motivationCard: { borderRadius: 12, padding: 16, marginBottom: 20, borderLeftWidth: 4 },
  motivationText: { fontSize: 14, fontStyle: 'italic', lineHeight: 20, marginBottom: 8 },
  motivationSource: { fontSize: 12, fontWeight: '600' },
  reflectionSection: { marginBottom: 24 },
  reflectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  reflectionLabel: { fontSize: 14, fontWeight: '600' },
  reflectionQuestion: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  moodLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  moodButton: { alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 4, flex: 1 },
  moodEmoji: { fontSize: 20, marginBottom: 4 },
  moodText: { fontSize: 9, fontWeight: '500', textAlign: 'center' },
  journalInput: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, minHeight: 100, paddingTop: 12, textAlignVertical: 'top', marginBottom: 24 },
});
