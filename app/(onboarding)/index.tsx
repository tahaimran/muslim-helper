import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { Leaf, ChevronRight, ChevronLeft, Check } from 'lucide-react-native';
import { appStorage } from '@/lib/storage';
import { requestNotificationPermission, syncNotifications } from '@/lib/notifications';
import { useTheme } from '@/lib/theme';
import { ImprovementArea, KnowledgeLevel, Gender, PracticeLevel } from '@/lib/types';

const STEPS = [
  'Welcome',
  'Your Name',
  'Age',
  'Gender',
  'Knowledge Level',
  'Prayer Consistency',
  'Areas to Improve',
  'Daily Time',
  'Commitment'
];

const IMPROVEMENT_AREAS: ImprovementArea[] = ['prayer', 'quran', 'dhikr', 'fasting', 'character', 'family', 'knowledge', 'charity'];

const KNOWLEDGE_LEVELS: { value: KnowledgeLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Learning the basics' },
  { value: 'intermediate', label: 'Intermediate', description: 'Practicing regularly' },
  { value: 'advanced', label: 'Advanced', description: 'Deep knowledge' },
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Brother' },
  { value: 'female', label: 'Sister' },
];

const PRAYER_LEVELS: { value: PracticeLevel; label: string }[] = [
  { value: 'none', label: 'Starting my journey' },
  { value: 'some', label: 'A few prayers daily' },
  { value: 'most', label: 'Most prayers daily' },
  { value: 'all', label: 'All 5 prayers daily' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>('beginner');
  const [prayerConsistency, setPrayerConsistency] = useState<PracticeLevel>('some');
  const [improvementAreas, setImprovementAreas] = useState<ImprovementArea[]>(['prayer', 'character']);
  const [dailyMinutes, setDailyMinutes] = useState('30');
  const [commitmentLevel, setCommitmentLevel] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const toggleArea = (area: ImprovementArea) => {
    triggerHaptic();
    setImprovementAreas((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]);
  };

  const nextStep = () => {
    triggerHaptic();
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    triggerHaptic();
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    triggerHaptic();
    try {
      const profile = {
        name: name || 'Seeker',
        age: parseInt(age) || 25,
        gender,
        knowledgeLevel,
        prayerConsistency,
        improvementAreas,
        dailyMinutes: parseInt(dailyMinutes) || 30,
        personalGoal: 'Focus on growth',
        challenges: 'Staying consistent',
        commitmentLevel,
        createdAt: new Date().toISOString(),
        planStartDate: new Date().toISOString(),
      };
      await appStorage.saveProfile(profile);
      await appStorage.initState(profile);
      if (await requestNotificationPermission()) await syncNotifications();
      router.replace('/(tabs)');
    } catch { /* error */ } finally { setIsLoading(false); }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Leaf size={48} color={colors.mediumGreen} style={styles.welcomeIcon} />
            <Text style={[styles.welcomeTitle, { color: colors.primaryGreen }]}>Welcome to Nafs</Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.mediumText }]}>A serene space for your spiritual transformation.</Text>
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.mediumGreen }]} onPress={nextStep}>
              <Text style={styles.mainButtonText}>Begin Journey</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 1:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.darkText }]}>What should we call you?</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.darkText, backgroundColor: colors.white }]}
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              autoFocus
              placeholderTextColor={colors.mutedText}
            />
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.mediumGreen }]} onPress={nextStep}>
              <Text style={styles.mainButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.darkText }]}>How old are you, {name}?</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.darkText, backgroundColor: colors.white }]}
              placeholder="Your age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              autoFocus
              placeholderTextColor={colors.mutedText}
            />
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.mediumGreen }]} onPress={nextStep}>
              <Text style={styles.mainButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.darkText }]}>I am a...</Text>
            <View style={styles.optionsGrid}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.gridOption, { backgroundColor: colors.white, borderColor: gender === g.value ? colors.mediumGreen : colors.border }]}
                  onPress={() => { setGender(g.value); triggerHaptic(); }}
                >
                  <Text style={[styles.optionLabel, { color: gender === g.value ? colors.primaryGreen : colors.mediumText }]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.mediumGreen }]} onPress={nextStep}>
              <Text style={styles.mainButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.darkText }]}>Your knowledge level?</Text>
            {KNOWLEDGE_LEVELS.map((kl) => (
              <TouchableOpacity
                key={kl.value}
                style={[styles.fullOption, { backgroundColor: colors.white, borderColor: knowledgeLevel === kl.value ? colors.mediumGreen : colors.border }]}
                onPress={() => { setKnowledgeLevel(kl.value); triggerHaptic(); }}
              >
                <View>
                  <Text style={[styles.optionLabel, { color: knowledgeLevel === kl.value ? colors.primaryGreen : colors.darkText }]}>{kl.label}</Text>
                  <Text style={[styles.optionDesc, { color: colors.mutedText }]}>{kl.description}</Text>
                </View>
                {knowledgeLevel === kl.value && <Check size={20} color={colors.mediumGreen} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.mediumGreen }]} onPress={nextStep}>
              <Text style={styles.mainButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 5:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.darkText }]}>Daily prayer consistency?</Text>
            {PRAYER_LEVELS.map((pl) => (
              <TouchableOpacity
                key={pl.value}
                style={[styles.fullOption, { backgroundColor: colors.white, borderColor: prayerConsistency === pl.value ? colors.mediumGreen : colors.border }]}
                onPress={() => { setPrayerConsistency(pl.value); triggerHaptic(); }}
              >
                <Text style={[styles.optionLabel, { color: prayerConsistency === pl.value ? colors.primaryGreen : colors.darkText }]}>{pl.label}</Text>
                {prayerConsistency === pl.value && <Check size={20} color={colors.mediumGreen} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.mediumGreen }]} onPress={nextStep}>
              <Text style={styles.mainButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 6:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.darkText }]}>Areas of focus?</Text>
            <View style={styles.chipGrid}>
              {IMPROVEMENT_AREAS.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={[styles.chip, { backgroundColor: improvementAreas.includes(area) ? colors.paleGreen : colors.white, borderColor: improvementAreas.includes(area) ? colors.mediumGreen : colors.border }]}
                  onPress={() => toggleArea(area)}
                >
                  <Text style={[styles.chipText, { color: improvementAreas.includes(area) ? colors.primaryGreen : colors.mediumText }]}>{area}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.mediumGreen }]} onPress={nextStep}>
              <Text style={styles.mainButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 7:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.darkText }]}>Daily time commitment?</Text>
            <Text style={[styles.subText, { color: colors.mutedText }]}>How many minutes for your spiritual growth?</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.darkText, backgroundColor: colors.white }]}
              placeholder="Minutes (e.g., 30)"
              value={dailyMinutes}
              onChangeText={setDailyMinutes}
              keyboardType="number-pad"
              autoFocus
              placeholderTextColor={colors.mutedText}
            />
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.mediumGreen }]} onPress={nextStep}>
              <Text style={styles.mainButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 8:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.darkText }]}>Ready to transform?</Text>
            <Text style={[styles.subText, { color: colors.mutedText }]}>Your 30-day journey is prepared for you.</Text>
            <View style={styles.commitmentRow}>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.lvlCircle, { backgroundColor: commitmentLevel >= lvl ? colors.mediumGreen : colors.paleGreen }]}
                  onPress={() => { setCommitmentLevel(lvl); triggerHaptic(); }}
                >
                  <Leaf size={16} color="#FFFFFF" />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.mediumGreen }]} onPress={handleComplete} disabled={isLoading}>
              <Text style={styles.mainButtonText}>{isLoading ? 'Creating Plan...' : 'Start My Journey'}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <View style={styles.header}>
        {step > 0 && (
          <TouchableOpacity onPress={prevStep} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.mediumText} />
          </TouchableOpacity>
        )}
        <View style={styles.progressTrack}>
          <Animated.View 
            layout={Layout.springify()}
            style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%`, backgroundColor: colors.mediumGreen }]} 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, gap: 12 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  progressTrack: { flex: 1, height: 6, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 30, paddingVertical: 40, justifyContent: 'center' },
  stepContainer: { alignItems: 'center', width: '100%' },
  welcomeIcon: { marginBottom: 24 },
  welcomeTitle: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  welcomeSubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  questionText: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 24 },
  subText: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  input: { width: '100%', height: 64, borderWidth: 1.5, borderRadius: 24, paddingHorizontal: 24, fontSize: 18, fontWeight: '600', marginBottom: 32 },
  optionsGrid: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 32 },
  gridOption: { flex: 1, height: 64, borderWidth: 1.5, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  optionLabel: { fontSize: 16, fontWeight: '700' },
  optionDesc: { fontSize: 12, marginTop: 2 },
  fullOption: { width: '100%', height: 72, borderWidth: 1.5, borderRadius: 24, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 32 },
  chip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, borderWidth: 1.5 },
  chipText: { fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  commitmentRow: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  lvlCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  mainButton: { width: '100%', height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  mainButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
});

