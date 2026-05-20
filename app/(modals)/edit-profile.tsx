import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { appStorage } from '@/lib/storage';
import { useTheme } from '@/lib/theme';
import { ImprovementArea, KnowledgeLevel, Gender, PracticeLevel, UserProfile } from '@/lib/types';

const IMPROVEMENT_AREAS: ImprovementArea[] = ['prayer', 'quran', 'dhikr', 'fasting', 'character', 'family', 'knowledge', 'charity'];

const KNOWLEDGE_LEVELS: { value: KnowledgeLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const PRAYER_LEVELS: { value: PracticeLevel; label: string }[] = [
  { value: 'none', label: 'Not regular' },
  { value: 'some', label: 'Some prayers' },
  { value: 'most', label: 'Most prayers' },
  { value: 'all', label: 'All 5 prayers' },
];

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>('beginner');
  const [prayerConsistency, setPrayerConsistency] = useState<PracticeLevel>('some');
  const [improvementAreas, setImprovementAreas] = useState<ImprovementArea[]>([]);
  const [dailyMinutes, setDailyMinutes] = useState('30');
  const [personalGoal, setPersonalGoal] = useState('');
  const [challenges, setChallenges] = useState('');
  const [commitmentLevel, setCommitmentLevel] = useState(5);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const state = await appStorage.getState();
      if (state?.userProfile) {
        const p = state.userProfile;
        setName(p.name);
        setAge(String(p.age));
        setKnowledgeLevel(p.knowledgeLevel);
        setPrayerConsistency(p.prayerConsistency);
        setImprovementAreas(p.improvementAreas);
        setDailyMinutes(String(p.dailyMinutes));
        setPersonalGoal(p.personalGoal);
        setChallenges(p.challenges);
        setCommitmentLevel(p.commitmentLevel);
      }
    })();
  }, []);

  const toggleArea = (area: ImprovementArea) => {
    setImprovementAreas((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const state = await appStorage.getState();
      if (!state?.userProfile) return;
      const updated: UserProfile = {
        ...state.userProfile,
        name: name.trim(),
        age: parseInt(age) || 25,
        knowledgeLevel,
        prayerConsistency,
        improvementAreas,
        dailyMinutes: parseInt(dailyMinutes) || 30,
        personalGoal,
        challenges,
        commitmentLevel,
      };
      await appStorage.updateState({ userProfile: updated });
      await appStorage.saveProfile(updated);
      router.back();
    } catch {
      // error
    } finally {
      setSaving(false);
    }
  };

  const s = makeStyles(colors);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Edit Profile', headerStyle: { backgroundColor: colors.cream }, headerTintColor: colors.primaryGreen }} />
      <SafeAreaView style={[s.container, { backgroundColor: colors.cream }]}>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

          <Text style={s.label}>Name</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} placeholderTextColor={colors.mutedText} accessibilityLabel="Your name" />

          <Text style={s.label}>Age</Text>
          <TextInput style={s.input} value={age} onChangeText={setAge} keyboardType="number-pad" placeholderTextColor={colors.mutedText} accessibilityLabel="Your age" />

          <Text style={s.label}>Knowledge Level</Text>
          {KNOWLEDGE_LEVELS.map((kl) => (
            <TouchableOpacity key={kl.value} style={[s.optionButton, knowledgeLevel === kl.value && s.optionButtonActive]} onPress={() => setKnowledgeLevel(kl.value)} accessibilityLabel={kl.label}>
              <Text style={[s.optionText, knowledgeLevel === kl.value && s.optionTextActive]}>{kl.label}</Text>
            </TouchableOpacity>
          ))}

          <Text style={s.label}>Prayer Consistency</Text>
          {PRAYER_LEVELS.map((pl) => (
            <TouchableOpacity key={pl.value} style={[s.optionButton, prayerConsistency === pl.value && s.optionButtonActive]} onPress={() => setPrayerConsistency(pl.value)} accessibilityLabel={pl.label}>
              <Text style={[s.optionText, prayerConsistency === pl.value && s.optionTextActive]}>{pl.label}</Text>
            </TouchableOpacity>
          ))}

          <Text style={s.label}>Focus Areas</Text>
          <View style={s.chipsContainer}>
            {IMPROVEMENT_AREAS.map((area) => (
              <TouchableOpacity key={area} style={[s.chip, improvementAreas.includes(area) && s.chipActive]} onPress={() => toggleArea(area)} accessibilityLabel={`${area} focus area`}>
                <Text style={[s.chipText, improvementAreas.includes(area) && s.chipTextActive]}>{area.charAt(0).toUpperCase() + area.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.label}>Daily Time (minutes)</Text>
          <TextInput style={s.input} value={dailyMinutes} onChangeText={setDailyMinutes} keyboardType="number-pad" placeholderTextColor={colors.mutedText} accessibilityLabel="Daily minutes" />

          <Text style={s.label}>Personal Goal</Text>
          <TextInput style={[s.input, s.textArea]} value={personalGoal} onChangeText={setPersonalGoal} multiline numberOfLines={3} placeholderTextColor={colors.mutedText} accessibilityLabel="Personal goal" />

          <Text style={s.label}>Challenges</Text>
          <TextInput style={[s.input, s.textArea]} value={challenges} onChangeText={setChallenges} multiline numberOfLines={3} placeholderTextColor={colors.mutedText} accessibilityLabel="Challenges" />

          <Text style={s.label}>Commitment Level (1-10)</Text>
          <View style={s.sliderContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <TouchableOpacity key={level} style={[s.levelButton, commitmentLevel === level && s.levelButtonActive]} onPress={() => setCommitmentLevel(level)} accessibilityLabel={`Commitment level ${level}`}>
                <Text style={[s.levelText, commitmentLevel === level && s.levelTextActive]}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[s.saveButton, saving && s.saveButtonDisabled]} onPress={handleSave} disabled={saving} accessibilityLabel="Save profile changes">
            <Text style={s.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const makeStyles = (c: typeof import('@/lib/theme').lightTheme) =>
  StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 40 },
    label: { fontSize: 14, fontWeight: '600', color: c.darkText, marginBottom: 8, marginTop: 12 },
    input: { borderWidth: 1.5, borderColor: c.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: c.darkText, marginBottom: 8, backgroundColor: c.inputBackground },
    textArea: { minHeight: 80, paddingTop: 12, textAlignVertical: 'top' },
    optionButton: { borderWidth: 1.5, borderColor: c.border, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 8, backgroundColor: c.inputBackground },
    optionButtonActive: { borderColor: c.mediumGreen, backgroundColor: c.paleGreen },
    optionText: { fontSize: 14, color: c.mediumText },
    optionTextActive: { color: c.primaryGreen, fontWeight: '600' },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    chip: { borderWidth: 1.5, borderColor: c.border, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, backgroundColor: c.inputBackground },
    chipActive: { borderColor: c.gold, backgroundColor: c.paleGold },
    chipText: { fontSize: 12, color: c.mediumText },
    chipTextActive: { color: c.gold, fontWeight: '600' },
    sliderContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap' },
    levelButton: { width: '18%', aspectRatio: 1, borderWidth: 1.5, borderColor: c.border, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8, backgroundColor: c.inputBackground },
    levelButtonActive: { borderColor: c.mediumGreen, backgroundColor: c.paleGreen },
    levelText: { fontSize: 14, fontWeight: '600', color: c.mediumText },
    levelTextActive: { color: c.primaryGreen },
    saveButton: { backgroundColor: c.mediumGreen, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
    saveButtonDisabled: { opacity: 0.6 },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  });
