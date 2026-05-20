import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, ZoomIn, Layout } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { appStorage } from '@/lib/storage';
import { getDayPlan, calculateDayPoints } from '@/lib/planGenerator';
import { AppState, DayPlan, DayProgress, MoodType } from '@/lib/types';
import { CATEGORY_COLORS, WEEK_TITLES } from '@/constants/islamicContent';
import { useTheme } from '@/lib/theme';
import { Check, Share2, BookOpen, Leaf, Sun, Moon, Cloud } from 'lucide-react-native';

const MOOD_OPTIONS: { value: MoodType; emoji: string; label: string }[] = [
  { value: 'grateful', emoji: '🤲', label: 'Grateful' },
  { value: 'peaceful', emoji: '☮️', label: 'Peaceful' },
  { value: 'motivated', emoji: '💪', label: 'Motivated' },
  { value: 'reflective', emoji: '💭', label: 'Reflective' },
  { value: 'struggling', emoji: '🙏', label: 'Struggling' },
];

function getGreeting(): { text: string; icon: any } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', icon: Sun };
  if (hour < 17) return { text: 'Good Afternoon', icon: Cloud };
  if (hour < 21) return { text: 'Good Evening', icon: Moon };
  return { text: 'Blessed Night', icon: Moon };
}

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
  const { colors, mode } = useTheme();
  const [state, setState] = useState<AppState | null>(null);
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [dayProgress, setDayProgress] = useState<DayProgress | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const greeting = useMemo(() => getGreeting(), []);
  const GreetingIcon = greeting.icon;

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
    }
  };

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

    triggerHaptic();
    if (!isCompleted && newCompletedIds.length === dayPlan.tasks.length && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    triggerHaptic();
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

  const progressPercentage = dayProgress ? (dayProgress.completedTaskIds.length / (dayPlan?.tasks.length || 1)) * 100 : 0;
  const weekNumber = dayPlan ? Math.ceil(dayPlan.day / 7) : 1;
  const weekInfo = WEEK_TITLES[weekNumber - 1];

  if (!state || !dayPlan || !dayProgress) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        <View style={styles.loadingContainer}>
          <Leaf size={40} color={colors.mediumGreen} style={styles.loadingIcon} />
          <Text style={[styles.loadingText, { color: colors.mutedText }]}>Preparing your space...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dayPoints = calculateDayPoints(dayProgress.completedTaskIds, dayPlan.tasks);
  const hijri = getHijriDate();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <View style={styles.greetingRow}>
                <GreetingIcon size={20} color={colors.gold} />
                <Text style={[styles.greetingText, { color: colors.mediumText }]}>{greeting.text}, {state.userProfile?.name}</Text>
              </View>
              <Text style={[styles.dayTitle, { color: colors.primaryGreen }]}>{dayPlan.theme}</Text>
              <View style={styles.dateBadge}>
                <Text style={[styles.hijriDate, { color: colors.mutedText }]}>{hijri.date} {hijri.month} • Day {dayPlan.day}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleShare} style={[styles.shareCircle, { backgroundColor: colors.white }]}>
              <Share2 size={18} color={colors.mediumGreen} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.progressCardContainer}>
          <BlurView intensity={Platform.OS === 'ios' ? 40 : 100} tint={mode === 'dark' ? 'dark' : 'light'} style={[styles.progressCard, { backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' }]}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressLabel, { color: colors.darkText }]}>Daily Progress</Text>
              <Text style={[styles.progressValue, { color: colors.mediumGreen }]}>{Math.round(progressPercentage)}%</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.paleGreen }]}>
              <Animated.View 
                layout={Layout.springify()}
                style={[styles.progressFill, { width: `${progressPercentage}%`, backgroundColor: colors.mediumGreen }]} 
              />
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.gold }]}>{dayPoints}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedText }]}>Points</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.gold }]}>{state.streakDays}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedText }]}>Streak</Text>
              </View>
            </View>
          </BlurView>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Spiritual Intentions</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>{dayPlan.tasks.length} meaningful steps for today</Text>
        </View>

        <View style={styles.tasksContainer}>
          {dayPlan.tasks.map((task, index) => {
            const isCompleted = dayProgress.completedTaskIds.includes(task.id);
            const categoryColor = CATEGORY_COLORS[task.category];
            return (
              <Animated.View key={task.id} entering={FadeInDown.delay(index * 100)} layout={Layout.springify()}>
                <TouchableOpacity
                  style={[styles.taskCard, { backgroundColor: colors.white }]}
                  onPress={() => toggleTask(task.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.taskStatusIndicator, { backgroundColor: isCompleted ? colors.mediumGreen : colors.paleGreen }]}>
                    {isCompleted ? <Check size={14} color="#FFFFFF" /> : null}
                  </View>
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, isCompleted && { textDecorationLine: 'line-through', color: colors.mutedText }, { color: colors.darkText }]}>{task.title}</Text>
                    <View style={styles.taskMeta}>
                      <Text style={[styles.taskCategory, { color: colors.mutedText }]}>{categoryColor.icon} {task.category}</Text>
                      <Text style={[styles.taskPoints, { color: colors.gold }]}>+{task.points} pts</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View entering={FadeIn.delay(500)} style={[styles.quoteCard, { backgroundColor: colors.paleGold }]}>
          <Leaf size={24} color={colors.gold} style={styles.quoteIcon} />
          <Text style={[styles.quoteText, { color: colors.darkText }]}>{dayPlan.hadith.text}</Text>
          <Text style={[styles.quoteSource, { color: colors.gold }]}>{dayPlan.hadith.source}</Text>
        </Animated.View>

        <View style={styles.reflectionSection}>
          <View style={styles.reflectionCard}>
            <View style={styles.reflectionHeader}>
              <BookOpen size={20} color={colors.mediumGreen} />
              <Text style={[styles.reflectionTitle, { color: colors.darkText }]}>{"Today's Reflection"}</Text>
            </View>
            <Text style={[styles.reflectionQuestion, { color: colors.mediumText }]}>{dayPlan.reflectionQuestion}</Text>
            
            <TextInput
              style={[styles.journalInput, { backgroundColor: colors.cream, borderColor: colors.border, color: colors.darkText }]}
              placeholder="Reflect on your journey..."
              placeholderTextColor={colors.mutedText}
              value={journalEntry}
              onChangeText={setJournalEntry}
              onBlur={saveJournal}
              multiline
            />
          </View>

          <View style={styles.moodSection}>
            <Text style={[styles.moodQuestion, { color: colors.darkText }]}>How is your heart today?</Text>
            <View style={styles.moodRow}>
              {MOOD_OPTIONS.map((mood) => (
                <TouchableOpacity
                  key={mood.value}
                  style={[styles.moodButton, selectedMood === mood.value && { backgroundColor: colors.white, shadowColor: colors.shadowColor, elevation: 4 }]}
                  onPress={() => setMood(mood.value)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodLabel, { color: selectedMood === mood.value ? colors.primaryGreen : colors.mutedText }]}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingIcon: { marginBottom: 8 },
  loadingText: { fontSize: 16, fontWeight: '500' },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 24 },
  header: { marginBottom: 28 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  greetingText: { fontSize: 14, fontWeight: '500' },
  dayTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  dateBadge: { marginTop: 4 },
  hijriDate: { fontSize: 13, fontWeight: '600' },
  shareCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  progressCardContainer: { marginBottom: 32, borderRadius: 32, overflow: 'hidden' },
  progressCard: { padding: 24, borderRadius: 32 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  progressLabel: { fontSize: 16, fontWeight: '700' },
  progressValue: { fontSize: 24, fontWeight: '800' },
  progressBar: { height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 20 },
  progressFill: { height: '100%', borderRadius: 6 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(0,0,0,0.05)' },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, fontWeight: '500' },
  tasksContainer: { gap: 12, marginBottom: 32 },
  taskCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  taskStatusIndicator: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  taskMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskCategory: { fontSize: 12, fontWeight: '600' },
  taskPoints: { fontSize: 12, fontWeight: '700' },
  quoteCard: { padding: 24, borderRadius: 32, marginBottom: 32, alignItems: 'center' },
  quoteIcon: { marginBottom: 16 },
  quoteText: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', lineHeight: 24, marginBottom: 12, fontWeight: '500' },
  quoteSource: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  reflectionSection: { gap: 24 },
  reflectionCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  reflectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  reflectionTitle: { fontSize: 18, fontWeight: '800' },
  reflectionQuestion: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  journalInput: { borderWidth: 1, borderRadius: 20, padding: 16, fontSize: 15, minHeight: 120, textAlignVertical: 'top' },
  moodSection: { alignItems: 'center' },
  moodQuestion: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  moodButton: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 20 },
  moodEmoji: { fontSize: 24, marginBottom: 4 },
  moodLabel: { fontSize: 10, fontWeight: '700' },
});
