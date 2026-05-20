import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, ZoomIn, Layout } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { appStorage } from '@/lib/storage';
import { getDayPlan } from '@/lib/planGenerator';
import { AppState, DhikrItem, PrayerName } from '@/lib/types';
import { useTheme } from '@/lib/theme';
import { Minus, Plus, RotateCcw, Check, BookOpen, Heart, Activity, ChevronLeft, ChevronRight } from 'lucide-react-native';

const PRAYER_NAMES: { id: PrayerName; name: string; arabic: string; time: string }[] = [
  { id: 'fajr', name: 'Fajr', arabic: 'الفجر', time: 'Dawn' },
  { id: 'dhuhr', name: 'Dhuhr', arabic: 'الظهر', time: 'Noon' },
  { id: 'asr', name: 'Asr', arabic: 'العصر', time: 'Afternoon' },
  { id: 'maghrib', name: 'Maghrib', arabic: 'المغرب', time: 'Sunset' },
  { id: 'isha', name: 'Isha', arabic: 'العشاء', time: 'Night' },
];

type Tab = 'dhikr' | 'prayer' | 'quran';

export default function WorshipScreen() {
  const { colors, mode } = useTheme();
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

  const triggerHaptic = useCallback((style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(style);
  }, []);

  const dayPlan = useMemo(() => state ? getDayPlan(state.currentDay) : null, [state]);
  
  if (!state || !dayPlan) {
    return <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}><Text style={styles.loadingText}>Preparing tools...</Text></SafeAreaView>;
  }

  const allDhikr = [...dayPlan.morningDhikr.map(d => ({ ...d, time: 'morning' })), ...dayPlan.eveningDhikr.map(d => ({ ...d, time: 'evening' }))];
  const currentDhikr = allDhikr[dhikrIndex] as (DhikrItem & { time: string }) | undefined;
  const targetCount = currentDhikr?.count ?? 33;

  const incrementDhikr = () => {
    const newCount = dhikrCount + 1;
    setDhikrCount(newCount);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    if (newCount === targetCount && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const resetDhikr = () => { setDhikrCount(0); triggerHaptic(); };
  const nextDhikr = () => { setDhikrIndex((i) => Math.min(i + 1, allDhikr.length - 1)); setDhikrCount(0); triggerHaptic(); };
  const prevDhikr = () => { setDhikrIndex((i) => Math.max(i - 1, 0)); setDhikrCount(0); triggerHaptic(); };

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown} style={styles.header}>
          <Text style={[styles.title, { color: colors.primaryGreen }]}>Worship Space</Text>
          <Text style={[styles.subtitle, { color: colors.mediumText }]}>Nurture your heart through daily practice</Text>
        </Animated.View>

        <View style={styles.tabContainer}>
          <BlurView intensity={Platform.OS === 'ios' ? 40 : 100} tint={mode === 'dark' ? 'dark' : 'light'} style={[styles.tabBar, { backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' }]}>
            {(['dhikr', 'prayer', 'quran'] as Tab[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && { backgroundColor: colors.mediumGreen }]}
                onPress={() => { setActiveTab(tab); triggerHaptic(); }}
              >
                <Text style={[styles.tabText, { color: activeTab === tab ? '#FFFFFF' : colors.mutedText }]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        </View>

        {activeTab === 'dhikr' && currentDhikr && (
          <Animated.View entering={FadeInDown} style={styles.dhikrSection}>
            <View style={[styles.dhikrCard, { backgroundColor: colors.white }]}>
              <View style={[styles.timeTag, { backgroundColor: currentDhikr.time === 'morning' ? colors.paleGold : colors.paleGreen }]}>
                <Text style={[styles.timeTagText, { color: currentDhikr.time === 'morning' ? colors.gold : colors.primaryGreen }]}>
                  {currentDhikr.time === 'morning' ? 'Morning' : 'Evening'}
                </Text>
              </View>
              <Text style={[styles.dhikrArabic, { color: colors.primaryGreen }]}>{currentDhikr.arabic}</Text>
              <Text style={[styles.dhikrTrans, { color: colors.mediumText }]}>{currentDhikr.transliteration}</Text>
              <Text style={[styles.dhikrTransText, { color: colors.darkText }]}>{currentDhikr.translation}</Text>
            </View>

            <View style={styles.counterContainer}>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={[styles.counterMain, { backgroundColor: colors.white, borderColor: colors.mediumGreen }]}
                onPress={incrementDhikr}
              >
                <View style={[styles.counterInner, { backgroundColor: colors.paleGreen }]}>
                  <Text style={[styles.counterValue, { color: colors.primaryGreen }]}>{dhikrCount}</Text>
                  <Text style={[styles.counterGoal, { color: colors.mediumGreen }]}>of {targetCount}</Text>
                </View>
                <Animated.View 
                  layout={Layout.springify()}
                  style={[styles.counterProgress, { height: `${dhikrProgress * 100}%`, backgroundColor: colors.mediumGreen, opacity: 0.1 }]} 
                />
              </TouchableOpacity>

              <View style={styles.counterActions}>
                <TouchableOpacity style={[styles.actionCircle, { backgroundColor: colors.white }]} onPress={prevDhikr} disabled={dhikrIndex === 0}>
                  <ChevronLeft size={20} color={dhikrIndex === 0 ? colors.border : colors.mediumGreen} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionCircle, { backgroundColor: colors.white }]} onPress={resetDhikr}>
                  <RotateCcw size={20} color={colors.gold} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionCircle, { backgroundColor: colors.white }]} onPress={nextDhikr} disabled={dhikrIndex === allDhikr.length - 1}>
                  <ChevronRight size={20} color={dhikrIndex === allDhikr.length - 1 ? colors.border : colors.mediumGreen} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.pageIndicator, { color: colors.mutedText }]}>{dhikrIndex + 1} / {allDhikr.length}</Text>
            </View>
          </Animated.View>
        )}

        {activeTab === 'prayer' && (
          <Animated.View entering={FadeInDown} style={styles.prayerSection}>
            <View style={styles.prayerList}>
              {PRAYER_NAMES.map((prayer, index) => {
                const isCompleted = prayersCompleted.includes(prayer.id);
                return (
                  <Animated.View key={prayer.id} entering={FadeInDown.delay(index * 100)} layout={Layout.springify()}>
                    <TouchableOpacity
                      style={[styles.prayerCard, { backgroundColor: colors.white }]}
                      onPress={() => togglePrayer(prayer.id)}
                    >
                      <View style={styles.prayerLeft}>
                        <Text style={[styles.prayerName, { color: colors.darkText }]}>{prayer.name}</Text>
                        <Text style={[styles.prayerTime, { color: colors.mutedText }]}>{prayer.time}</Text>
                      </View>
                      <Text style={[styles.prayerArabic, { color: colors.gold }]}>{prayer.arabic}</Text>
                      <View style={[styles.prayerCheck, { backgroundColor: isCompleted ? colors.mediumGreen : colors.paleGreen }]}>
                        {isCompleted && <Check size={16} color="#FFFFFF" />}
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>

            {dayPlan.prayerFocus && (
              <View style={[styles.focusCard, { backgroundColor: colors.paleGold }]}>
                <View style={styles.focusHeader}>
                  <Activity size={18} color={colors.gold} />
                  <Text style={[styles.focusTitle, { color: colors.gold }]}>Daily Focus</Text>
                </View>
                <Text style={[styles.focusPrayer, { color: colors.darkText }]}>{dayPlan.prayerFocus.prayer}</Text>
                <Text style={[styles.focusTip, { color: colors.mediumText }]}>{dayPlan.prayerFocus.tip}</Text>
              </View>
            )}
          </Animated.View>
        )}

        {activeTab === 'quran' && (
          <Animated.View entering={FadeInDown} style={styles.quranSection}>
            <View style={[styles.quranCard, { backgroundColor: colors.white }]}>
              <View style={styles.quranHeader}>
                <BookOpen size={24} color={colors.mediumGreen} />
                <View>
                  <Text style={[styles.quranSurah, { color: colors.primaryGreen }]}>{dayPlan.quranGoal.surah}</Text>
                  <Text style={[styles.quranAyahs, { color: colors.mutedText }]}>{dayPlan.quranGoal.ayahs}</Text>
                </View>
              </View>
              <Text style={[styles.quranDesc, { color: colors.darkText }]}>{dayPlan.quranGoal.description}</Text>
            </View>

            <View style={[styles.utilityCard, { backgroundColor: colors.paleGreen }]}>
              <Heart size={20} color={colors.primaryGreen} />
              <View style={styles.utilityContent}>
                <Text style={[styles.utilityTitle, { color: colors.primaryGreen }]}>{dayPlan.sunnahPractice.title}</Text>
                <Text style={[styles.utilityDesc, { color: colors.mediumText }]}>{dayPlan.sunnahPractice.description}</Text>
              </View>
            </View>

            <View style={[styles.utilityCard, { backgroundColor: colors.white }]}>
              <Text style={[styles.utilityLabel, { color: colors.gold }]}>Character</Text>
              <Text style={[styles.utilityTitle, { color: colors.darkText }]}>{dayPlan.characterGoal.trait}</Text>
              <Text style={[styles.utilityDesc, { color: colors.mediumText }]}>{dayPlan.characterGoal.description}</Text>
            </View>
          </Animated.View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingText: { textAlign: 'center', fontSize: 16, marginTop: 40 },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 24 },
  header: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 15, fontWeight: '500' },
  tabContainer: { marginBottom: 32, borderRadius: 24, overflow: 'hidden' },
  tabBar: { flexDirection: 'row', padding: 6, borderRadius: 24 },
  tabButton: { flex: 1, paddingVertical: 12, borderRadius: 20, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '700' },
  // Dhikr
  dhikrSection: { gap: 24 },
  dhikrCard: { padding: 24, borderRadius: 32, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 12, elevation: 2 },
  timeTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 16 },
  timeTagText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  dhikrArabic: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 16, lineHeight: 44 },
  dhikrTrans: { fontSize: 15, fontStyle: 'italic', textAlign: 'center', marginBottom: 8, lineHeight: 22 },
  dhikrTransText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  counterContainer: { alignItems: 'center', gap: 24 },
  counterMain: { width: 200, height: 200, borderRadius: 100, padding: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  counterInner: { width: '100%', height: '100%', borderRadius: 100, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  counterValue: { fontSize: 56, fontWeight: '800' },
  counterGoal: { fontSize: 14, fontWeight: '600', marginTop: -4 },
  counterProgress: { position: 'absolute', bottom: 0, width: '200%', zIndex: 0 },
  counterActions: { flexDirection: 'row', gap: 20, alignItems: 'center' },
  actionCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  pageIndicator: { fontSize: 13, fontWeight: '600' },
  // Prayer
  prayerSection: { gap: 24 },
  prayerList: { gap: 12 },
  prayerCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  prayerLeft: { flex: 1 },
  prayerName: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  prayerTime: { fontSize: 13, fontWeight: '500' },
  prayerArabic: { fontSize: 18, fontWeight: '600', marginRight: 20 },
  prayerCheck: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  focusCard: { padding: 20, borderRadius: 28 },
  focusHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  focusTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  focusPrayer: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  focusTip: { fontSize: 14, lineHeight: 22 },
  // Quran
  quranSection: { gap: 16 },
  quranCard: { padding: 24, borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  quranHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  quranSurah: { fontSize: 22, fontWeight: '800' },
  quranAyahs: { fontSize: 14, fontWeight: '600' },
  quranDesc: { fontSize: 15, lineHeight: 24 },
  utilityCard: { padding: 20, borderRadius: 28, gap: 12 },
  utilityContent: { flex: 1 },
  utilityLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  utilityTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  utilityDesc: { fontSize: 14, lineHeight: 22 },
});

