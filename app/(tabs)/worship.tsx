import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { appStorage } from '@/lib/storage';
import { getDayPlan } from '@/lib/planGenerator';
import { AppState, DhikrItem, PrayerName } from '@/lib/types';
import { useTheme } from '@/lib/theme';
import { Minus, Plus, RotateCcw, Check, BookOpen } from 'lucide-react-native';

const PRAYER_NAMES: { id: PrayerName; name: string; arabic: string; time: string }[] = [
  { id: 'fajr', name: 'Fajr', arabic: 'الفجر', time: 'Dawn' },
  { id: 'dhuhr', name: 'Dhuhr', arabic: 'الظهر', time: 'Noon' },
  { id: 'asr', name: 'Asr', arabic: 'العصر', time: 'Afternoon' },
  { id: 'maghrib', name: 'Maghrib', arabic: 'المغرب', time: 'Sunset' },
  { id: 'isha', name: 'Isha', arabic: 'العشاء', time: 'Night' },
];

type Tab = 'dhikr' | 'prayer' | 'quran';

export default function WorshipScreen() {
  const { colors } = useTheme();
  const [state, setState] = useState<AppState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dhikr');
  const [dhikrIndex, setDhikrIndex] = useState(0);
  const [dhikrCount, setDhikrCount] = useState(0);
  const [prayersCompleted, setPrayersCompleted] = useState<PrayerName[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const appState = await appStorage.getState();
    if (appState) {
      setState(appState);
      const todayProgress = appState.dayProgress[appState.currentDay];
      setPrayersCompleted(todayProgress?.prayersCompleted ?? []);
    }
  };

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  if (!state) {
    return <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}><Text style={[styles.loadingText, { color: colors.mutedText }]}>Loading...</Text></SafeAreaView>;
  }

  const dayPlan = getDayPlan(state.currentDay);
  const morningDhikr = dayPlan.morningDhikr;
  const eveningDhikr = dayPlan.eveningDhikr;
  const allDhikr = [...morningDhikr.map(d => ({ ...d, time: 'morning' })), ...eveningDhikr.map(d => ({ ...d, time: 'evening' }))];
  const currentDhikr = allDhikr[dhikrIndex] as (DhikrItem & { time: string }) | undefined;
  const targetCount = currentDhikr?.count ?? 33;

  const incrementDhikr = () => {
    const newCount = dhikrCount + 1;
    setDhikrCount(newCount);
    triggerHaptic();
    if (newCount === targetCount && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const resetDhikr = () => { setDhikrCount(0); };

  const nextDhikr = () => { setDhikrIndex((i) => Math.min(i + 1, allDhikr.length - 1)); setDhikrCount(0); };
  const prevDhikr = () => { setDhikrIndex((i) => Math.max(i - 1, 0)); setDhikrCount(0); };

  const togglePrayer = async (prayer: PrayerName) => {
    const isCompleted = prayersCompleted.includes(prayer);
    const updated = isCompleted
      ? prayersCompleted.filter(p => p !== prayer)
      : [...prayersCompleted, prayer];
    setPrayersCompleted(updated);
    triggerHaptic();

    const todayProgress = state.dayProgress[state.currentDay] ?? { day: state.currentDay, completedTaskIds: [] };
    const updatedProgress = { ...todayProgress, prayersCompleted: updated };
    await appStorage.saveDayProgress(state.currentDay, updatedProgress);
    const newState = { ...state, dayProgress: { ...state.dayProgress, [state.currentDay]: updatedProgress } };
    setState(newState);
  };

  const dhikrProgress = targetCount > 0 ? Math.min(dhikrCount / targetCount, 1) : 0;
  const prayerProgress = prayersCompleted.length / 5;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.primaryGreen }]}>Worship Tools</Text>
        <Text style={[styles.subtitle, { color: colors.mediumText }]}>Interactive aids for your daily practice</Text>

        <View style={[styles.tabRow, { backgroundColor: colors.cardBackground }]}>
          {(['dhikr', 'prayer', 'quran'] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && { backgroundColor: colors.mediumGreen }]}
              onPress={() => setActiveTab(tab)}
              accessibilityLabel={`${tab} tab`}
              accessibilityRole="button"
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'dhikr' ? 'Dhikr' : tab === 'prayer' ? 'Prayers' : 'Quran'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'dhikr' && currentDhikr && (
          <View style={styles.dhikrSection}>
            <View style={[styles.dhikrTimeBadge, { backgroundColor: currentDhikr.time === 'morning' ? colors.paleGold : colors.paleGreen }]}>
              <Text style={[styles.dhikrTimeText, { color: currentDhikr.time === 'morning' ? colors.gold : colors.primaryGreen }]}>
                {currentDhikr.time === 'morning' ? 'Morning Adhkar' : 'Evening Adhkar'}
              </Text>
            </View>

            <View style={[styles.dhikrCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.dhikrArabic, { color: colors.primaryGreen }]}>{currentDhikr.arabic}</Text>
              <Text style={[styles.dhikrTransliteration, { color: colors.mediumText }]}>{currentDhikr.transliteration}</Text>
              <Text style={[styles.dhikrTranslation, { color: colors.darkText }]}>{currentDhikr.translation}</Text>
            </View>

            <View style={styles.counterSection}>
              <View style={[styles.counterCircle, { backgroundColor: colors.paleGreen, borderColor: colors.mediumGreen }]}>
                <Text style={[styles.counterNumber, { color: colors.primaryGreen }]}>{dhikrCount}</Text>
                <Text style={[styles.counterTarget, { color: colors.mediumText }]}>/ {targetCount}</Text>
              </View>

              <View style={[styles.progressBar, { backgroundColor: colors.paleGreen }]}>
                <Animated.View style={[styles.progressFill, { width: `${dhikrProgress * 100}%`, backgroundColor: dhikrCount >= targetCount ? colors.success : colors.mediumGreen }]} />
              </View>

              {dhikrCount >= targetCount && (
                <Animated.View entering={ZoomIn} style={[styles.completedBadge, { backgroundColor: colors.success }]}>
                  <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.completedText}>Complete!</Text>
                </Animated.View>
              )}

              <View style={styles.counterButtons}>
                <TouchableOpacity style={[styles.counterButton, { backgroundColor: colors.cardBackground }]} onPress={resetDhikr} accessibilityLabel="Reset counter">
                  <RotateCcw size={20} color={colors.mediumGreen} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tapButton, { backgroundColor: colors.mediumGreen }]} onPress={incrementDhikr} accessibilityLabel="Tap to count dhikr" accessibilityRole="button">
                  <Text style={styles.tapButtonText}>Tap</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.counterButton, { backgroundColor: colors.cardBackground }]} onPress={() => setDhikrCount(c => Math.max(0, c - 1))} accessibilityLabel="Subtract one">
                  <Minus size={20} color={colors.mediumGreen} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.dhikrNav}>
              <TouchableOpacity style={[styles.navButton, { backgroundColor: colors.cardBackground }]} onPress={prevDhikr} disabled={dhikrIndex === 0} accessibilityLabel="Previous dhikr">
                <Text style={[styles.navButtonText, { color: colors.mediumGreen }]}>Previous</Text>
              </TouchableOpacity>
              <Text style={[styles.dhikrPageText, { color: colors.mutedText }]}>{dhikrIndex + 1} of {allDhikr.length}</Text>
              <TouchableOpacity style={[styles.navButton, { backgroundColor: colors.cardBackground }]} onPress={nextDhikr} disabled={dhikrIndex === allDhikr.length - 1} accessibilityLabel="Next dhikr">
                <Text style={[styles.navButtonText, { color: colors.mediumGreen }]}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'prayer' && (
          <View style={styles.prayerSection}>
            <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Today's Prayers</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>Day {state.currentDay} - Track your 5 daily prayers</Text>

            <View style={[styles.prayerProgressCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.prayerProgressLabel, { color: colors.mutedText }]}>Completed</Text>
              <Text style={[styles.prayerProgressValue, { color: colors.primaryGreen }]}>{prayersCompleted.length}/5</Text>
              <View style={[styles.progressBar, { backgroundColor: colors.paleGreen }]}>
                <View style={[styles.progressFill, { width: `${prayerProgress * 100}%`, backgroundColor: colors.mediumGreen }]} />
              </View>
            </View>

            {PRAYER_NAMES.map((prayer) => {
              const isCompleted = prayersCompleted.includes(prayer.id);
              return (
                <TouchableOpacity
                  key={prayer.id}
                  style={[styles.prayerCard, { backgroundColor: colors.cardBackground, borderLeftColor: isCompleted ? colors.success : colors.gold }]}
                  onPress={() => togglePrayer(prayer.id)}
                  accessibilityLabel={`${prayer.name} prayer - ${isCompleted ? 'completed' : 'not completed'}`}
                  accessibilityRole="button"
                >
                  <View style={styles.prayerInfo}>
                    <Text style={[styles.prayerName, { color: colors.darkText }]}>{prayer.name}</Text>
                    <Text style={[styles.prayerArabic, { color: colors.gold }]}>{prayer.arabic}</Text>
                    <Text style={[styles.prayerTime, { color: colors.mutedText }]}>{prayer.time}</Text>
                  </View>
                  <View style={[styles.prayerCheck, { backgroundColor: isCompleted ? colors.success : colors.paleGreen }]}>
                    {isCompleted ? <Check size={18} color="#FFFFFF" strokeWidth={3} /> : <Text style={[styles.prayerCheckText, { color: colors.mutedText }]}>Mark</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}

            {prayersCompleted.length === 5 && (
              <Animated.View entering={ZoomIn} style={[styles.allPrayersCard, { backgroundColor: colors.paleGreen }]}>
                <Text style={[styles.allPrayersText, { color: colors.primaryGreen }]}>Masha'Allah! All 5 prayers completed today!</Text>
              </Animated.View>
            )}

            {dayPlan.prayerFocus && (
              <View style={[styles.focusCard, { backgroundColor: colors.cardBackground, borderLeftColor: colors.gold }]}>
                <Text style={[styles.focusTitle, { color: colors.darkText }]}>Today's Prayer Focus</Text>
                <Text style={[styles.focusPrayer, { color: colors.primaryGreen }]}>{dayPlan.prayerFocus.prayer}</Text>
                <Text style={[styles.focusTip, { color: colors.mediumText }]}>{dayPlan.prayerFocus.tip}</Text>
                {dayPlan.prayerFocus.arabicDua && (
                  <View style={[styles.duaBox, { backgroundColor: colors.paleGreen }]}>
                    <Text style={[styles.duaArabic, { color: colors.primaryGreen }]}>{dayPlan.prayerFocus.arabicDua}</Text>
                    {dayPlan.prayerFocus.duaTransliteration && <Text style={[styles.duaTrans, { color: colors.mediumText }]}>{dayPlan.prayerFocus.duaTransliteration}</Text>}
                    {dayPlan.prayerFocus.duaTranslation && <Text style={[styles.duaTransText, { color: colors.darkText }]}>{dayPlan.prayerFocus.duaTranslation}</Text>}
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {activeTab === 'quran' && (
          <View style={styles.quranSection}>
            <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Today's Quran Goal</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>Day {state.currentDay}</Text>

            <View style={[styles.quranCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.quranHeader}>
                <BookOpen size={24} color={colors.gold} />
                <View style={styles.quranInfo}>
                  <Text style={[styles.quranSurah, { color: colors.primaryGreen }]}>{dayPlan.quranGoal.surah}</Text>
                  <Text style={[styles.quranAyahs, { color: colors.mediumText }]}>{dayPlan.quranGoal.ayahs}</Text>
                </View>
              </View>
              <Text style={[styles.quranDescription, { color: colors.darkText }]}>{dayPlan.quranGoal.description}</Text>
              <View style={[styles.quranTranslationBox, { backgroundColor: colors.paleGreen }]}>
                <Text style={[styles.quranTranslation, { color: colors.darkText }]}>{dayPlan.quranGoal.translation}</Text>
              </View>
            </View>

            <View style={[styles.sunnahCard, { backgroundColor: colors.cardBackground, borderLeftColor: colors.freshGreen }]}>
              <Text style={[styles.sunnahTitle, { color: colors.darkText }]}>Today's Sunnah Practice</Text>
              <Text style={[styles.sunnahName, { color: colors.primaryGreen }]}>{dayPlan.sunnahPractice.title}</Text>
              <Text style={[styles.sunnahDesc, { color: colors.mediumText }]}>{dayPlan.sunnahPractice.description}</Text>
              <Text style={[styles.sunnahSource, { color: colors.gold }]}>{dayPlan.sunnahPractice.source}</Text>
            </View>

            <View style={[styles.characterCard, { backgroundColor: colors.cardBackground, borderLeftColor: colors.gold }]}>
              <Text style={[styles.characterTitle, { color: colors.darkText }]}>Character Building</Text>
              <Text style={[styles.characterTrait, { color: colors.primaryGreen }]}>{dayPlan.characterGoal.trait} ({dayPlan.characterGoal.arabicTerm})</Text>
              <Text style={[styles.characterDesc, { color: colors.mediumText }]}>{dayPlan.characterGoal.description}</Text>
              <View style={[styles.actionBox, { backgroundColor: colors.paleGold }]}>
                <Text style={[styles.actionLabel, { color: colors.gold }]}>Action:</Text>
                <Text style={[styles.actionText, { color: colors.darkText }]}>{dayPlan.characterGoal.action}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 16 },
  loadingText: { textAlign: 'center', fontSize: 16, marginTop: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  tabRow: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#808080' },
  tabTextActive: { color: '#FFFFFF' },
  // Dhikr
  dhikrSection: { marginBottom: 24 },
  dhikrTimeBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12, marginBottom: 12 },
  dhikrTimeText: { fontSize: 12, fontWeight: '600' },
  dhikrCard: { borderRadius: 16, padding: 20, marginBottom: 20, alignItems: 'center' },
  dhikrArabic: { fontSize: 24, fontWeight: '700', textAlign: 'center', lineHeight: 40, marginBottom: 12 },
  dhikrTransliteration: { fontSize: 14, textAlign: 'center', fontStyle: 'italic', marginBottom: 8, lineHeight: 20 },
  dhikrTranslation: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  counterSection: { alignItems: 'center', marginBottom: 20 },
  counterCircle: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', borderWidth: 4, marginBottom: 16 },
  counterNumber: { fontSize: 48, fontWeight: '700' },
  counterTarget: { fontSize: 16 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden', width: '80%', marginBottom: 12 },
  progressFill: { height: '100%' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, marginBottom: 12 },
  completedText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  counterButtons: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  counterButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  tapButton: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  tapButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  dhikrNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navButton: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  navButtonText: { fontSize: 14, fontWeight: '600' },
  dhikrPageText: { fontSize: 13 },
  // Prayer
  prayerSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, marginBottom: 16 },
  prayerProgressCard: { borderRadius: 12, padding: 14, marginBottom: 16 },
  prayerProgressLabel: { fontSize: 12, marginBottom: 4 },
  prayerProgressValue: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  prayerCard: { borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4 },
  prayerInfo: { flex: 1 },
  prayerName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  prayerArabic: { fontSize: 14, marginBottom: 2 },
  prayerTime: { fontSize: 12 },
  prayerCheck: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  prayerCheckText: { fontSize: 11, fontWeight: '600' },
  allPrayersCard: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  allPrayersText: { fontSize: 16, fontWeight: '700' },
  focusCard: { borderRadius: 12, padding: 14, borderLeftWidth: 4, marginTop: 8 },
  focusTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  focusPrayer: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  focusTip: { fontSize: 13, lineHeight: 20, marginBottom: 10 },
  duaBox: { borderRadius: 10, padding: 12, marginTop: 8 },
  duaArabic: { fontSize: 18, fontWeight: '600', textAlign: 'center', lineHeight: 28, marginBottom: 6 },
  duaTrans: { fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginBottom: 4 },
  duaTransText: { fontSize: 12, textAlign: 'center' },
  // Quran
  quranSection: { marginBottom: 24 },
  quranCard: { borderRadius: 16, padding: 16, marginBottom: 16 },
  quranHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  quranInfo: { flex: 1 },
  quranSurah: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  quranAyahs: { fontSize: 13 },
  quranDescription: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  quranTranslationBox: { borderRadius: 10, padding: 12 },
  quranTranslation: { fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  sunnahCard: { borderRadius: 12, padding: 14, borderLeftWidth: 4, marginBottom: 16 },
  sunnahTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  sunnahName: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  sunnahDesc: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  sunnahSource: { fontSize: 12, fontWeight: '600' },
  characterCard: { borderRadius: 12, padding: 14, borderLeftWidth: 4, marginBottom: 16 },
  characterTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  characterTrait: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  characterDesc: { fontSize: 13, lineHeight: 20, marginBottom: 10 },
  actionBox: { borderRadius: 10, padding: 12 },
  actionLabel: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  actionText: { fontSize: 13, lineHeight: 20 },
});
