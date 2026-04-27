import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { appStorage } from '@/lib/storage';
import { useTheme } from '@/lib/theme';
import { ImprovementArea, KnowledgeLevel, Gender, PracticeLevel } from '@/lib/types';

const STEPS = ['Your Name', 'Age', 'Gender', 'Knowledge Level', 'Prayer Consistency', 'Areas to Improve', 'Daily Time', 'Personal Goal', 'Challenges', 'Commitment'];

const IMPROVEMENT_AREAS: ImprovementArea[] = ['prayer', 'quran', 'dhikr', 'fasting', 'character', 'family', 'knowledge', 'charity'];

const KNOWLEDGE_LEVELS: { value: KnowledgeLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner - Learning the basics' },
  { value: 'intermediate', label: 'Intermediate - Practicing regularly' },
  { value: 'advanced', label: 'Advanced - Deep knowledge' },
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const PRAYER_LEVELS: { value: PracticeLevel; label: string }[] = [
  { value: 'none', label: 'Not praying regularly' },
  { value: 'some', label: 'Some prayers daily' },
  { value: 'most', label: 'Most prayers daily' },
  { value: 'all', label: 'All 5 prayers daily' },
];

const PERSONAL_GOAL_OPTIONS = [
  'Establish consistent 5 daily prayers',
  'Read Quran daily with understanding',
  'Strengthen my relationship with Allah',
  'Build better Islamic habits',
  'Improve my character and manners',
  'Learn more about my faith',
  'Reconnect with Islam after a gap',
  'Become a better Muslim role model',
];

const CHALLENGE_OPTIONS = [
  'Waking up for Fajr',
  'Staying consistent',
  'Lack of motivation',
  'Distractions & social media',
  'Not knowing enough Arabic',
  'Finding time for worship',
  'Overcoming bad habits',
  'Staying focused during prayer',
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
  const [personalGoal, setPersonalGoal] = useState('');
  const [challenges, setChallenges] = useState('');
  const [commitmentLevel, setCommitmentLevel] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const toggleArea = (area: ImprovementArea) => {
    setImprovementAreas((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const profile = {
        name, age: parseInt(age) || 25, gender, knowledgeLevel, prayerConsistency,
        improvementAreas, dailyMinutes: parseInt(dailyMinutes) || 30,
        personalGoal, challenges, commitmentLevel,
        createdAt: new Date().toISOString(), planStartDate: new Date().toISOString(),
      };
      await appStorage.saveProfile(profile);
      await appStorage.initState(profile);
      router.replace('/(tabs)');
    } catch { /* error */ } finally { setIsLoading(false); }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.progressContainer}>
          <Text style={[styles.stepText, { color: colors.mediumText }]}>Step {step + 1} of {STEPS.length}</Text>
          <View style={[styles.progressBar, { backgroundColor: colors.paleGreen }]}>
            <View style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%`, backgroundColor: colors.mediumGreen }]} />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.title, { color: colors.primaryGreen }]}>{STEPS[step]}</Text>

          {step === 0 && (
            <>
              <Text style={[styles.label, { color: colors.darkText }]}>What is your name?</Text>
              <TextInput style={[styles.input, { borderColor: colors.border, color: colors.darkText, backgroundColor: colors.inputBackground }]} placeholder="Enter your name" value={name} onChangeText={setName} placeholderTextColor={colors.mutedText} accessibilityLabel="Your name" />
            </>
          )}

          {step === 1 && (
            <>
              <Text style={[styles.label, { color: colors.darkText }]}>How old are you?</Text>
              <TextInput style={[styles.input, { borderColor: colors.border, color: colors.darkText, backgroundColor: colors.inputBackground }]} placeholder="Enter your age" value={age} onChangeText={setAge} keyboardType="number-pad" placeholderTextColor={colors.mutedText} accessibilityLabel="Your age" />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={[styles.label, { color: colors.darkText }]}>What is your gender?</Text>
              {GENDERS.map((g) => (
                <TouchableOpacity key={g.value} style={[styles.optionButton, { borderColor: colors.border, backgroundColor: colors.inputBackground }, gender === g.value && { borderColor: colors.mediumGreen, backgroundColor: colors.paleGreen }]} onPress={() => setGender(g.value)} accessibilityLabel={g.label} accessibilityRole="button">
                  <Text style={[styles.optionText, { color: colors.mediumText }, gender === g.value && { color: colors.primaryGreen, fontWeight: '600' }]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              <Text style={[styles.label, { color: colors.darkText }]}>What is your Islamic knowledge level?</Text>
              {KNOWLEDGE_LEVELS.map((kl) => (
                <TouchableOpacity key={kl.value} style={[styles.optionButton, { borderColor: colors.border, backgroundColor: colors.inputBackground }, knowledgeLevel === kl.value && { borderColor: colors.mediumGreen, backgroundColor: colors.paleGreen }]} onPress={() => setKnowledgeLevel(kl.value)} accessibilityLabel={kl.label} accessibilityRole="button">
                  <Text style={[styles.optionText, { color: colors.mediumText }, knowledgeLevel === kl.value && { color: colors.primaryGreen, fontWeight: '600' }]}>{kl.label}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 4 && (
            <>
              <Text style={[styles.label, { color: colors.darkText }]}>How consistently do you pray the 5 daily prayers?</Text>
              {PRAYER_LEVELS.map((pl) => (
                <TouchableOpacity key={pl.value} style={[styles.optionButton, { borderColor: colors.border, backgroundColor: colors.inputBackground }, prayerConsistency === pl.value && { borderColor: colors.mediumGreen, backgroundColor: colors.paleGreen }]} onPress={() => setPrayerConsistency(pl.value)} accessibilityLabel={pl.label} accessibilityRole="button">
                  <Text style={[styles.optionText, { color: colors.mediumText }, prayerConsistency === pl.value && { color: colors.primaryGreen, fontWeight: '600' }]}>{pl.label}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 5 && (
            <>
              <Text style={[styles.label, { color: colors.darkText }]}>Select areas you want to improve (select multiple):</Text>
              {IMPROVEMENT_AREAS.map((area) => (
                <TouchableOpacity key={area} style={[styles.checkboxButton, { borderColor: colors.border, backgroundColor: colors.inputBackground }, improvementAreas.includes(area) && { borderColor: colors.gold, backgroundColor: colors.paleGold }]} onPress={() => toggleArea(area)} accessibilityLabel={`${area} focus area`} accessibilityRole="button">
                  <Text style={[styles.checkboxText, { color: colors.mediumText }, improvementAreas.includes(area) && { color: colors.gold, fontWeight: '600' }]}>{area.charAt(0).toUpperCase() + area.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 6 && (
            <>
              <Text style={[styles.label, { color: colors.darkText }]}>How many minutes can you dedicate daily?</Text>
              <TextInput style={[styles.input, { borderColor: colors.border, color: colors.darkText, backgroundColor: colors.inputBackground }]} placeholder="Minutes per day" value={dailyMinutes} onChangeText={setDailyMinutes} keyboardType="number-pad" placeholderTextColor={colors.mutedText} accessibilityLabel="Daily minutes" />
              <Text style={[styles.helperText, { color: colors.mutedText }]}>Recommended: 30-60 minutes</Text>
            </>
          )}

          {step === 7 && (
            <>
              <Text style={[styles.label, { color: colors.darkText }]}>What is your main personal goal for these 30 days?</Text>
              <Text style={[styles.helperText, { color: colors.mutedText }]}>Select a suggestion or type your own</Text>
              {PERSONAL_GOAL_OPTIONS.map((goal) => (
                <TouchableOpacity key={goal} style={[styles.suggestionButton, { borderColor: colors.border, backgroundColor: colors.inputBackground }, personalGoal === goal && { borderColor: colors.mediumGreen, backgroundColor: colors.paleGreen }]} onPress={() => setPersonalGoal(personalGoal === goal ? '' : goal)} accessibilityLabel={goal} accessibilityRole="button">
                  <Text style={[styles.suggestionText, { color: colors.mediumText }, personalGoal === goal && { color: colors.primaryGreen, fontWeight: '600' }]}>{goal}</Text>
                </TouchableOpacity>
              ))}
              <TextInput style={[styles.input, styles.textArea, { marginTop: 12, borderColor: colors.border, color: colors.darkText, backgroundColor: colors.inputBackground }]} placeholder="Or type your own goal..." value={personalGoal} onChangeText={setPersonalGoal} multiline numberOfLines={3} placeholderTextColor={colors.mutedText} accessibilityLabel="Custom goal" />
            </>
          )}

          {step === 8 && (
            <>
              <Text style={[styles.label, { color: colors.darkText }]}>What challenges do you currently face?</Text>
              <Text style={[styles.helperText, { color: colors.mutedText }]}>Select a suggestion or type your own</Text>
              {CHALLENGE_OPTIONS.map((challenge) => (
                <TouchableOpacity key={challenge} style={[styles.suggestionButton, { borderColor: colors.border, backgroundColor: colors.inputBackground }, challenges === challenge && { borderColor: colors.mediumGreen, backgroundColor: colors.paleGreen }]} onPress={() => setChallenges(challenges === challenge ? '' : challenge)} accessibilityLabel={challenge} accessibilityRole="button">
                  <Text style={[styles.suggestionText, { color: colors.mediumText }, challenges === challenge && { color: colors.primaryGreen, fontWeight: '600' }]}>{challenge}</Text>
                </TouchableOpacity>
              ))}
              <TextInput style={[styles.input, styles.textArea, { marginTop: 12, borderColor: colors.border, color: colors.darkText, backgroundColor: colors.inputBackground }]} placeholder="Or type your own challenge..." value={challenges} onChangeText={setChallenges} multiline numberOfLines={3} placeholderTextColor={colors.mutedText} accessibilityLabel="Custom challenge" />
            </>
          )}

          {step === 9 && (
            <>
              <Text style={[styles.label, { color: colors.darkText }]}>How committed are you? (1 = low, 10 = very high)</Text>
              <View style={styles.sliderContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <TouchableOpacity key={level} style={[styles.levelButton, { borderColor: colors.border, backgroundColor: colors.inputBackground }, commitmentLevel === level && { borderColor: colors.mediumGreen, backgroundColor: colors.paleGreen }]} onPress={() => setCommitmentLevel(level)} accessibilityLabel={`Commitment level ${level}`} accessibilityRole="button">
                    <Text style={[styles.levelText, { color: colors.mediumText }, commitmentLevel === level && { color: colors.primaryGreen }]}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.commitmentText, { color: colors.gold }]}>
                {commitmentLevel <= 3 && 'Ready to explore'}
                {commitmentLevel > 3 && commitmentLevel <= 6 && 'Committed to change'}
                {commitmentLevel > 6 && 'Fully dedicated'}
              </Text>
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {step > 0 && (
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.paleGreen }]} onPress={() => setStep(step - 1)} accessibilityLabel="Go back" accessibilityRole="button">
              <Text style={[styles.buttonSecondaryText, { color: colors.primaryGreen }]}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, { flex: step > 0 ? 1 : 2, backgroundColor: colors.mediumGreen }]} onPress={step === STEPS.length - 1 ? handleComplete : () => setStep(step + 1)} disabled={isLoading} accessibilityLabel={step === STEPS.length - 1 ? 'Begin your journey' : 'Next step'} accessibilityRole="button">
            <Text style={styles.buttonText}>{isLoading ? 'Starting...' : step === STEPS.length - 1 ? 'Begin Journey' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 16, paddingVertical: 20 },
  progressContainer: { marginBottom: 24 },
  stepText: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%' },
  card: { borderRadius: 16, padding: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 12 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 8 },
  textArea: { minHeight: 100, paddingTop: 12, textAlignVertical: 'top' },
  helperText: { fontSize: 12, marginBottom: 16 },
  optionButton: { borderWidth: 1.5, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 10 },
  optionText: { fontSize: 14 },
  checkboxButton: { borderWidth: 1.5, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 10 },
  checkboxText: { fontSize: 14 },
  suggestionButton: { borderWidth: 1.5, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 10 },
  suggestionText: { fontSize: 14 },
  sliderContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap' },
  levelButton: { width: '18%', aspectRatio: 1, borderWidth: 1.5, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  levelText: { fontSize: 14, fontWeight: '600' },
  commitmentText: { textAlign: 'center', fontSize: 14, fontWeight: '500' },
  buttonContainer: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  button: { borderRadius: 12, paddingVertical: 14, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  buttonSecondaryText: { fontSize: 16, fontWeight: '600' },
});
