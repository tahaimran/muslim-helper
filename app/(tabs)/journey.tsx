import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { appStorage } from '@/lib/storage';
import { getDayPlan } from '@/lib/planGenerator';
import { AppState } from '@/lib/types';
import { WEEK_TITLES } from '@/constants/islamicContent';
import { useTheme } from '@/lib/theme';
import { ChevronRight, ChevronDown, CheckCircle2, Circle } from 'lucide-react-native';

export default function JourneyScreen() {
  const { colors } = useTheme();
  const [state, setState] = useState<AppState | null>(null);
  const [expandedWeek, setExpandedWeek] = useState(1);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const appState = await appStorage.getState();
    setState(appState);
    if (appState) {
      setExpandedWeek(Math.ceil(appState.currentDay / 7));
    }
  };

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  if (!state || !state.userProfile) {
    return <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}><Text style={styles.loadingText}>Unfolding your path...</Text></SafeAreaView>;
  }

  const isDayCompleted = (day: number) => state.dayProgress[day]?.completedTaskIds?.length > 0;

  const renderWeek = (weekNum: number) => {
    const weekInfo = WEEK_TITLES[weekNum - 1];
    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = Math.min(weekNum * 7, 30);
    const days = Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);
    const isExpanded = expandedWeek === weekNum;

    return (
      <View key={weekNum} style={styles.weekSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.weekHeader, { backgroundColor: colors.white }]}
          onPress={() => { setExpandedWeek(isExpanded ? 0 : weekNum); triggerHaptic(); }}
        >
          <View style={styles.weekHeaderLeft}>
            <View style={[styles.weekNumberBadge, { backgroundColor: colors.paleGreen }]}>
              <Text style={[styles.weekNumberText, { color: colors.primaryGreen }]}>W{weekNum}</Text>
            </View>
            <View>
              <Text style={[styles.weekTitle, { color: colors.darkText }]}>{weekInfo.subtitle}</Text>
              <Text style={[styles.weekArabic, { color: colors.gold }]}>{weekInfo.arabic}</Text>
            </View>
          </View>
          {isExpanded ? <ChevronDown size={20} color={colors.mutedText} /> : <ChevronRight size={20} color={colors.mutedText} />}
        </TouchableOpacity>

        {isExpanded && (
          <Animated.View entering={FadeInDown} style={styles.daysList}>
            {days.map((day, index) => {
              const plan = getDayPlan(day);
              const isCompleted = isDayCompleted(day);
              const isCurrent = day === state.currentDay;
              const isFuture = day > state.currentDay;

              return (
                <View key={day} style={styles.dayRow}>
                  <View style={styles.timeline}>
                    <View style={[styles.timelineLine, { backgroundColor: colors.border }, index === 0 && { top: '50%' }, index === days.length - 1 && { height: '50%' }]} />
                    {isCompleted ? (
                      <CheckCircle2 size={24} color={colors.mediumGreen} fill={colors.white} />
                    ) : isCurrent ? (
                      <View style={[styles.currentMarker, { backgroundColor: colors.mediumGreen, borderColor: colors.white }]} />
                    ) : (
                      <Circle size={20} color={isFuture ? colors.border : colors.mediumGreen} strokeWidth={2} fill={colors.white} />
                    )}
                  </View>
                  <View style={[styles.dayCard, { backgroundColor: isCurrent ? colors.paleGreen : colors.white, opacity: isFuture ? 0.6 : 1 }]}>
                    <View style={styles.dayCardHeader}>
                      <Text style={[styles.dayNumber, { color: colors.gold }]}>Day {day}</Text>
                      {isCompleted && <Text style={[styles.completedText, { color: colors.mediumGreen }]}>Done</Text>}
                    </View>
                    <Text style={[styles.dayTheme, { color: colors.darkText }]}>{plan.theme}</Text>
                  </View>
                </View>
              );
            })}
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown} style={styles.header}>
          <Text style={[styles.title, { color: colors.primaryGreen }]}>Your Path</Text>
          <Text style={[styles.subtitle, { color: colors.mediumText }]}>A 30-day journey of heart and soul</Text>
        </Animated.View>

        <View style={styles.weeksContainer}>
          {[1, 2, 3, 4].map((week) => renderWeek(week))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingText: { textAlign: 'center', fontSize: 16, marginTop: 40 },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 24 },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 15, fontWeight: '500' },
  weeksContainer: { gap: 16 },
  weekSection: { gap: 8 },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  weekHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  weekNumberBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  weekNumberText: { fontSize: 14, fontWeight: '800' },
  weekTitle: { fontSize: 16, fontWeight: '700' },
  weekArabic: { fontSize: 13, fontWeight: '500' },
  daysList: { paddingLeft: 22, gap: 0, marginTop: 8 },
  dayRow: { flexDirection: 'row', minHeight: 80 },
  timeline: { width: 40, alignItems: 'center', justifyContent: 'center' },
  timelineLine: { position: 'absolute', width: 2, height: '100%' },
  currentMarker: { width: 16, height: 16, borderRadius: 8, borderWidth: 3, zIndex: 1 },
  dayCard: { flex: 1, padding: 16, borderRadius: 20, marginLeft: 8, marginVertical: 4, justifyContent: 'center' },
  dayCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  dayNumber: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  completedText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  dayTheme: { fontSize: 15, fontWeight: '600' },
});

